import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, Grid, Box, Card, CardContent } from "@material-ui/core";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import boneABI from "../../build/BoneToken.json";
import faucetABI from "../../build/faucet.json";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  faucetCard: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: theme.spacing(3),
    textAlign: "center",
    borderRadius: theme.spacing(1),
  },
  title: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(3),
  },
  claimButton: {
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
  claimButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  space: {
    height: theme.spacing(16), // Increased space at the bottom
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
    const storedCountdown = localStorage.getItem(`countdown_${faucetAddress}`);
    const initialCountdown = storedCountdown ? parseInt(storedCountdown, 10) : claimInterval;
    setCountdown(initialCountdown);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = prevCountdown > 0 ? prevCountdown - 1 : 0;
        localStorage.setItem(`countdown_${faucetAddress}`, newCountdown.toString());
        return newCountdown;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [faucetAddress, claimInterval]);

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

      const gasLimit = 300000; // Adjust this value as needed

      const transaction = await faucetContract.requestTokens({ gasLimit });

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
    <Card className={classes.faucetCard}>
      <CardContent>
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
              className={classes.claimButton}
              onClick={handleClaimTokens}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Claim!"}
            </Button>
          )}
          {countdown > 0 && renderTimer()}
        </div>
        {claimMessage && (
          <Typography variant="body1" className={classes.loading}>
            {claimMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const FaucetPage = () => {
  const faucets = [
    { id: 1, address: "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250", title: "The $BONE Faucet", description: "Claim 0.1 $BONE every 30 minutes. Stake, trade or hodl your tokens to support the DogSwap ecosystem", claimInterval: 1800 },
  ];

  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container spacing={4} justify="center">
        {faucets.map((faucet) => (
          <Grid item xs={12} sm={6} md={4} key={faucet.id}>
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
    </Container>
  );
};

export default FaucetPage;