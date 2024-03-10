import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';

const BoneTokenABI = require('./abis/BoneToken.json'); // Import BoneToken ABI
const MasterChefABI = require('./abis/MasterChef.json'); // Import MasterChef ABI

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
  button: {
    width: '100px',
    margin: theme.spacing(1),
  }
}));

const StakingDapp = () => {
  const classes = useStyles();
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [stake, setStake] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [views, setViews] = useState({
    staked: 'Loading...',
    reward: 'Loading...',
    totalStaked: 'Loading...',
    boneBalance: 'Loading...', 
  });

  useEffect(() => {
    connectToEthereum();
  }, []);

  const connectToEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const masterChefAddress = '0x4f79af8335d41A98386f09d79D19Ab1552d0b925';
        const masterChefContract = new ethers.Contract(masterChefAddress, MasterChefABI, signer);
        setContract(masterChefContract);

        if (masterChefContract) {
          fetchStakingDetails();
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
      if (contract && account) {
        const pid = 3; // Assuming pool ID is 3
        const [
          totalStakedBalance,
          boneTokenBalance,
        ] = await Promise.all([
          contract.totalStakedBalance(pid), // Fetch total staked balance
          fetchBoneTokenBalance(account),
        ]);

        setViews({
          totalStaked: ethers.utils.formatUnits(totalStakedBalance, 18), // Set total staked balance
          boneBalance: ethers.utils.formatUnits(boneTokenBalance, 18), // Changed ebenBalance to boneBalance
        });
      }
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  const fetchBoneTokenBalance = async (userAccount) => {
    try {
      const tokenAddress = '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF'; // BoneToken address
      const tokenContract = new ethers.Contract(tokenAddress, BoneTokenABI, contract.signer);
      const balance = await tokenContract.balanceOf(userAccount);
      return balance;
    } catch (error) {
      console.error('Error fetching Bone token balance:', error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await fetchBoneTokenBalance(account);
      console.log('Formatted balance:', ethers.utils.formatUnits(balance, 18)); // Add this line for debugging
      setViews(prevState => ({
        ...prevState,
        boneBalance: ethers.utils.formatUnits(balance, 18), 
      }));
    };

    fetchBalance();
  }, [contract, account]);

  return (
    <Container>
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Staking
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Bone Token Balance: </strong> {views.boneBalance} $BONE
        </Typography>
        <form className={classes.formContainer} onSubmit={handleStake}>
          <TextField
            label="Stake Amount"
            variant="outlined"
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Stake
          </Button>
        </form>
        <form className={classes.formContainer} onSubmit={handleWithdraw}>
          <TextField
            label="Withdraw Amount"
            variant="outlined"
            type="number"
            value={withdraw}
            onChange={(e) => setWithdraw(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" className={classes.button}>
            Withdraw
          </Button>
        </form>
        <Button onClick={handleClaimReward} variant="contained" color="primary" className={classes.button}>
          Claim Reward
        </Button>
      </Paper>
    </Container>
  );
};

export default StakingDapp;
