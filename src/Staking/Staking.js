import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress } from "@material-ui/core";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import boneABI from "./abis/bone.json"; // Import the ABI for $BONE token

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

const STAKING_CONTRACT_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";

const getStakingContractInstance = (networkId, signer) => {
  return new Contract(STAKING_CONTRACT_ADDRESS, boneABI, signer);
};

const Staking = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  const handleStakeTokens = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const stakingContract = getStakingContractInstance(networkId, signer);
      // Replace 'stakeTokens' with the actual method name for staking in your contract
      const transaction = await stakingContract.stakeTokens();

      await transaction.wait();

      setClaimMessage("Tokens staked successfully!");
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
    </Container>
  );
};

export default Staking;
