import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import pairABI from "../../build/IUniswapV2Pair.json";
import boneTokenABI from "../../build/BoneToken.json";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: theme.spacing(2),
    background: "#FFFFFF",
    maxWidth: 800,
    margin: "auto",
  },
  space: {
    height: theme.spacing(4),
  },
  card: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const POOLS = [
  { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
  { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
  { id: 5, name: "WMINT-DOGSP", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
  { id: 6, name: "$BONE-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
  { id: 7, name: "1000x-WMINT", address: "0x34D99393593245F3268ceAcf35a17407C49c4D59" },
  { id: 8, name: "1000x-$BONE", address: "0x9763E377ce4E6767F7760D9E1FC7E3c2afBc9Cfb" },
  { id: 9, name: "1000x-DOGSP", address: "0x0cC0D3382fC2826E18606C968842A91e5C52e2b3" },
];

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";
const BONE_TOKEN_DECIMALS = 18;
const coinId = 'webchain';

const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

const TVLPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tvlData, setTVLData] = useState(null);
  const [tvlDataPrev, setTVLDataPrev] = useState(null); // Previous TVL data
  const [mintmePrice, setMintmePrice] = useState(null);
  const [bonePrice, setBonePrice] = useState(null);
  const [bonePriceInUSD, setBonePriceInUSD] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Fetch data every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch MintMe price
      const mintmePriceResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const mintmePriceData = mintmePriceResponse.data[coinId]?.usd;
      if (mintmePriceData !== undefined) {
        setMintmePrice(mintmePriceData);
      } else {
        throw new Error(`${coinId} price data is unavailable`);
      }

      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      // Calculate price of $BONE in MintMe
      const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
      const boneReserves = await new Contract(bonePool.address, pairABI.abi, signer).getReserves();
      const boneReserve0 = boneReserves[0] / 10 ** BONE_TOKEN_DECIMALS; // Adjusting the decimal precision for BONE
      const boneReserve1 = boneReserves[1] / 10 ** 18; // Adjusting the decimal precision for WMINT
      const boneInWMINT = getTokenPrice(boneReserve0, boneReserve1);
      const bonePriceInMintMe = 1 / boneInWMINT;
      const bonePriceInUSDTemp = bonePriceInMintMe * mintmePriceData;
      setBonePriceInUSD(bonePriceInUSDTemp.toFixed(8)); // Limiting to 8 digits after the comma
      setBonePrice(bonePriceInMintMe.toFixed(8)); // Limiting to 8 digits after the comma

      // Calculate TVL using the MintMe price
      let tvl = 0;
      for (const pool of POOLS) {
        const poolReserves = await new Contract(pool.address, pairABI.abi, signer).getReserves();
        const reserve0 = poolReserves[0] / 10 ** 18; // Adjusting the decimal precision for token0
        const reserve1 = poolReserves[1] / 10 ** 18; // Adjusting the decimal precision for token1

        // Determine the token pair in the pool
        const token0 = pool.name.split("-")[0];
        const token1 = pool.name.split("-")[1];

        // Calculate the value of each token reserve in MintMe
        let token0ValueInUSD;
        let token1ValueInUSD;
        if (token0 === "WMINT") {
          token0ValueInUSD = reserve0 * mintmePriceData;
        } else if (token0 === "$BONE") {
          token0ValueInUSD = reserve0 * bonePriceInUSDTemp;
        } else {
          token0ValueInUSD = reserve0; // Assuming token0 is already in USD
        }

        if (token1 === "WMINT") {
          token1ValueInUSD = reserve1 * mintmePriceData;
        } else if (token1 === "$BONE") {
          token1ValueInUSD = reserve1 * bonePriceInUSDTemp;
        } else {
          token1ValueInUSD = reserve1; // Assuming token1 is already in USD
        }

        // Sum the values of the two token reserves in USD
        const poolTVL = token0ValueInUSD + token1ValueInUSD;
        tvl += poolTVL;
      }

      const tvlChangePercentage =
        tvlData && tvlDataPrev
          ? ((tvlData - tvlDataPrev) / tvlDataPrev) * 100
          : 0;

      setTVLDataPrev(tvlData); // Update previous TVL data

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5">TVL</Typography>
                  <Typography variant="h6">${tvlData} USD</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5">TVL Change (1h)</Typography>
                  <Typography variant="h6">
                    {tvlChangePercentage.toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box className={classes.space}></Box>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5">MintMe Price</Typography>
                  <Typography variant="h6">${mintmePrice} USD</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5">BONE Price</Typography>
                  <Typography variant="h6">
                    {bonePrice} MintMe (${bonePriceInUSD} USD)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      <Box className={classes.space}></Box>
    </Container>
  );
};

export default TVLPage;