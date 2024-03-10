import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';
import { doesTokenExist, getSigner } from "../ethereumFunctions"; // Import necessary functions

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
    width: '100px', // Adjust the width as needed
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
    poolBalance: 'Loading...',
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
          stakingBalance,
          stakingReward,
          totalStakedBalance,
          boneTokenBalance,
        ] = await Promise.all([
          contract.stakingBalanceOf(pid, account),
          contract.stakingRewardOf(pid, account),
          contract.totalStakedBalance(pid),
          doesTokenExist('0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', contract.signer)
            .then(tokenContract => tokenContract.balanceOf(account)), // Using doesTokenExist to fetch token balance
        ]);

        setViews({
          staked: ethers.utils.formatUnits(stakingBalance, 18),
          reward: ethers.utils.formatUnits(stakingReward, 18),
          totalStaked: ethers.utils.formatUnits(totalStakedBalance, 18),
          boneBalance: ethers.utils.formatUnits(boneTokenBalance, 18),
          poolBalance: ethers.utils.formatUnits(stakingBalance, 18) // Use staking balance as pool balance
        });
      }
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(stake.toString(), 18);
      const pid = 3; // Assuming you want to stake in the first pool (pool id 0)
      const depositTx = await contract.deposit(pid, amount, {
        gasLimit: 500000, // Set a reasonable gas limit for depositing
      });
      await depositTx.wait();
      setStake('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(withdraw.toString(), 18);
      const pid = 3; // Assuming you want to withdraw from the first pool (pool id 0)
      const withdrawTx = await contract.withdraw(pid, amount, {
        gasLimit: 300000, // Set a reasonable gas limit for withdrawing
      });
      await withdrawTx.wait();
      setWithdraw('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
    }
  };

  const handleClaimReward = async () => {
    try {
      const pid = 3; // Assuming pool ID is 3
      const claimTx = await contract.claimReward(pid, {
        gasLimit: 300000, // Set a reasonable gas limit for claiming reward
      });
      await claimTx.wait();
      fetchStakingDetails();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  // Fetch Bone Token Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (contract && account) {
          const balance = await doesTokenExist('0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', contract.signer)
            .then(tokenContract => tokenContract.balanceOf(account)); // Using doesTokenExist to fetch token balance
          setViews(prevState => ({
            ...prevState,
            boneBalance: ethers.utils.formatUnits(balance, 18),
          }));
        }
      } catch (error) {
        console.error('Error fetching bone token balance:', error);
      }
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
          <strong>Staked: </strong> {views.staked} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Bone Token Balance: </strong> {views.boneBalance} $BONE
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
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Stake
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
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Withdraw
            </Button>
          </form>
          <Button variant="contained" color="secondary" onClick={handleClaimReward} className={classes.button}>
            Claim
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StakingDapp;
