// StakingPool.jsx
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, CircularProgress, TextField, Grid, Card, CardContent } from '@material-ui/core';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faHandHoldingUsd, faClock } from '@fortawesome/free-solid-svg-icons';
import boneTokenABI from './abis/BoneToken.json';
import masterChefABI from './abis/MasterChef.json';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
      marginBottom: theme.spacing(2),
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
    subTitle: {
      marginBottom: theme.spacing(3),
      color: theme.palette.text.secondary,
    },
    stakingContainer: {
      marginTop: theme.spacing(3),
    },
    stakingAction: {
      marginTop: theme.spacing(2),
    },
    balanceCard: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.secondary.light,
      borderRadius: theme.spacing(1),
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    balanceIcon: {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
    balanceText: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
  }));

  const StakingPool = ({
    title,
    subTitle,
    BONE_TOKEN_ADDRESS,
    MASTER_CHEF_ADDRESS,
    poolId,
  }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState('');
    const [stakingAmount, setStakingAmount] = useState('');
    const [totalTokens, setTotalTokens] = useState('0');
    const [walletTokens, setWalletTokens] = useState('0');
    const [pendingBone, setPendingBone] = useState('0');
    const [stakedAmount, setStakedAmount] = useState('0');

  useEffect(() => {
    // Fetch and set balances
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
      const boneTokenContract = getBoneTokenInstance(networkId, signer);
      const masterChefContract = getMasterChefInstance(networkId, signer);

      // Fetch the balance of the user's wallet
      const walletBalance = await boneTokenContract.balanceOf(signer.getAddress());
      const formattedWalletBalance = ethers.utils.formatUnits(walletBalance, 18);
      setWalletTokens(parseFloat(formattedWalletBalance).toFixed(5));

      // Fetch total token supply
      const totalSupply = await boneTokenContract.totalSupply();
      const formattedTotalSupply = ethers.utils.formatUnits(totalSupply, 18);
      setTotalTokens(parseFloat(formattedTotalSupply).toFixed(5));

      // Fetch pending rewards
      const pendingRewards = await masterChefContract.pendingBone(poolId, signer.getAddress());
      const formattedPendingRewards = ethers.utils.formatUnits(pendingRewards, 18);
      setPendingBone(parseFloat(formattedPendingRewards).toFixed(5));

      // Fetch staked amount
      const userInfo = await masterChefContract.userInfo(poolId, signer.getAddress());
      const formattedStakedAmount = ethers.utils.formatUnits(userInfo.amount, 18);
      setStakedAmount(parseFloat(formattedStakedAmount).toFixed(5));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      setLoading(true);

      // Parse staking amount
      const amountToStake = ethers.utils.parseUnits(stakingAmount, 18);

      // Ensure the amount to stake is greater than zero
      if (amountToStake.lte(0)) {
        throw new Error('Please enter a valid amount to stake.');
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get Bone token instance
      const boneTokenContract = getBoneTokenInstance(networkId, signer);

      // Approve spending tokens
      const approveTx = await boneTokenContract.approve(MASTER_CHEF_ADDRESS, amountToStake);
      await approveTx.wait();

      // Deposit tokens
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.deposit(poolId, amountToStake, { value: 0 });
      await transaction.wait();

      setClaimMessage('Tokens staked successfully!');

      // Refresh balances after staking
      fetchBalances();
    } catch (error) {
      console.error('Error staking tokens:', error);
      setClaimMessage('Failed to stake tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      setLoading(true);

      // Parse withdrawal amount
      const amountToWithdraw = ethers.utils.parseUnits(stakingAmount, 18);

      // Ensure the amount to withdraw is greater than zero
      if (amountToWithdraw.lte(0)) {
        throw new Error('Please enter a valid amount to withdraw.');
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Withdraw tokens
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.withdraw(poolId, amountToWithdraw);
      await transaction.wait();

      setClaimMessage('Tokens withdrawn successfully!');

      // Refresh balances after withdrawal
      fetchBalances();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setClaimMessage('Failed to withdraw tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getBoneTokenInstance = (networkId, signer) => {
    return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
  };

  const getMasterChefInstance = (networkId, signer) => {
    return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        {subTitle}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faCoins} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Total $BONE: {totalTokens}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faWallet} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Your $BONE: {walletTokens}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faHandHoldingUsd} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Staked $BONE: {stakedAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.balanceCard}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faClock} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Pending $BONE: {pendingBone}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div className={classes.stakingContainer}>
        <TextField
          label="Amount to Stake/Withdraw"
          variant="outlined"
          fullWidth
          margin="normal"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
        />
        <div className={classes.stakingAction}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleStakeTokens}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Stake $BONE 💰"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handleWithdrawTokens}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Withdraw $BONE 💰"}
          </Button>
        </div>
      </div>
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
    </div>
  );
};

export default StakingPool;