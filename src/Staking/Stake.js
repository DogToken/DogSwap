import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, makeStyles } from '@material-ui/core';
import Web3 from 'web3';
import DaiToken from './abis/DogToken.json';
import DappToken from './abis/BoneToken.json';
import TokenFarm from './abis/TokenFarm.json';
import Main from './Main';
import './Stake.css';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  const [account, setAccount] = useState(null);
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [dappTokenBalance, setDappTokenBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      const networkId = 37480; // Use the custom network ID (replace with your network ID)

      // Load DogSwap
      const daiTokenData = DaiToken.networks[networkId];
      if (daiTokenData) {
        const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
        setDaiToken(daiToken);
        let daiTokenBalance = await daiToken.methods.balanceOf(account).call();
        setDaiTokenBalance(daiTokenBalance.toString());
      } else {
        window.alert('DogSwap contract not deployed to detected network.');
      }

      // Load BoneToken
      const dappTokenData = DappToken.networks[networkId];
      if (dappTokenData) {
        const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
        setDappToken(dappToken);
        let dappTokenBalance = await dappToken.methods.balanceOf(account).call();
        setDappTokenBalance(dappTokenBalance.toString());
      } else {
        window.alert('Bone Token contract not deployed to detected network.');
      }

      // Load TokenFarm
      const tokenFarmData = TokenFarm.networks[networkId];
      if (tokenFarmData) {
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
        setTokenFarm(tokenFarm);
        let stakingBalance = await tokenFarm.methods.stakingBalance(account).call();
        setStakingBalance(stakingBalance.toString());
      } else {
        window.alert('TokenFarm contract not deployed to detected network.');
      }

      setLoading(false);
    } else {
      setAccount(null); // If no accounts found, set account to null
      window.alert('Please connect your wallet to access the blockchain data.');
      setLoading(false);
    }
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  function stakeTokens(amount) {
    setLoading(true);
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash) => {
      tokenFarm.methods.stakeTokens(amount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false);
      });
    });
  }

  function unstakeTokens(amount) {
    setLoading(true);
    tokenFarm.methods.unstakeTokens().send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false);
    });
  }

  let content;
  if (loading || account === null) { // Check if account is null to avoid the error
    content = <p id="loader" className="text-center">Loading...</p>;
  } else {
    content = <Main
      daiTokenBalance={daiTokenBalance}
      dappTokenBalance={dappTokenBalance}
      stakingBalance={stakingBalance}
      stakeTokens={stakeTokens}
      unstakeTokens={unstakeTokens}
    />;
  }

  return (
    <div>
      <Container className={classes.root} maxWidth="sm">
        <Typography variant="h4" className={classes.title}>
          Stake DogSwap - Earn $BONE
        </Typography>
        <Paper elevation={3} className={classes.formContainer}>
          <Typography variant="h6" className={classes.paragraph}>
            Your Account: {account}
          </Typography>
          <Typography variant="body1" className={classes.paragraph}>
            DogSwap Balance: {daiTokenBalance}
          </Typography>
          <Typography variant="body1" className={classes.paragraph}>
            $BONE Balance: {dappTokenBalance}
          </Typography>
          <Typography variant="body1" className={classes.paragraph}>
            Staking Balance: {stakingBalance}
          </Typography>
          <div className={classes.form}>
            <TextField
              label="Stake Amount"
              variant="outlined"
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={() => stakeTokens(stakeAmount)}>
              Stake Tokens
            </Button>
          </div>
          <div className={classes.form}>
            <TextField
              label="Unstake Amount"
              variant="outlined"
              onChange={(e) => setUnstakeAmount(e.target.value)}
            />
            <Button variant="contained" color="secondary" onClick={() => unstakeTokens(unstakeAmount)}>
              Unstake Tokens
            </Button>
          </div>
          {content}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
