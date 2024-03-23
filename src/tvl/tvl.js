import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box } from "@material-ui/core";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
    background: "#FFFFFF",
    maxWidth: 600,
    margin: "auto",
  },
  space: {
    height: theme.spacing(4),
  },
  tvlValue: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginTop: theme.spacing(2),
  },
  priceInfo: {
    marginTop: theme.spacing(2),
  },
}));

const TVLPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [mintmePrice, setMintmePrice] = useState(null);
  const API_KEY = 'CG-Mo5o1cwWq1sTrhHMJ9pKe4P5'; // Replace 'YOUR_API_KEY' with your actual API key

  useEffect(() => {
    fetchMintmePrice();
  }, []);

  const fetchMintmePrice = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=mintme&vs_currencies=usd', {
        headers: {
          'X-CoinAPI-Key': API_KEY
        }
      });
      console.log('Response data:', response.data); // Log the response data
      const price = response.data?.mintme?.usd;

      if (price !== undefined) {
        setMintmePrice(price);
      } else {
        throw new Error('MINTME price data is unavailable');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching MINTME price:', error);
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">Total Value Locked (TVL)</Typography>
      {loading ? (
        <CircularProgress />
      ) : mintmePrice !== null ? (
        <>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 MINTME = ${mintmePrice} USD
          </Typography>
          <Box className={classes.space}></Box>
        </>
      ) : (
        <Typography variant="subtitle1" className={classes.priceInfo}>
          Failed to fetch MINTME price
        </Typography>
      )}
    </Container>
  );
};

export default TVLPage;
