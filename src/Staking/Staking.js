import React, { useEffect, useCallback, useState } from "react";
import { Container, Typography, makeStyles, Paper, Link } from "@material-ui/core";
import { ethers } from "ethers";
import { provider, getContracts } from "../web3";

const TOKEN_ADDRESS = "0x38924b27e5A43A6D9AD1377eC828C056120f06a0"; // Replace with the actual token address
const STAKING_ADDRESS = "0x38D613a0636Bd10043405D76e52f7540eeE913d0"; // Replace with the actual staking address

const { TOKEN, STAKING_CONTRACT } = getContracts(TOKEN_ADDRESS, STAKING_ADDRESS);

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
    getStakingViews(account).then(setViews).catch(console.error);
  }, [account, getStakingViews]);

  if (!views.staked) {
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
          <strong>Staked: </strong> {views.staked} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Reward: </strong> {views.reward} $BONE
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Total Staked: </strong> {views.totalStaked} $BONE
        </Typography>
        <div style={{ display: "flex" }}>
          <form onSubmit={handleStake}>
            <label htmlFor="stake">Stake</label>
            <input
              id="stake"
              placeholder="0.0 $BONE"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
            <button type="submit">Stake $BONE</button>
          </form>
          <form onSubmit={handleWithdraw}>
            <label htmlFor="withdraw">Withdraw</label>
            <input
              id="withdraw"
              placeholder="0.0 $BONE"
              value={withdraw}
              onChange={(e) => setWithdraw(e.target.value)}
            />
            <button type="submit">Withdraw $BONE</button>
          </form>
        </div>
        <button onClick={handleClaimReward}>Claim Reward</button>
      </Paper>
    </Container>
  );
}

export default Staking;
