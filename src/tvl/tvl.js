import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import pairABI from "../build/IUniswapV2Pair.json";
import boneTokenABI from "./abis/BoneToken.json"; // Import the ABI for the $BONE token contract
import masterChefABI from "./abis/MasterChef.json"; // Import the ABI for the MasterChef contract

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
      const wmintReserve0 = parseFloat(wmintReserves[0]) / Math.pow(10, 18); // Adjusting the decimal precision for WMINT
      const wmintReserve1 = parseFloat(wmintReserves[1]) / Math.pow(10, 6); // Adjusting the decimal precision for USDC
      wmintPriceInUSDC = wmintReserve1 / wmintReserve0;
      setWmintPrice(wmintPriceInUSDC.toFixed(8)); // Limiting to 8 digits after the comma
  
      // Fetch the total supply of $BONE token
      const boneTokenContract = getBoneTokenInstance(networkId, signer);
      const totalSupply = await boneTokenContract.totalSupply();
      const boneSupply = parseFloat(ethers.utils.formatUnits(totalSupply, 18)); // Assuming 18 decimals for the token
  
      // Calculate TVL using the prices obtained
      let tvl = 0;
      for (const pool of POOLS) {
        const poolReserves = await new Contract(pool.address, pairABI.abi, signer).getReserves();
        const reserve0 = parseFloat(poolReserves[0]) / Math.pow(10, 18); // Assuming 18 decimals for token0
        const reserve1 = parseFloat(poolReserves[1]) / Math.pow(10, 6); // Assuming 6 decimals for token1
        const poolTVL = reserve0 * wmintPriceInUSDC + reserve1 * wmintPriceInUSDC; // Adjust as needed
        tvl += poolTVL;
      }
  
      setTVLData(tvl.toFixed(8)); // Limiting to 8 digits after the comma
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
            ${tvlData}
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
