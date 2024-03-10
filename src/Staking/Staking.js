import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MasterChefABI from './abis/MasterChef.json'; // Import MasterChef ABI
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';

// MasterChef contract address
const masterChefAddress = '0x4f79af8335d41A98386f09d79D19Ab1552d0b925';

const networks = [24734];

export const ChainId = {
  MINTME: 24734,
};

export const routerAddress = new Map();
routerAddress.set(ChainId.MINTME, "0x38D613a0636Bd10043405D76e52f7540eeE913d0");

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
    staked: 0,
    reward: 0,
    totalStaked: 0,
  });

  // Connect to the Ethereum network on component mount
  useEffect(() => {
    connectToEthereum();
  }, []);

  // Function to connect to the Ethereum network and set up the contract
  const connectToEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        // Check if the connected network is supported
        if (network && networks.includes(network.chainId)) {
          const signer = provider.getSigner();
          setAccount(await signer.getAddress());

          // Setup MasterChef contract
          const masterChefContract = new ethers.Contract(masterChefAddress, MasterChefABI, signer);
          // Now you can use the masterChefContract to interact with MasterChef functions
          setContract(masterChefContract); // Set the contract state
          
          // Call fetchStakingDetails only if contract is not null
          if (masterChefContract) {
            fetchStakingDetails(); // Fetch the user's staking details
          }
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

  // Function to fetch the user's staking details and update the views
  const fetchStakingDetails = async () => {
    try {
      if (contract) { // Check if contract is not null
        const stakingBalance = await contract.stakingBalanceOf(account);
        const stakingReward = await contract.stakingRewardOf(account);
        const totalStakedBalance = await contract.totalStakedBalance();

        setViews({
          staked: ethers.utils.formatUnits(stakingBalance, 18),
          reward: ethers.utils.formatUnits(stakingReward, 18),
          totalStaked: ethers.utils.formatUnits(totalStakedBalance, 18),
        });
      }
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  // Function to handle stake submission
  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(stake.toString(), 18);
      const tx = await contract.stakeTokens(amount);
      await tx.wait();
      setStake('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  // Function to handle withdraw submission
  const handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(withdraw.toString(), 18);
      const tx = await contract.unstakeTokens(amount);
      await tx.wait();
      setWithdraw('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
    }
  };

  // Function to handle claiming reward
  const handleClaimReward = async () => {
    try {
      const tx = await contract.claimReward();
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
          <strong>Staked: </strong> {views.staked} $DOGSWAP
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} $DOGSWAP
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
