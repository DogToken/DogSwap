import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, Grid, Box } from "@material-ui/core";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import boneABI from "./abis/bone.json";
import faucetABI from "./abis/faucet.json";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
    background: "#FFFFFF",
    maxWidth: 400,
    margin: "auto",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
    color: theme.palette.primary.main,
    textAlign: "left",
  },
  description: {
    marginBottom: theme.spacing(2),
    textAlign: "left",
  },
  claimButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  space: {
    height: theme.spacing(8),
  },
}));

const getFaucetContractInstance = (networkId, signer, faucetAddress) => {
  return new Contract(faucetAddress, faucetABI, signer);
};

const Faucet = ({ faucetAddress, title, description, claimInterval }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [countdown, setCountdown] = useState(() => {
    const storedCountdown = localStorage.getItem(`countdown_${faucetAddress}`);
    return storedCountdown ? parseInt(storedCountdown, 10) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(`countdown_${faucetAddress}`, countdown.toString());
  }, [countdown, faucetAddress]);

  const handleClaimTokens = async () => {
    setLoading(true);
    const result = await claimTokensFromFaucet();
    setLoading(false);
    setClaimMessage(result.message);
    setCountdown(claimInterval);
  };

  const claimTokensFromFaucet = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const faucetContract = getFaucetContractInstance(networkId, signer, faucetAddress);
      const transaction = await faucetContract.requestTokens();

      await transaction.wait();

      return { success: true, message: "Tokens claimed successfully!" };
    } catch (error) {
      console.error("Error claiming tokens:", error);
      return { success: false, message: "Failed to claim tokens. Please try again later." };
    }
  };

  const renderTimer = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return (
      <Typography variant="body1">
        Next claim available in: {`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
      </Typography>
    );
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.description}>
        {description}
      </Typography>
      <div className={classes.claimButtonContainer}>
        {countdown === 0 && (
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleClaimTokens}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Claim $BONE 🦴"}
          </Button>
        )}
        {countdown > 0 && renderTimer()}
      </div>
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
    </Container>
  );
};

const FaucetPage = () => {
  const faucets = [
    { id: 1, address: "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250", title: "Faucet 1", description: "Welcome to Faucet 1", claimInterval: 1800 },
    { id: 2, address: "0x1111111111111111111111111111111111111111", title: "Faucet 2", description: "Welcome to Faucet 2", claimInterval: 3600 },
    { id: 3, address: "0x2222222222222222222222222222222222222222", title: "Faucet 3", description: "Welcome to Faucet 3", claimInterval: 5400 },
    { id: 4, address: "0x3333333333333333333333333333333333333333", title: "Faucet 4", description: "Welcome to Faucet 4", claimInterval: 7200 },
  ];

  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {faucets.map((faucet) => (
          <Grid item xs={12} key={faucet.id}>
            <Faucet
              faucetAddress={faucet.address}
              title={faucet.title}
              description={faucet.description}
              claimInterval={faucet.claimInterval}
            />
          </Grid>
        ))}
      </Grid>
      <Box className={classes.space}></Box>
    </React.Fragment>
  );
};

export default FaucetPage;
