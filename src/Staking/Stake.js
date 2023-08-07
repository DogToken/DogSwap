import React, { useState, useEffect, Component } from 'react';
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

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = 37480; // Use the custom network ID (replace with your network ID)

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    } else {
      window.alert('DaiToken contract not deployed to detected network.');
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
    } else {
      window.alert('DappToken contract not deployed to detected network.');
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() });
    } else {
      window.alert('TokenFarm contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false });
      });
    });
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false });
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    };
  }

  render() {
    const classes = useStyles();

    let content;
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />;
    }

    return (
      <div>
        <Container className={classes.root} maxWidth="sm">
          <Typography variant="h4" className={classes.title}>
            Stake Tokens
          </Typography>
          <Paper elevation={3} className={classes.formContainer}>
            <Typography variant="h6" className={classes.paragraph}>
              Your Account: {this.state.account}
            </Typography>
            <Typography variant="body1" className={classes.paragraph}>
              Dai Token Balance: {this.state.daiTokenBalance}
            </Typography>
            <Typography variant="body1" className={classes.paragraph}>
              Dapp Token Balance: {this.state.dappTokenBalance}
            </Typography>
            <Typography variant="body1" className={classes.paragraph}>
              Staking Balance: {this.state.stakingBalance}
            </Typography>
            <div className={classes.form}>
              <TextField
                label="Stake Amount"
                variant="outlined"
                onChange={(e) => this.setState({ stakeAmount: e.target.value })}
              />
              <Button variant="contained" color="primary" onClick={() => this.stakeTokens(this.state.stakeAmount)}>
                Stake Tokens
              </Button>
            </div>
            <div className={classes.form}>
              <TextField
                label="Unstake Amount"
                variant="outlined"
                onChange={(e) => this.setState({ unstakeAmount: e.target.value })}
              />
              <Button variant="contained" color="secondary" onClick={() => this.unstakeTokens(this.state.unstakeAmount)}>
                Unstake Tokens
              </Button>
            </div>
            {content}
          </Paper>
        </Container>
      </div>
    );
  }
}

export default App;
