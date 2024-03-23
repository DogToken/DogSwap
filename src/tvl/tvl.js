import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box } from "@material-ui/core";

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
  priceInfo: {
    marginTop: theme.spacing(2),
  },
}));

const TVLPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [mintmePrice, setMintmePrice] = useState(null);

  useEffect(() => {
    fetchMintmePrice();
  }, []);

  const fetchMintmePrice = async () => {
    try {
      setLoading(true);

      // Fetch MINTME price
      const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=MINTME", {
        headers: {
          "X-CMC_PRO_API_KEY": "62467a6a-a3a9-4cc4-9fbf-c2a382627596", // Replace with your API key
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch MINTME price');
      }

      const data = await response.json();
      const mintmePrice = data.data.MINTME.quote.USD.price;
      setMintmePrice(mintmePrice);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching MINTME price:", error);
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">MINTME Price</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 MINTME = ${mintmePrice} USD
          </Typography>
        </>
      )}
      <Box className={classes.space}></Box>
    </Container>
  );
};

export default TVLPage;
