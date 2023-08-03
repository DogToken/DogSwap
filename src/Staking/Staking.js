import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  makeStyles,
  Paper,
  TextField,
  Button,
  Box,
} from "@material-ui/core";
import { ethers } from "ethers";
import { initializeContracts } from "../web3";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
    "& > *": {
      marginRight: theme.spacing(1),
    },
  },
}));

function Staking({ account }) {
  const classes = useStyles();
  const [views, setViews] = useState({});
  const [stake, setStake] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [TOKEN, setToken] = useState(null);
  const [STAKING_CONTRACT, setStakingContract] = useState(null);
  const provider = new ethers.providers.JsonRpcProvider("https://node1.mintme.com");

  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const signer = window.ethereum?.getSigner();
      if (!signer) {
        throw new Error("Web3 provider not found. Make sure to connect your wallet.");
      }
      const amount = ethers.utils.parseEther(stake);

      const Token = TOKEN.connect(signer);
      const allowance = await Token.allowance(account, STAKING_CONTRACT.address);
      if (allowance.lt(amount)) {
        const tx = await Token.approve(STAKING_CONTRACT.address, amount);
        await tx.wait();
      }

      const staking = STAKING_CONTRACT.connect(signer);
      const tx = await staking.stake(amount);
      await tx.wait();
    } catch (error) {
      console.error("Error handling stake:", error.message);
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      const signer = window.ethereum?.getSigner();
      if (!signer) {
        throw new Error("Web3 provider not found. Make sure to connect your wallet.");
      }
      const staking = STAKING_CONTRACT.connect(signer);

      const amount = ethers.utils.parseEther(withdraw);
      const tx = await staking.withdraw(amount);
      await tx.wait();
    } catch (error) {
      console.error("Error handling withdraw:", error.message);
    }
  };

  const handleClaimReward = async () => {
    try {
      const signer = window.ethereum?.getSigner();
      if (!signer) {
        throw new Error("Web3 provider not found. Make sure to connect your wallet.");
      }
      const staking = STAKING_CONTRACT.connect(signer);

      const tx = await staking.claimReward();
      await tx.wait();
    } catch (error) {
      console.error("Error handling claim reward:", error.message);
    }
  };

  async function getStakingViews(account) {
    try {
      const staking = STAKING_CONTRACT.connect(provider.getSigner());
      const [staked, reward, totalStaked] = await Promise.all([
        staking.stakedOf(account),
        staking.rewardOf(account),
        staking.totalStaked(),
      ]);
      setViews({
        staked: ethers.utils.formatEther(staked),
        reward: ethers.utils.formatEther(reward),
        totalStaked: ethers.utils.formatEther(totalStaked),
      });
    } catch (error) {
      console.error("Error fetching staking views:", error.message);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const contracts = await initializeContracts(provider);
        const { TOKEN, STAKING_CONTRACT } = contracts;
        setToken(TOKEN);
        setStakingContract(STAKING_CONTRACT);
        setLoaded(true);
      } catch (error) {
        console.error("Error initializing contracts:", error.message);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (isLoaded && TOKEN && STAKING_CONTRACT && account) {
      getStakingViews(account);
    }
  }, [isLoaded, TOKEN, STAKING_CONTRACT, account]);

  if (!isLoaded) {
    return (
      <div>
        <h2>Staking</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
      <Container>
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Staking
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Staked: </strong> {views.staked} $TREATS
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} $TREATS
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} $TREATS
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
              Stake $TREATS
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
              Withdraw $TREATS
            </Button>
          </form>
          <Button variant="contained" color="secondary" onClick={handleClaimReward}>
            Claim Reward
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Staking;