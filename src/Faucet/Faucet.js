// Faucet.jsx
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from '@material-ui/core';
import { Contract } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../ethereumFunctions';
import boneABI from './abis/bone.json';
import faucetABI from './abis/faucet.json';
import FaucetTimer from './FaucetTimer';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  faucetCard: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(3),
  },
  claimButton: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  faucetDivider: {
    margin: theme.spacing(4, 0),
  },
}));

const getFaucetContractInstance = (networkId, signer, faucetAddress) => {
  return new Contract(faucetAddress, faucetABI, signer);
};

const FaucetClaimButton = ({ loading, handleClaimTokens, classes }) => (
  <Button
    variant="contained"
    className={classes.claimButton}
    onClick={handleClaimTokens}
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} color="inherit" /> : 'Claim!'}
  </Button>
);

const FaucetPage = () => {
  const classes = useStyles();
  const faucets = [
    {
      id: 1,
      address: '0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250',
      title: 'The $BONE Faucet',
      description: 'Claim 0.1 $BONE each 30 minutes. Stake, trade or hodl your tokens to support the DogSwap ecosystem',
      claimInterval: 1800,
    },
  ];

  const handleClaimTokens = async (faucetAddress, claimInterval) => {
    setLoading(true);
    const result = await claimTokensFromFaucet(faucetAddress);
    setLoading(false);
    setClaimMessage(result.message);
    setCountdown(claimInterval);
  };

  const claimTokensFromFaucet = async (faucetAddress) => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const faucetContract = getFaucetContractInstance(networkId, signer, faucetAddress);

      const gasLimit = 300000; // Adjust this value as needed

      const transaction = await faucetContract.requestTokens({ gasLimit });

      await transaction.wait();

      return { success: true, message: 'Tokens claimed successfully!' };
    } catch (error) {
      console.error('Error claiming tokens:', error);
      return { success: false, message: 'Failed to claim tokens. Please try again later.' };
    }
  };

  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const storedCountdowns = {};
    faucets.forEach((faucet) => {
      const storedCountdown = localStorage.getItem(`countdown_${faucet.address}`);
      storedCountdowns[faucet.address] = storedCountdown ? parseInt(storedCountdown, 10) : faucet.claimInterval;
    });
    setCountdown(storedCountdowns);
  }, [faucets]);

  useEffect(() => {
    const intervals = {};
    faucets.forEach((faucet) => {
      intervals[faucet.address] = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = { ...prevCountdown };
          newCountdown[faucet.address] = prevCountdown[faucet.address] > 0 ? prevCountdown[faucet.address] - 1 : 0;
          localStorage.setItem(`countdown_${faucet.address}`, newCountdown[faucet.address].toString());
          return newCountdown;
        });
      }, 1000);
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [faucets]);

  return (
    <Container className={classes.container}>
      <Grid container spacing={4} justify="center">
        {faucets.map((faucet) => (
          <Grid item xs={12} sm={6} md={4} key={faucet.id}>
            <Card className={classes.faucetCard}>
              <CardContent>
                <Typography variant="h6" className={classes.title}>
                  {faucet.title}
                </Typography>
                <Typography variant="body1" className={classes.description}>
                  {faucet.description}
                </Typography>
                {countdown[faucet.address] === 0 ? (
                  <FaucetClaimButton
                    loading={loading}
                    handleClaimTokens={() => handleClaimTokens(faucet.address, faucet.claimInterval)}
                    classes={classes}
                  />
                ) : (
                  <FaucetTimer countdown={countdown[faucet.address]} />
                )}
                {claimMessage && (
                  <Typography variant="body1" style={{ marginTop: '1rem' }}>
                    {claimMessage}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box className={classes.faucetDivider}>
        <Divider />
      </Box>
      {/* Additional features can be added here */}
    </Container>
  );
};

export default FaucetPage;