import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField, Grid, Card, CardContent } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import boneTokenABI from "./abis/BoneToken.json"; // Import the ABI for the $BONE token contract
import masterChefABI from "./abis/MasterChef.json"; // Import the ABI for the MasterChef contract

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    textAlign: "center",
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    background: theme.palette.background.default,
    boxShadow: theme.shadows[3],
  },
  button: {
    margin: theme.spacing(2),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  subTitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.light,
  },
  cardContent: {
    textAlign: "left",
  },
}));

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF"; // Update with the $BONE token contract address
const MASTER_CHEF_ADDRESS = "0x4f79af8335d41A98386f09d79D19Ab1552d0b925"; // Update with the MasterChef contract address

const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

const getMasterChefInstance = (networkId, signer) => {
  return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
};

const Staking = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [stakingAmount, setStakingAmount] = useState("");
  const [totalTokens, setTotalTokens] = useState("0");
  const [walletTokens, setWalletTokens] = useState("0");
  const [pendingBone, setPendingBone] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0"); // State variable to hold the staked amount

  // Define masterChefContract outside of useEffect
  const provider = getProvider();
  const signer = getSigner(provider);
  const masterChefContract = getMasterChefInstance(0, signer); // Assuming pool id is 0

  useEffect(() => {
    // Fetch and set balances
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const networkId = await getNetwork(provider);
      const boneTokenContract = getBoneTokenInstance(networkId, signer);

      // Fetch the balance of the user's wallet
      const walletBalance = await boneTokenContract.balanceOf(signer.getAddress());
      const formattedWalletBalance = ethers.utils.formatUnits(walletBalance, 18); // Assuming 18 decimals for the token
      setWalletTokens(formattedWalletBalance.toString());

      // Fetch total token supply
      const totalSupply = await boneTokenContract.totalSupply();
      const formattedTotalSupply = ethers.utils.formatUnits(totalSupply, 18); // Assuming 18 decimals for the token
      setTotalTokens(formattedTotalSupply.toString());

      // Fetch pending rewards
      const pendingRewards = await masterChefContract.pendingBone(0, signer.getAddress()); // Assuming pool id is 0
      const formattedPendingRewards = ethers.utils.formatUnits(pendingRewards, 18); // Assuming 18 decimals for the token
      setPendingBone(formattedPendingRewards.toString());

      // Fetch staked amount
      const userInfo = await masterChefContract.userInfo(0, signer.getAddress()); // Assuming pool id is 0
      const formattedStakedAmount = ethers.utils.formatUnits(userInfo.amount, 18); // Assuming 18 decimals for the token
      setStakedAmount(formattedStakedAmount.toString());
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      setLoading(true);

      // Stake tokens
      const transaction = await masterChefContract.deposit(0, ethers.utils.parseUnits(stakingAmount, 18)); // Assuming 'deposit' is the correct method name, 0 is the pool id
      await transaction.wait();

      setClaimMessage("Tokens staked successfully!");

      // Refresh balances after staking
      fetchBalances();
    } catch (error) {
      console.error("Error staking tokens:", error);
      setClaimMessage("Failed to stake tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      setLoading(true);

      // Withdraw tokens
      const transaction = await masterChefContract.withdraw(0, ethers.utils.parseUnits(stakingAmount, 18)); // Assuming 'withdraw' is the correct method name, 0 is the pool id
      await transaction.wait();

      setClaimMessage("Tokens withdrawn successfully!");

      // Refresh balances after withdrawal
      fetchBalances();
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      setClaimMessage("Failed to withdraw tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        💰 Staking $BONE
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Stake your $BONE tokens to earn rewards and support the network.
      </Typography>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">Total Tokens</Typography>
              <Typography variant="body1">{totalTokens}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">Wallet Tokens</Typography>
              <Typography variant="body1">{walletTokens}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">Staked Tokens</Typography>
              <Typography variant="body1">{stakedAmount}</Typography> {/* Display staked amount */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">Pending Rewards</Typography>
              <Typography variant="body1">{pendingBone}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TextField
        label="Amount to Stake/Withdraw"
        variant="outlined"
        fullWidth
        margin="normal"
        value={stakingAmount}
        onChange={(e) => setStakingAmount(e.target.value)}
      />
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
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
    </Container>
  );
};

export default Staking;
