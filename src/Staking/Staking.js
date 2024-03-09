import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';
import MasterChefABI from './abis/MasterChef.json'; // Import the MasterChef contract ABI

const useStyles = makeStyles((theme) => ({
  // Your styling classes
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

  useEffect(() => {
    connectToEthereum();
  }, []);

  const connectToEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId === 24734) { // Assuming MINTME chain ID is 24734
          const signer = provider.getSigner();
          setAccount(await signer.getAddress());

          // Instantiate the MasterChef contract using the ABI and provider
          const masterChefAddress = '0x9d8dd79f2d4ba9e1c3820d7659a5f5d2fa1c22ef'; // Replace with your actual MasterChef contract address
          const masterChefContract = new ethers.Contract(masterChefAddress, MasterChefABI, signer);
          setContract(masterChefContract);

          fetchStakingDetails(); // Fetch the user's staking details
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
      // Call functions from the MasterChef contract to fetch staking details
      const userInfo = await contract.userInfo(account);
      const totalAllocPoint = await contract.totalAllocPoint();
      const bonePerBlock = await contract.bonePerBlock();

      // Update the views state with fetched data
      setViews({
        staked: userInfo.amount.toString(), // Assuming userInfo.amount represents staked amount
        reward: userInfo.rewardDebt.toString(), // Assuming userInfo.rewardDebt represents staking reward
        totalStaked: totalAllocPoint.toString(), // Assuming totalAllocPoint represents total staked
        bonePerBlock: bonePerBlock.toString() // Assuming bonePerBlock represents BONE per block
      });
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  const handleStake = async (event) => {
    // Implement stake function if needed
  };

  const handleWithdraw = async (event) => {
    // Implement withdraw function if needed
  };

  const handleClaimReward = async () => {
    // Implement claim reward function if needed
  };

  return (
    <Container>
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Staking
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Staked: </strong> {views.staked} // Assuming views.staked represents staked amount
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} // Assuming views.reward represents staking reward
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} // Assuming views.totalStaked represents total staked
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>BONE per Block: </strong> {views.bonePerBlock} // Assuming views.bonePerBlock represents BONE per block
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
            <Button type="submit" variant="contained" color="primary">
              Withdraw
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
