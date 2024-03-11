import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Paper, Typography, Button, makeStyles } from '@material-ui/core';
import Web3Provider from '../network'; // Import the Web3Provider from the network file
import FaucetABI from './abis/faucet.json'; // Import the ABI file

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paragraph: {
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '200px',
    margin: theme.spacing(2),
  },
}));

const Faucet = () => {
  const classes = useStyles();
  const [cookieBalance, setCookieBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [faucetContract, setFaucetContract] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // Already handled by the Web3Provider
    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  const fetchAccountDetails = async (network) => {
    try {
      if (faucetContract && network.account) {
        console.log('Fetching account details...');
        const provider = new ethers.providers.Web3Provider(network.provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(network.faucetAddress, FaucetABI, signer);
        const cookieBalanceResult = await contract.balanceOf(network.account);
        const contractBalanceResult = await contract.balanceOf('0x13672f4bC2fd37ee68E70f7030e1731701d60830');
        const waitTime = await contract.waitTime();
        console.log('Cookie Balance:', cookieBalanceResult);
        console.log('Contract Balance:', contractBalanceResult);
        console.log('Waiting Time:', waitTime);
        setCookieBalance(cookieBalanceResult);
        setContractBalance(contractBalanceResult);
        setWaitingTime(waitTime);
        setFaucetContract(contract);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const getCookieTokens = async (network) => {
    try {
      if (faucetContract && network.account) {
        console.log('Getting cookie tokens...');
        // Modify this part to interact with the contract using the signer from the network
      }
    } catch (error) {
      console.error('Error getting cookie tokens:', error);
    }
  };

  return (
    <Web3Provider
      render={(network) => (
        <Container>
          <Paper className={classes.root}>
            <Typography variant="h4">Cookie Faucet</Typography>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Your Cookie Balance:</strong> {cookieBalance} Cookies
            </Typography>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Contract Balance:</strong> {contractBalance} Cookies
            </Typography>
            <Typography variant="body1" className={classes.paragraph}>
              <strong>Waiting Time:</strong> {waitingTime / 60} minutes
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => getCookieTokens(network)}
            >
              Get Cookies
            </Button>
          </Paper>
        </Container>
      )}
    />
  );
};

export default Faucet;
