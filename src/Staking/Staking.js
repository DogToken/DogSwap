import React, { useEffect, useState, useCallback } from "react";
import { Container, Typography, makeStyles, Paper } from "@material-ui/core";
import { ethers } from "ethers";
import { provider, initializeContracts } from "../web3";

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
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
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

  const handleStake = async (event) => {
    event.preventDefault();
    const signer = provider.getSigner(account);
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
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const amount = ethers.utils.parseEther(withdraw);
    const tx = await staking.withdraw(amount);
    await tx.wait();
  };

  const handleClaimReward = async () => {
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.claimReward();
    await tx.wait();
  };

  const getStakingViews = useCallback(async (account) => {
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);
    const [staked, reward, totalStaked] = await Promise.all([
      staking.stakedOf(account),
      staking.rewardOf(account),
      staking.totalStaked(),
    ]);
    return {
      staked: ethers.utils.formatEther(staked),
      reward: ethers.utils.formatEther(reward),
      totalStaked: ethers.utils.formatEther(totalStaked),
    };
  }, []);

  useEffect(() => {
    initializeContracts()
      .then((contracts) => {
        const { TOKEN, STAKING_CONTRACT } = contracts;
        setToken(TOKEN);
        setStakingContract(STAKING_CONTRACT);
        setLoaded(true);
      })
      .catch((error) => console.error("Error initializing contracts:", error));
  }, []);

  useEffect(() => {
    if (isLoaded && TOKEN && STAKING_CONTRACT) {
      getStakingViews(account)
        .then(setViews)
        .catch((error) => {
          console.error("Error fetching staking views:", error);
          setViews({});
        });
    }
  }, [isLoaded, TOKEN, STAKING_CONTRACT, account, getStakingViews]);

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
        <div style={{ display: "flex" }}>
          <form onSubmit={handleStake}>
            <label htmlFor="stake">Stake</label>
            <input
              id="stake"
              placeholder="0.0 $TREATS"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
            <button type="submit">Stake $TREATS</button>
          </form>
          <form onSubmit={handleWithdraw}>
            <label htmlFor="withdraw">Withdraw</label>
            <input
              id="withdraw"
              placeholder="0.0 $TREATS"
              value={withdraw}
              onChange={(e) => setWithdraw(e.target.value)}
            />
            <button type="submit">Withdraw $TREATS</button>
          </form>
        </div>
        <button onClick={handleClaimReward}>Claim Reward</button>
      </Paper>
    </Container>
  );
}

export default Staking;
