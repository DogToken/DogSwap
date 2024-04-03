import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
} from '@material-ui/core';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../../utils/ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faWallet,
  faHandHoldingUsd,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

// Import the NFT contract ABI
import NFTContractABI from '../../build/NFTContract.json';

// Import the Marketplace contract ABI
import MarketplaceContractABI from '../../build/MarketplaceContract.json';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    maxWidth: 345,
    cursor: 'pointer',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

const fallbackABI = [
  {
    inputs: [],
    name: "fetchMarketItems",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "createMarketSale",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "createToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "createToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

const NFTMarketplace = () => {
  const classes = useStyles();
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [newNFTUrl, setNewNFTUrl] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const initializeContracts = async () => {
      const provider = await getProvider();
      const signer = await getSigner(provider);
      const network = await getNetwork(provider);

      setProvider(provider);
      setSigner(signer);
      setNetwork(network);

      const nftContract = new Contract(
        '0x8e6ed851Efe845fd91A009BB88e823d067346d87', // Replace with the actual NFT contract address
        fallbackABI,
        signer
      );

      const marketplaceContract = new Contract(
        '0xFa851eeECDbD8405C98929770bBfe522a730AF37', // Replace with the actual Marketplace contract address
        fallbackABI,
        signer
      );

      loadNFTs(nftContract, marketplaceContract);
    };

    initializeContracts();
  }, []);

  async function loadNFTs(nftContract, marketplaceContract) {
    if (!marketplaceContract) return;

    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await fetch(tokenUri).then((res) => res.json());
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          marketplaceContract, // Add the marketplaceContract to the item
          nftContract, // Add the nftContract to the item
          signer, // Add the signer to the item
        };
        return item;
      })
    );
    setNFTs(items);
    setLoadingState('loaded');
  }

  async function buyNft(nft) {
    if (!nft.marketplaceContract || !nft.nftContract || !nft.signer) return;

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await nft.marketplaceContract
      .createMarketSale(nft.nftContract.address, nft.tokenId, {
        value: price,
      })
      .catch((error) => {
        console.error('Error buying NFT:', error);
      });

    await transaction.wait();
    loadNFTs(nft.nftContract, nft.marketplaceContract);
  }

  async function createNFT() {
    if (!signer || !newNFTUrl) return;

    const nftContract = new Contract(
      '0x8e6ed851Efe845fd91A009BB88e823d067346d87', // Replace with the actual NFT contract address
      fallbackABI,
      signer
    );

    const transaction = await nftContract.createToken(newNFTUrl);
    const tx = await transaction.wait();
    const event = tx.events[0];
    const tokenId = event.args[2];

    const marketplaceContract = new Contract(
      '0xFa851eeECDbD8405C98929770bBfe522a730AF37', // Replace with the actual Marketplace contract address
      fallbackABI,
      signer
    );

    await listNFT(tokenId, nftContract, marketplaceContract);
    setNewNFTUrl('');
  }

  async function listNFT(tokenId, nftContract, marketplaceContract) {
    if (!marketplaceContract || !nftContract || !signer) return;

    const price = ethers.utils.parseUnits('0.01', 'ether');
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
        value: ethers.utils.parseUnits('0.025', 'ether'),
      }
    );
    await listingTransaction.wait();

    loadNFTs(nftContract, marketplaceContract);
  }

  if (loadingState === 'not-loaded') {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  if (loadingState === 'loaded' && !nfts.length) {
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
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NFTMarketplace;