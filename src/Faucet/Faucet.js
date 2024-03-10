import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FaucetABI from './abis/faucet.json'; // Update with correct file path
import ERC20ABI from './abis/erc20.json'; // Update with correct file path
import { Container, Paper, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  button: {
    width: '200px',
    margin: theme.spacing(2),
  },
}));

const Faucet = () => {
  const classes = useStyles();
  const [account, setAccount] = useState('');
  const [balanceETH, setBalanceETH] = useState(0);
  const [balanceToken, setBalanceToken] = useState(0);
  const [faucetContract, setFaucetContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);

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
          const faucetContractInstance = new provider.eth.Contract(FaucetABI, '0x0000000000000000000000000000000000000000'); // Update with faucet address
          const tokenContractInstance = new provider.eth.Contract(ERC20ABI, '0x0000000000000000000000000000000000000000'); // Update with token address
          setFaucetContract(faucetContractInstance);
          setTokenContract(tokenContractInstance);
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
      const balance = await tokenContract.methods.balanceOf(account).call();
      setBalanceToken(balance);
      const ethBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
      setBalanceETH(Web3.utils.fromWei(ethBalance, 'ether'));
      checkFaucet();
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const checkFaucet = async () => {
    try {
      const tokenAmountResult = await faucetContract.methods.tokenAmount().call();
      setTokenAmount(tokenAmountResult);
      const faucetBalance = await tokenContract.methods.balanceOf('0x0000000000000000000000000000000000000000').call(); // Update with faucet address
      if (faucetBalance < tokenAmountResult) {
        console.log('Sorry - the faucet is out of tokens! But don\'t worry, we\'re on it!');
      } else {
        const allowedToWithdraw = await faucetContract.methods.allowedToWithdraw(account).call();
        if (allowedToWithdraw && balanceToken < tokenAmountResult * 1000) {
          console.log('You can request tokens.');
        } else {
          const waitTime = await faucetContract.methods.waitTime().call();
          console.log('Sorry - you can only request tokens every ' + (waitTime / 60) + ' minutes. Please wait!');
          setWaitingTime(waitTime);
        }
      }
    } catch (error) {
      console.error('Error checking faucet:', error);
    }
  };

  const getTestTokens = async () => {
    try {
      const nonce = await window.ethereum.request({ method: 'eth_getTransactionCount', params: [account, 'latest'] });
      await faucetContract.methods.requestTokens().send({ from: account, nonce });
    } catch (error) {
      console.error('Error getting test tokens:', error);
    }
  };

  return (
    <Container>
      <Paper className={classes.root}>
        <Typography variant="h4">Faucet</Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Address:</strong> {account}
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>ETH Balance:</strong> {balanceETH} ETH
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Token Balance:</strong> {balanceToken} Tokens
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Token Amount:</strong> {tokenAmount} Test Tokens
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Waiting Time:</strong> {waitingTime / 60} minutes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={getTestTokens}
        >
          Request Tokens
        </Button>
      </Paper>
    </Container>
  );
};

export default Faucet;
