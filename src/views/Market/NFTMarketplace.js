import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faWallet, faHandHoldingUsd, faClock } from "@fortawesome/free-solid-svg-icons";
import useWeb3Provider from "../../utils/network";
import { getNFTContract, getMarketplaceContract } from "../../utils/contracts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}));


const NFTMarketplace = () => {
  const classes = useStyles();
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [newNFTUrl, setNewNFTUrl] = useState("");
  const { isConnected, network } = useWeb3Provider();

  useEffect(() => {
    if (isConnected) {
      loadContracts();
    }
  }, [isConnected]);

  async function loadContracts() {
    const nftContract = getNFTContract(network.signer);
    const marketplaceContract = getMarketplaceContract(network.signer);
    const signer = network.signer;

    loadNFTs(nftContract, marketplaceContract, signer);
  }

  async function loadNFTs(nftContract, marketplaceContract, signer) {
    if (!marketplaceContract) return;

    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await fetch(tokenUri).then((res) => res.json());
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );
    setNFTs(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft, marketplaceContract, nftContract, signer) {
    if (!marketplaceContract || !nftContract || !signer) return;

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await marketplaceContract
      .createMarketSale(nftContract.address, nft.tokenId, {
        value: price,
      })
      .catch((error) => {
        console.error("Error buying NFT:", error);
      });

    await transaction.wait();
    loadNFTs(nftContract, marketplaceContract, signer);
  }

  async function createNFT(nftContract, signer) {
    if (!nftContract || !signer || !newNFTUrl) return;

    const transaction = await nftContract.createToken(newNFTUrl);
    const tx = await transaction.wait();
    const event = tx.events[0];
    const tokenId = event.args[2];

    await listNFT(tokenId, nftContract, marketplaceContract, signer);
    setNewNFTUrl("");
  }

  async function listNFT(tokenId, nftContract, marketplaceContract, signer) {
    if (!marketplaceContract || !nftContract || !signer) return;

    const price = ethers.utils.parseUnits("0.01", "ether");
    const transaction = await nftContract.approve(
      marketplaceContract.address,
      tokenId
    );
    await transaction.wait();

    const listingTransaction = await marketplaceContract.createToken(
      nftContract.address,
      tokenId,
      price,
      {
        value: ethers.utils.parseUnits("0.025", "ether"),
      }
    );
    await listingTransaction.wait();

    loadNFTs(nftContract, marketplaceContract, signer);
  }

  if (loadingState === "not-loaded") {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          No NFTs in the Marketplace
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Create your first NFT to start trading!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        NFT Marketplace
      </Typography>
      <Grid container spacing={3}>
        {nfts.map((nft, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={nft.image}
                title={nft.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {nft.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {nft.description}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  <FontAwesomeIcon icon={faCoins} /> {nft.price} ETH
                </Typography>
              </CardContent>
              <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faHandHoldingUsd} />}
                onClick={() => buyNft(nft, marketplaceContract, nftContract, signer)}
              >
                Buy
              </Button>
            </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" gutterBottom>
        Create a New NFT
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="NFT URL"
            value={newNFTUrl}
            onChange={(e) => setNewNFTUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faWallet} />}
          onClick={() => createNFT(nftContract, signer)}
        >
          Create NFT
        </Button>
      </Grid>
      </Grid>
    </Container>
  );
};

export default NFTMarketplace;