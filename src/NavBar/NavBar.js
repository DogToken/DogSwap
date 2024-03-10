import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    textDecoration: "none",
  },
}));

function Navbar() {
  const classes = useStyles();

  // Example state for connection status and wallet address
  const isConnected = true; // Set to true if connected to MetaMask
  const walletAddress = "0xAbCdEf1234567890"; // Set to the user's wallet address

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          DogSwap.Online
        </Typography>
        <Button
          component={RouterLink}
          to="/about"
          variant="outlined"
          className={classes.link}
        >
          About
        </Button>
        <Button
          component={RouterLink}
          to="/privacy"
          variant="outlined"
          className={classes.link}
        >
          Privacy
        </Button>
        {isConnected ? (
          <Typography variant="body1">
            Connected: {walletAddress}
          </Typography>
        ) : (
          <Button color="inherit" variant="outlined" className={classes.link}>
            Connect with MetaMask
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
