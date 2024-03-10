import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FaucetABI from './abis/faucet.json'; // Update with correct file path
import { Container, Paper, Typography, Button, makeStyles } from '@material-ui/core';

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
  const [account, setAccount] = useState('');
  const [cookieBalance, setCookieBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [faucetContract, setFaucetContract] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new Web3(window.ethereum);
        const accounts = await provider.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId = await provider.eth.net.getId();
        if (networkId === 12345) { // Update with your network ID
          const faucetContractInstance = new provider.eth.Contract(FaucetABI, '0x98d64dbe9bd305cd21e94d4d20ae7f48fde429b0'); // Update with faucet address
          setFaucetContract(faucetContractInstance);
          fetchAccountDetails();
        } else {
          console.log('Please connect to the correct network.');
        }
      } else {
        console.log('Please install MetaMask to use this dApp.');
      }
    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const cookieBalanceResult = await faucetContract.methods.balanceOf(account).call();
      const contractBalanceResult = await faucetContract.methods.balanceOf('0x13672f4bC2fd37ee68E70f7030e1731701d60830').call(); // Update with faucet address
      const waitTime = await faucetContract.methods.waitTime().call();
      setCookieBalance(cookieBalanceResult);
      setContractBalance(contractBalanceResult);
      setWaitingTime(waitTime);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const getCookieTokens = async () => {
    try {
      await faucetContract.methods.requestTokens().send({ from: account });
    } catch (error) {
      console.error('Error getting cookie tokens:', error);
    }
  };

  return (
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
          onClick={getCookieTokens}
        >
          Request Cookies
        </Button>
      </Paper>
    </Container>
  );
};

export default Faucet;
