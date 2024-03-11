import React from 'react';
import { Container, Paper, Typography, Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
    fontFamily: 'Roboto, sans-serif',
  },
  description: {
    marginBottom: theme.spacing(4),
    fontFamily: 'Open Sans, sans-serif',
  },
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    fontFamily: 'Roboto, sans-serif',
  },
  balanceDropdown: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const StakingMechanism = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleStake = () => {
    // Handle staking logic
  };

  const handleWithdraw = () => {
    // Handle withdrawal logic
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <div className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleStake}
            >
              + Compound
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleWithdraw}
            >
              - Withdraw
            </Button>
          </div>
        </Paper>
        <div className={classes.balanceDropdown}>
          <Button
            aria-controls="balance-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            endIcon={<ExpandMoreIcon />}
          >
            Your Balances
          </Button>
          <Menu
            id="balance-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Staked Balance: 1000 Tokens</MenuItem>
            <MenuItem onClick={handleMenuClose}>Available Balance: 5000 Tokens</MenuItem>
          </Menu>
        </div>
      </Paper>
    </Container>
  );
};

export default StakingMechanism;
