import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import pairABI from "../build/IUniswapV2Pair.json";
import boneTokenABI from "./abis/BoneToken.json";

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
  { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
  { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
  { id: 3, name: "WMINT-DOGSP", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
  { id: 5, name: "$BONE-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
  // Add more pools as needed
];

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF"; // Update with the $BONE token contract address
const BONE_TOKEN_DECIMALS = 18; // Update with the actual decimal precision of the $BONE token

const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

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
      const wmintReserve0 = wmintReserves[0] / 10 ** 18; // Adjusting the decimal precision for WMINT
      const wmintReserve1 = wmintReserves[1] / 10 ** 6; // Adjusting the decimal precision for USDC
      wmintPriceInUSDC = getTokenPrice(wmintReserve0, wmintReserve1);
      setWmintPrice(wmintPriceInUSDC.toFixed(8)); // Limiting to 8 digits after the comma

      // Calculate price of $BONE in USDC using the $BONE-WMINT pool
      const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
      const boneReserves = await new Contract(bonePool.address, pairABI.abi, signer).getReserves();
      const boneReserve0 = boneReserves[0] / 10 ** BONE_TOKEN_DECIMALS; // Adjusting the decimal precision for BONE
      const boneReserve1 = boneReserves[1] / 10 ** 18; // Adjusting the decimal precision for WMINT
      const boneInWMINT = getTokenPrice(boneReserve0, boneReserve1);
      bonePriceInUSDC = boneInWMINT * wmintPriceInUSDC;
      setBonePrice(bonePriceInUSDC.toFixed(8)); // Limiting to 8 digits after the comma

      // Calculate TVL using the prices obtained
      let tvl = 0;
      for (const pool of POOLS) {
        const poolReserves = await new Contract(pool.address, pairABI.abi, signer).getReserves();
        const reserve0 = poolReserves[0] / 10 ** 18; // Adjusting the decimal precision for token0
        const reserve1 = poolReserves[1] / (pool.name.includes("USDC") ? 10 ** 6 : 10 ** 18); // Adjusting the decimal precision for token1

        // Determine the token pair in the pool
        const token0 = pool.name.split("-")[0];
        const token1 = pool.name.split("-")[1];

        // Calculate the value of each token reserve in USDC
        let token0ValueInUSDC;
        let token1ValueInUSDC;
        if (token0 === "WMINT") {
          token0ValueInUSDC = reserve0 * wmintPriceInUSDC;
        } else if (token0 === "$BONE") {
          token0ValueInUSDC = reserve0 * bonePriceInUSDC;
        } else {
          token0ValueInUSDC = reserve0; // Assuming token0 is already in USDC
        }

        if (token1 === "WMINT") {
          token1ValueInUSDC = reserve1 * wmintPriceInUSDC;
        } else if (token1 === "$BONE") {
          token1ValueInUSDC = reserve1 * bonePriceInUSDC;
        } else if (token1 === "USDC") {
          token1ValueInUSDC = reserve1; // No need to adjust for USDC
        } else {
          token1ValueInUSDC = reserve1; // Assuming token1 is already in USDC
        }

        // Sum the values of the two token reserves in USDC
        const poolTVL = token0ValueInUSDC + token1ValueInUSDC;
        tvl += poolTVL;
      }

      setTVLData(tvl.toFixed(8)); // Limiting to 8 digits after the comma
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TVL data:", error);
      setLoading(false);
    }
  };

  const getTokenPrice = (reserve0, reserve1) => {
    if (reserve0 === 0 || reserve1 === 0) {
      return 0;
    }
    const tokenPrice = reserve1 / reserve0;
    return tokenPrice;
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">Total Value Locked (TVL)</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box className={classes.space}></Box>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            TVL = ${tvlData} USD
          </Typography>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 MINTME = ${wmintPrice} USD
          </Typography>
          <Typography variant="subtitle1" className={classes.priceInfo}>
            1 🦴 BONE = ${bonePrice} USD
          </Typography>
        </>
      )}
      <Box className={classes.space}></Box>
    </Container>
  );
};

export default TVLPage;