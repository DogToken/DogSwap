import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, makeStyles } from '@material-ui/core';
import Web3 from 'web3';
import DogToken from './abis/DogToken.json';
import BoneToken from './abis/BoneToken.json';
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
  const [dogToken, setDogToken] = useState({}); // Changed variable name to dogToken
  const [boneToken, setBoneToken] = useState({}); // Changed variable name to boneToken
  const [tokenFarm, setTokenFarm] = useState({});
  const [dogTokenBalance, setDogTokenBalance] = useState('0'); // Changed variable name to dogTokenBalance
  const [boneTokenBalance, setBoneTokenBalance] = useState('0'); // Changed variable name to boneTokenBalance
  const [stakingBalance, setStakingBalance] = useState('0');
  const [loadingWeb3, setLoadingWeb3] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  async function initializeWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      setAccount(window.web3.eth.accounts[0]);
      setLoadingWeb3(false);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      setAccount(window.web3.eth.accounts[0]);
      setLoadingWeb3(false);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      setLoadingWeb3(false);
    }
  }

  async function loadBlockchainData() {
    setLoadingData(true);
    const web3 = window.web3;
    const networkId = 37480; // Use the custom network ID (replace with your network ID)

    // Load DogToken
    const dogTokenData = DogToken.networks[networkId]; // Changed variable name to dogTokenData
    if (dogTokenData) {
      const dogToken = new web3.eth.Contract(DogToken.abi, dogTokenData.address); // Changed variable name to dogToken
      setDogToken(dogToken);
      let dogTokenBalance = await dogToken.methods.balanceOf(account).call();
      setDogTokenBalance(dogTokenBalance.toString());
    } else {
      window.alert('DogToken contract not deployed to detected network.');
    }

    // Load BoneToken
    const boneTokenData = BoneToken.networks[networkId]; // Changed variable name to boneTokenData
    if (boneTokenData) {
      const boneToken = new web3.eth.Contract(BoneToken.abi, boneTokenData.address); // Changed variable name to boneToken
      setBoneToken(boneToken);
      let boneTokenBalance = await boneToken.methods.balanceOf(account).call();
      setBoneTokenBalance(boneTokenBalance.toString());
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

    setLoadingData(false);
  }

  function stakeTokens(amount) {
    setLoadingData(true);
    if (dogToken) {
      dogToken.methods
        .approve(tokenFarm._address, amount)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          tokenFarm.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on('transactionHash', (hash) => {
              setLoadingData(false);
            });
        });
    }
  }

  function unstakeTokens(amount) {
    setLoadingData(true);
    tokenFarm.methods.unstakeTokens().send({ from: account }).on('transactionHash', (hash) => {
      setLoadingData(false);
    });
  }

  let content;
  if (loadingWeb3) {
    content = <p id="loader" className="text-center">Loading Web3...</p>;
  } else if (loadingData) {
    content = <p id="loader" className="text-center">Loading Data...</p>;
  } else {
    content = <Main
      dogTokenBalance={dogTokenBalance}
      boneTokenBalance={boneTokenBalance}
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
            DogToken Balance: {dogTokenBalance}
          </Typography>
          <Typography variant="body1" className={classes.paragraph}>
            $BONE Balance: {boneTokenBalance}
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

