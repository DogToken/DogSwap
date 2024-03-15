import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box } from "@material-ui/core";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import pairABI from "../build/IUniswapV2Pair.json";

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

const POOLS = [
  { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10", reserve0: 0, reserve1: 0 }, // Replace "0x..." with actual address
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189", reserve0: 0, reserve1: 0 }, // Replace "0x..." with actual address
  // Add more pools as needed
];

const TVLPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tvlData, setTVLData] = useState(null);
  const [wmintPrice, setWmintPrice] = useState(null);
  const [bonePrice, setBonePrice] = useState(null);

  useEffect(() => {
    fetchTVLData();
  }, []);

  const fetchTVLData = async () => {
    try {
      setLoading(true);

      // Fetch the price of WMINT from the API
      const wmintPrice = await getCryptoPrice();
      setWmintPrice(wmintPrice);

      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      // Calculate TVL for each pool
      let tvl = 0;
      for (const pool of POOLS) {
        const poolContract = new Contract(pool.address, pairABI.abi, signer);
        const reserves = await poolContract.getReserves();
        const reserve0 = reserves[0];
        const reserve1 = reserves[1];

        // Calculate TVL for the pool based on prices and reserves
        let poolTVL = 0;
        if (pool.name === "$BONE-WMINT") {
          // Calculate TVL for $BONE-WMINT pool
          poolTVL = (reserve0 * bonePrice + reserve1 * wmintPrice);
        } else if (pool.name === "WMINT-USDC") {
          // Calculate TVL for WMINT-USDC pool
          poolTVL = (reserve0 * wmintPrice + reserve1);
        }

        // Accumulate poolTVL to calculate overall TVL
        tvl += poolTVL;
      }

      setTVLData(tvl);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TVL data:", error);
      setLoading(false);
    }
  };

  // Function to fetch the price of WMINT from the API
  const getCryptoPrice = async () => {
    try {
      const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=mintme-com-coin", {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": "62467a6a-a3a9-4cc4-9fbf-c2a382627596",
        },
      });
      const data = await response.json();
      return data.data["mintme-com-coin"].quote.USD.price;
    } catch (error) {
      console.error("Error fetching WMINT price:", error);
      return 0;
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">Total Value Locked (TVL)</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" className={classes.tvlValue}>
            {tvlData ? `$${tvlData.toFixed(2)}` : "N/A"}
          </Typography>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 MintMe = ${wmintPrice} USD
          </Typography>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 🦴BONE = ${bonePrice} USD
          </Typography>
          {/* Additional information or calculations can be displayed here */}
        </>
      )}
      <Box className={classes.space}></Box>
    </Container>
  );
};

export default TVLPage;
