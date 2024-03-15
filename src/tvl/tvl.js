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

      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      let wmintPriceInUSDC = 0;
      let bonePriceInUSDC = 0;

      // Calculate price of WMINT in USDC using the reserves of the WMINT-USDC pool
      const wmintPool = POOLS.find(pool => pool.name === "WMINT-USDC");
      const wmintReserves = await new Contract(wmintPool.address, pairABI.abi, signer).getReserves();
      const wmintReserve0 = parseFloat(wmintReserves[0]); // Convert to float
      const wmintReserve1 = parseFloat(wmintReserves[1]); // Convert to float
      // Adjusting the decimal precision for WMINT
      wmintPriceInUSDC = wmintReserve1 / (wmintReserve0 * Math.pow(10, 12)); // Adjusting for 18 decimals of WMINT
      setWmintPrice(wmintPriceInUSDC.toFixed(6)); // Limiting to 6 digits after the comma

      // Calculate price of $BONE using the reserves of the $BONE-WMINT pool
      const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
      const boneReserves = await new Contract(bonePool.address, pairABI.abi, signer).getReserves();
      const boneReserve0 = parseFloat(boneReserves[0]); // Convert to float
      const boneReserve1 = parseFloat(boneReserves[1]); // Convert to float
      // Adjusting the decimal precision for BONE
      const boneReserveWMINT = bonePool.reserve0 === wmintPool.reserve0 ? boneReserve0 : boneReserve1;
      bonePriceInUSDC = (boneReserveWMINT / Math.pow(10, 18)) / ((wmintReserve1 / Math.pow(10, 12)) * wmintPriceInUSDC); // Adjusting for 18 decimals of WMINT, 12 decimals of WMINT-USDC pool, and 6 decimals of USDC
      setBonePrice(bonePriceInUSDC.toFixed(6)); // Limiting to 6 digits after the comma

      // Calculate TVL using the prices obtained
      let tvl = 0;
      for (const pool of POOLS) {
        // Add your calculation logic here to calculate TVL for each pool based on prices
        // For example: const poolTVL = reserve0 * priceOfToken0 + reserve1 * priceOfToken1;
        // Accumulate poolTVL to calculate overall TVL
        // Example: tvl += poolTVL;
      }

      setTVLData(tvl);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TVL data:", error);
      setLoading(false);
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
            {/* Display TVL value here */}
          </Typography>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 MINTME = ${wmintPrice} USD
          </Typography>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 🦴 BONE = ${bonePrice} USD
          </Typography>
          {/* Additional information or calculations can be displayed here */}
        </>
      )}
      <Box className={classes.space}></Box>
    </Container>
  );
};

export default TVLPage;
