import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';
import MasterChefABI from './abis/MasterChef.json'; // Import the MasterChef contract ABI

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const StakingDapp = () => {
  const classes = useStyles();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [stake, setStake] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [views, setViews] = useState({
    staked: 0,
    reward: 0,
    totalStaked: 0,
  });

  useEffect(() => {
    connectToEthereum();
  }, []);

  const connectToEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);

        const network = await newProvider.getNetwork();

        if (network.chainId === 24734) { // Assuming you're connecting to MintMe network
          const signer = newProvider.getSigner();
          setAccount(await signer.getAddress());

          const newContract = new ethers.Contract('0x9d8dd79f2d4ba9e1c3820d7659a5f5d2fa1c22ef', MasterChefABI, signer);
          setContract(newContract);

          fetchStakingDetails();
        } else {
          console.log('Unsupported network. Please switch to the correct network.');
        }
      } else {
        console.log('Please install MetaMask to use this dApp.');
      }
    } catch (error) {
      console.error('Error connecting to Ethereum:', error);
    }
  };

  const fetchStakingDetails = async () => {
    try {
      const userInfo = await contract.userInfo(account);
      const totalAllocPoint = await contract.totalAllocPoint();
      const lpSupply = await contract.poolInfo(0);

      setViews({
        staked: ethers.utils.formatEther(userInfo.amount),
        reward: ethers.utils.formatEther(await contract.pendingBone(0, account)),
        totalStaked: ethers.utils.formatEther(lpSupply),
      });
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseEther(stake.toString());
      const tx = await contract.deposit(0, amount);
      await tx.wait();
      setStake('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseEther(withdraw.toString());
      const tx = await contract.withdraw(0, amount);
      await tx.wait();
      setWithdraw('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
    }
  };

  const handleClaimReward = async () => {
    try {
      const tx = await contract.deposit(0);
      await tx.wait();
      fetchStakingDetails();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  return (
    <Container>
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Staking
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Staked: </strong> {views.staked} BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} BONE
        </Typography>
        <Box mt={3} className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleStake}>
            <TextField
              label="Stake"
              variant="outlined"
              size="small"
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Stake BONE
            </Button>
          </form>
          <form className={classes.form} onSubmit={handleWithdraw}>
            <TextField
              label="Withdraw"
              variant="outlined"
              size="small"
              type="number"
              value={withdraw}
              onChange={(e) => setWithdraw(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Withdraw BONE
            </Button>
          </form>
          <Button variant="contained" color="secondary" onClick={handleClaimReward}>
            Claim Reward
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StakingDapp;
