import React from 'react';
import { Container, Paper, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
    fontFamily: 'Roboto, sans-serif', // Google Font
  },
  description: {
    marginBottom: theme.spacing(4),
    fontFamily: 'Open Sans, sans-serif', // Google Font
  },
  button: {
    width: '200px',
    margin: theme.spacing(2),
    fontFamily: 'Roboto, sans-serif', // Google Font
  },
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    fontFamily: 'Open Sans, sans-serif', // Google Font
  },
}));

const StakingMechanism = () => {
  const classes = useStyles();

  const handleStake = () => {
    // Handle staking logic
  };

  const handleUnstake = () => {
    // Handle unstaking logic
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <Typography variant="h3" className={classes.title}>
          Staking Mechanism
        </Typography>
        <Typography variant="body1" className={classes.description}>
          Stake your tokens to earn rewards and unlock exciting features.
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="h4">Your Staked Balance:</Typography>
          <Typography variant="body1">1000 Tokens</Typography>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleStake}
        >
          Stake Tokens
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleUnstake}
        >
          Unstake Tokens
        </Button>
      </Paper>
    </Container>
  );
};

export default StakingMechanism;
