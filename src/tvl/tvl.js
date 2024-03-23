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
  const [coinPrice, setCoinPrice] = useState(null);
  const coinId = 'mintme-com-coin'; // Replace with the desired cryptocurrency ID or symbol

  useEffect(() => {
    fetchCoinPrice();
  }, []);

  const fetchCoinPrice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const coinPriceData = response.data[coinId]?.usd;
      if (coinPriceData !== undefined) {
        setCoinPrice(coinPriceData);
      } else {
        throw new Error(`${coinId} price data is unavailable`);
      }
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching ${coinId} price:`, error);
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">Current Coin Price</Typography>
      {loading ? (
        <CircularProgress />
      ) : coinPrice !== null ? (
        <>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 {coinId.toUpperCase()} = ${coinPrice} USD
          </Typography>
          <Box className={classes.space}></Box>
        </>
      ) : (
        <Typography variant="subtitle1" className={classes.priceInfo}>
          Failed to fetch {coinId.toUpperCase()} price
        </Typography>
      )}
    </Container>
  );
};

export default TVLPage;