import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField } from "@material-ui/core";
import { Contract, BigNumber } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import masterChefABI from "./abis/MasterChef.json";
import boneTokenABI from "./abis/BoneToken.json"; // Import the ABI for the $BONE token contract

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
    marginTop: theme.spacing(2),
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
}));

const MASTER_CHEF_ADDRESS = "0x4f79af8335d41A98386f09d79D19Ab1552d0b925"; // Update with your MasterChef contract address
const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF"; // Update with the $BONE token contract address

const getMasterChefInstance = (networkId, signer) => {
  return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
};

const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

const Staking = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [stakingAmount, setStakingAmount] = useState("");
  const [totalTokens, setTotalTokens] = useState(BigNumber.from(0));
  const [totalStakedTokens, setTotalStakedTokens] = useState(BigNumber.from(0));
  const [walletTokens, setWalletTokens] = useState(BigNumber.from(0));
  const [pendingRewards, setPendingRewards] = useState(BigNumber.from(0));

  useEffect(() => {
    // Fetch and set balances
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const boneTokenContract = getBoneTokenInstance(networkId, signer);

      const [total, staked, wallet, rewards] = await Promise.all([
        masterChefContract.totalAllocPoint(),
        masterChefContract.userInfo(0, signer.getAddress()), // Updated method name
        boneTokenContract.balanceOf(signer.getAddress()),
        masterChefContract.pendingBone(0, signer.getAddress()), // Assuming 'pendingBone' is the correct method name
      ]);

      setTotalTokens(total);
      setTotalStakedTokens(staked.amount); // Access the 'amount' property of the returned object
      setWalletTokens(wallet);
      setPendingRewards(rewards);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.deposit(stakingAmount); // Assuming 'deposit' is the correct method name

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

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        💰 Staking $BONE
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Stake your $BONE tokens to earn rewards and support the network.
      </Typography>
      <TextField
        label="Stake Amount"
        variant="outlined"
        value={stakingAmount}
        onChange={(e) => setStakingAmount(e.target.value)}
        className={classes.textField}
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
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
      {/* Display balance information */}
      <Typography variant="body1" className={classes.subTitle}>
        Total Tokens: {totalTokens.toString()}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Total Staked Tokens: {totalStakedTokens.toString()}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Wallet Tokens: {walletTokens.toString()}
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Pending Rewards: {pendingRewards.toString()}
      </Typography>
    </Container>
  );
};

export default Staking;
