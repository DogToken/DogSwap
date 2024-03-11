import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import faucetABI from "./abis/faucet.json"; // Import the ABI for the faucet contract

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

const FAUCET_ADDRESS = "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250";

const getFaucetContractInstance = (networkId, signer) => {
  return new Contract(FAUCET_ADDRESS, faucetABI, signer);
};

const Faucet = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    checkClaimStatus();
    const interval = setInterval(() => {
      checkClaimStatus();
    }, 10000); // Check claim status every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkClaimStatus = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const faucetContract = getFaucetContractInstance(networkId, signer);

      const waitTime = await faucetContract.waitTime();
      const currentTime = Math.floor(Date.now() / 1000);
      const remaining = waitTime - currentTime;

      setTimeRemaining(remaining);
      setCanClaim(remaining <= 0);
    } catch (error) {
      console.error("Error checking claim status:", error);
    }
  };

  const handleClaimTokens = async () => {
    setLoading(true);
    const result = await claimTokensFromFaucet();
    setLoading(false);
    setClaimMessage(result.message);
  };

  const claimTokensFromFaucet = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const faucetContract = getFaucetContractInstance(networkId, signer);
      const transaction = await faucetContract.requestTokens(); // Use requestTokens instead of claimTokens

      await transaction.wait();

      return { success: true, message: "Tokens claimed successfully!" };
    } catch (error) {
      console.error("Error claiming tokens:", error);
      return { success: false, message: "Failed to claim tokens. Please try again later." };
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        🦴 $BONE Faucet
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Welcome to the $BONE Faucet! Claim some free $BONE tokens to stake or trade them!.
      </Typography>
      {canClaim ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleClaimTokens}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Claim $BONE 🦴"}
        </Button>
      ) : (
        <Typography variant="body1" className={classes.loading}>
          Next claim available in: {formatTime(timeRemaining)}
        </Typography>
      )}
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
    </Container>
  );
};

export default Faucet;
