import React, { useState, useEffect } from 'react';
import { getSigner, getBalanceAndSymbol } from '../ethereumFunctions'; // Update with correct file path
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
  
        const faucetContractAddress = '0x98D64Dbe9Bd305cD21e94D4d20aE7F48FDE429B0'; // Update with correct address
        const faucetContract = new ethers.Contract(faucetContractAddress, FaucetABI, signer);
        setFaucetContract(faucetContract);
  
        if (faucetContract) {
          fetchAccountDetails();
        } else {
          console.error('Faucet contract initialization failed.');
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
      const [cookieBalanceResult, contractBalanceResult] = await Promise.all([
        faucetContract.balanceOf(account),
        faucetContract.balanceOf(chains.routerAddress.get(chains.ChainId.MINTME)),
      ]);
      const waitTime = await faucetContract.waitTime();
      setCookieBalance(cookieBalanceResult);
      setContractBalance(contractBalanceResult);
      setWaitingTime(waitTime);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const getCookieTokens = async () => {
    try {
      await faucetContract.requestTokens({ from: account });
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
