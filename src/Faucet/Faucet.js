import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress } from "@material-ui/core";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import boneABI from "./abis/bone.json"; // Import the ABI for $BONE token
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

const BONE_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";
const FAUCET_ADDRESS = "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250";

const getFaucetContractInstance = (networkId, signer) => {
  return new Contract(FAUCET_ADDRESS, faucetABI, signer);
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

const Faucet = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [claimMessage, setClaimMessage] = React.useState("");

  const handleClaimTokens = async () => {
    setLoading(true);
    const result = await claimTokensFromFaucet();
    setLoading(false);
    setClaimMessage(result.message);
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        🦴 $BONE Faucet
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Welcome to the $BONE Faucet! Claim some free $BONE tokens to stake or trade them!.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleClaimTokens}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Claim $BONE 🦴"}
      </Button>
      {claimMessage && (
        <Typography variant="body1" className={classes.loading}>
          {claimMessage}
        </Typography>
      )}
    </Container>
  );
};

export default Faucet;
