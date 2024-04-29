import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress, Box, Card, CardContent, Grid } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import pairABI from "../../build/IUniswapV2Pair.json";
import boneTokenABI from "../../build/BoneToken.json";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: theme.spacing(2),
    maxWidth: 800,
    margin: "auto",
  },
  card: {
    padding: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
    background: "#FFFFFF",
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
  { id: 3, name: "$BONE-$BONE", address: "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF" },
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

const getTokenPrice = (reserve0, reserve1, token0IsBone, token1IsBone) => {
  if (reserve0 === 0 || reserve1 === 0) {
    return 0;
  }

  let tokenPrice;
  if (token0IsBone) {
    tokenPrice = reserve1 / reserve0 * bonePriceInMintMe;
  } else if (token1IsBone) {
    tokenPrice = reserve0 / reserve1 * bonePriceInMintMe;
  } else {
    const token0PriceInMintMe = reserve1 / reserve0;
    const token1PriceInMintMe = reserve0 / reserve1;
    tokenPrice = token0PriceInMintMe / token1PriceInMintMe;
  }

  return tokenPrice;
};

const TVLPage = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tvlData, setTVLData] = useState(null);
  const [mintmePrice, setMintmePrice] = useState(null);
  const [bonePrice, setBonePrice] = useState(null);
  const [bonePriceInUSD, setBonePriceInUSD] = useState(null);
  const [tokenPrices, setTokenPrices] = useState({});

  useEffect(() => {
    fetchData();
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
      const boneInWMINT = getTokenPrice(boneReserve0, boneReserve1, true, false);
      const bonePriceInMintMe = 1 / boneInWMINT;
      const bonePriceInUSDTemp = bonePriceInMintMe * mintmePriceData;
      setBonePriceInUSD(bonePriceInUSDTemp.toFixed(8)); // Limiting to 8 digits after the comma
      setBonePrice(bonePriceInMintMe.toFixed(8)); // Limiting to 8 digits after the comma

      const tokenPricesData = {};

      // Calculate token prices from pool data
      for (const pool of POOLS) {
        const [token0, token1] = pool.name.split("-");
        const token0IsBone = token0 === "$BONE";
        const token1IsBone = token1 === "$BONE";

        const poolReserves = await new Contract(pool.address, pairABI.abi, signer).getReserves();
        const reserve0 = poolReserves[0] / 10 ** 18;
        const reserve1 = poolReserves[1] / 10 ** 18;

        const token0Price = getTokenPrice(reserve0, reserve1, token0IsBone, token1IsBone);
        const token1Price = getTokenPrice(reserve1, reserve0, token1IsBone, token0IsBone);

        tokenPricesData[token0.replace("$", "").toLowerCase()] = token0Price;
        tokenPricesData[token1.replace("$", "").toLowerCase()] = token1Price;
      }
      
      setTokenPrices(tokenPricesData);

      // Calculate TVL using the token prices
      let tvl = 0;
      for (const pool of POOLS) {
        const poolReserves = await new Contract(pool.address, pairABI.abi, signer).getReserves();
        const reserve0 = poolReserves[0] / 10 ** 18;
        const reserve1 = poolReserves[1] / 10 ** 18;
    
        const [token0, token1] = pool.name.split("-");
        const token0Price = tokenPrices[token0.replace("$", "").toLowerCase()] || 0;
        const token1Price = tokenPrices[token1.replace("$", "").toLowerCase()] || 0;
    
        const token0ValueInUSD = reserve0 * token0Price * mintmePriceData;
        const token1ValueInUSD = reserve1 * token1Price * mintmePriceData;
    
        const poolTVL = token0ValueInUSD + token1ValueInUSD;
        tvl += poolTVL;
      }
    
      setTVLData(tvl.toFixed(8));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };return (
    <Container className={classes.container}>
    <Typography variant="h4" gutterBottom>
    Total Value Locked (TVL)
    </Typography>
    <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
    <Card className={classes.card}>
    <CardContent>
    {loading ? (
    <CircularProgress />
    ) : (
    <>
    <Typography variant="h5" gutterBottom>
    Total Value Locked
    </Typography>
    <Typography variant="subtitle1" className={classes.tvlValue}>
    ${tvlData} USD
    </Typography>
    </>
    )}
    </CardContent>
    </Card>
    </Grid>
    <Grid item xs={12} md={6}>
    <Card className={classes.card}>
    <CardContent>
    <Typography variant="h5" gutterBottom>
    Token Prices
    </Typography>
    <Typography variant="subtitle1" className={classes.priceInfo}>
    1 MintMe = ${mintmePrice} USD
    </Typography>
    <Typography variant="subtitle1" className={classes.priceInfo}>
    1 🦴 BONE = {bonePrice} MintMe (${bonePriceInUSD} USD)
    </Typography>
    </CardContent>
    </Card>
    </Grid>
    </Grid>
    </Container>
    );
    };
    export default TVLPage;
