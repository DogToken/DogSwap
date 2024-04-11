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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../../utils/ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faWallet,
  faHandHoldingUsd,
  faClock,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

// Import the NFT contract ABI
import NFTContractABI from '../../build/NFTContract.json';

// Import the Marketplace contract ABI
import MarketplaceContractABI from '../../build/MarketplaceContract.json';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  createButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  tabsRoot: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(4),
  },
  tabPanel: {
    padding: theme.spacing(2),
  },
  nftCard: {
    position: 'relative',
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  nftMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  nftContent: {
    padding: theme.spacing(2),
  },
  nftName: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  nftDescription: {
    marginBottom: theme.spacing(2),
  },
  nftDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  nftPrice: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  buyButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  createNFTDialog: {
    '& .MuiDialogContent-root': {
      padding: theme.spacing(3),
    },
  },
  createNFTInput: {
    marginBottom: theme.spacing(2),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const NFTMarketplace = () => {
  const classes = useStyles();
  const [nfts, setNFTs] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [openCreateNFTDialog, setOpenCreateNFTDialog] = useState(false);
  const [newNFTName, setNewNFTName] = useState('');
  const [newNFTDescription, setNewNFTDescription] = useState('');
  const [newNFTImageUrl, setNewNFTImageUrl] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [nftContract, setNFTContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      loadMyNFTs(nftContract, signer);
    }
  };

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
        NFTContractABI,
        signer
      );
      setNFTContract(nftContract);
  
      const marketplaceContract = new Contract(
        '0xFa851eeECDbD8405C98929770bBfe522a730AF37', // Replace with the actual Marketplace contract address
        MarketplaceContractABI,
        signer
      );
      setMarketplaceContract(marketplaceContract);
  
      loadNFTs(nftContract, marketplaceContract);
      loadMyNFTs(nftContract, signer);
    };
  
    initializeContracts();
  }, []);
  
  async function loadNFTs(nftContract, marketplaceContract) {
    if (!marketplaceContract) return;
  
    const data = await marketplaceContract.fetchMarketplaceItems();
  
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        let meta;
        try {
          meta = await fetch(tokenUri).then((res) => res.json());
        } catch (error) {
          console.error(`Error fetching metadata for token ${i.tokenId}:`, error);
          meta = { image: '', name: '', description: '' };
        }
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          marketplaceContract,
          nftContract,
          signer,
        };
        return item;
      })
    );
    setNFTs(items);
    setLoadingState('loaded');
  }
  
  async function makeOffer(nft, offerPrice) {
    if (!signer || !nft.marketplaceContract || !nft.nftContract) return;
  
    const price = ethers.utils.parseUnits(offerPrice, 'ether');
  
    try {
      // Check if the NFT is already approved for the marketplace contract
      const isApproved = await nft.nftContract.isApprovedForAll(
        await signer.getAddress(),
        nft.marketplaceContract.address
      );
  
      if (!isApproved) {
        // Approve the marketplace contract to transfer the NFT
        const approveTransaction = await nft.nftContract.setApprovalForAll(
          nft.marketplaceContract.address,
          true
        );
        await approveTransaction.wait();
      }
  
      // Create the offer on the marketplace
      const createOfferTransaction = await nft.marketplaceContract.createMarketplaceItem(
        nft.nftContract.address,
        nft.tokenId,
        price,
        {
          value: price,
        }
      );
      await createOfferTransaction.wait();
  
      loadNFTs(nft.nftContract, nft.marketplaceContract);
    } catch (error) {
      console.error('Error making offer:', error);
    }
  }
  
  async function acceptOffer(nft, offerIndex) {
    if (!signer || !nft.marketplaceContract || !nft.nftContract) return;
  
    try {
      // Accept the offer on the marketplace
      const acceptOfferTransaction = await nft.marketplaceContract.createMarketplaceSale(
        nft.nftContract.address,
        offerIndex
      );
      await acceptOfferTransaction.wait();
  
      loadNFTs(nft.nftContract, nft.marketplaceContract);
      loadMyNFTs(nft.nftContract, signer);
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  }

  async function loadMyNFTs(nftContract, signer) {
    if (!nftContract || !signer) return;
  
    const userAddress = await signer.getAddress();
    const myNFTs = [];
  
    // Get the total number of tokens owned by the user
    const balance = await nftContract.balanceOf(userAddress);
  
    // Loop through the user's tokens and fetch their metadata
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await nftContract.getUserNFTs();
      const tokenUri = await nftContract.tokenURI(tokenId[i]);
  
      let meta;
      try {
        meta = await fetch(tokenUri).then((res) => res.json());
      } catch (error) {
        console.error(`Error fetching metadata for token ${tokenId[i]}:`, error);
        meta = { image: '', name: '', description: '' };
      }
  
      let nftItem = {
        tokenId: tokenId[i].toNumber(),
        owner: userAddress,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        nftContract,
        signer,
      };
      myNFTs.push(nftItem);
    }
  
    setMyNFTs(myNFTs);
  }
  
  async function buyNft(nft) {
  if (!nft.marketplaceContract || !nft.nftContract || !nft.signer) return;

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

  try {
    let tokenId;
    if (ethers.BigNumber.isBigNumber(nft.tokenId)) {
      tokenId = nft.tokenId.toNumber();
    } else if (typeof nft.tokenId === 'number') {
      tokenId = nft.tokenId;
    } else {
      console.error('Invalid tokenId:', nft.tokenId);
      return;
    }

    const transaction = await nft.marketplaceContract.createMarketplaceSale(
      nft.nftContract.address,
      tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFTs(nft.nftContract, nft.marketplaceContract);
    loadMyNFTs(nft.nftContract, nft.marketplaceContract, nft.signer);
  } catch (error) {
    console.error('Error buying NFT:', error);
  }
}

  const handleCreateNFTDialogOpen = () => {
    setOpenCreateNFTDialog(true);
  };

  const handleCreateNFTDialogClose = () => {
    setOpenCreateNFTDialog(false);
    setNewNFTName('');
    setNewNFTDescription('');
    setNewNFTImageUrl('');
  };

  const handleCreateNFTSubmit = async () => {
    if (!signer || !newNFTName || !newNFTDescription || !newNFTImageUrl) return;
  
    const nftContract = new Contract(
      '0x8e6ed851Efe845fd91A009BB88e823d067346d87', // Replace with the actual NFT contract address
      NFTContractABI,
      signer
    );
  
    const tokenURI = `data:application/json;base64,${btoa(
      JSON.stringify({
        name: newNFTName,
        description: newNFTDescription,
        image: newNFTImageUrl,
      })
    )}`;
  
    const transaction = await nftContract.createToken(tokenURI);
    const receipt = await transaction.wait();
  
    const tokenId = receipt.events[0].args.tokenId; // Get the tokenId from the event emitted by the createToken function
  
    const marketplaceContract = new Contract(
      '0xFa851eeECDbD8405C98929770bBfe522a730AF37', // Replace with the actual Marketplace contract address
      MarketplaceContractABI,
      signer
    );
  
    const price = ethers.utils.parseUnits('0.01', 'ether');
    const listingFee = await marketplaceContract.getListingPrice();
  
    await listNFT(tokenId, nftContract, marketplaceContract, price, listingFee);
  
    loadMyNFTs(nftContract, marketplaceContract, signer);
  
    handleCreateNFTDialogClose();
  };

  async function listNFT(nftContract, marketplaceContract, tokenId, price) {
    if (!signer) return;
  
    try {
      // Check if the NFT is already approved for the marketplace contract
      const isApproved = await nftContract.isApprovedForAll(
        await signer.getAddress(),
        marketplaceContract.address
      );
  
      if (!isApproved) {
        // Approve the marketplace contract to transfer the NFT
        const approveTransaction = await nftContract.setApprovalForAll(
          marketplaceContract.address,
          true
        );
        await approveTransaction.wait();
      }
  
      // List the NFT on the marketplace
      const listingPrice = await marketplaceContract.getListingPrice();
      const listingTransaction = await marketplaceContract.listNFT(
        nftContract.address,
        tokenId,
        price,
        {
          value: listingPrice,
        }
      );
      await listingTransaction.wait();
  
      loadNFTs(nftContract, marketplaceContract);
      loadMyNFTs(nftContract, signer);
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  }

  if (loadingState === 'not-loaded') {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        NFT Marketplace
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        className={classes.createNFTButton}
        onClick={handleCreateNFTDialogOpen}
      >
        Create NFT
      </Button>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="nft-tabs"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Marketplace" {...a11yProps(0)} />
        <Tab label="My NFTs" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
  {nfts.length > 0 ? (
    <Grid container spacing={3}>
      {nfts.map((nft, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={nft.image}
              title={nft.name}
            />
            <CardContent className={classes.nftCardContent}>
              <Typography variant="h6" gutterBottom>
                {nft.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                {nft.description}
              </Typography>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.nftCardDetails}
              >
                <FontAwesomeIcon icon={faCoins} /> {nft.price} MINTME
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                Seller: {nft.seller}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                Owner: {nft.owner}
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
  ) : (
    <Typography variant="body1" color="textSecondary">
      No NFTs available in the marketplace.
    </Typography>
  )}
</TabPanel>
      <TabPanel value={tabValue} index={1}>
  {myNFTs.length > 0 ? (
    <Grid container spacing={3}>
      {myNFTs.map((nft, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.nftMedia}
              image={nft.image || '/images/coins/doggo.png'}
              title={nft.name}
            />
            <CardContent className={classes.nftCardContent}>
              <Typography variant="h6" gutterBottom>
                {nft.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                {nft.description}
              </Typography>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.nftCardDetails}
              >
                <FontAwesomeIcon icon={faCoins} /> {nft.price} MINTME
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                Seller: {nft.seller}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.nftCardDetails}
              >
                Owner: {nft.owner}
              </Typography>
            </CardContent>
            <CardActions>
            <TextField
                label="Listing Price (MINTME)"
                variant="outlined"
                size="small"
                type="number"
                defaultValue={nft.price}
                onChange={(e) => (nft.price = e.target.value)}
                className={classes.listingPriceInput}
              />
              <Button
                size="small"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => listNFT(nft)}
              >
                List
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="body1" color="textSecondary">
      You don't have any NFTs.
    </Typography>
  )}
</TabPanel>

      {/* Create NFT Dialog */}
      <Dialog
        open={openCreateNFTDialog}
        onClose={handleCreateNFTDialogClose}
        aria-labelledby="create-nft-dialog-title"
      >
        <DialogTitle id="create-nft-dialog-title">Create New NFT</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="NFT Name"
            fullWidth
            value={newNFTName}
            onChange={(e) => setNewNFTName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="NFT Description"
            fullWidth
            multiline
            rows={4}
            value={newNFTDescription}
            onChange={(e) => setNewNFTDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={newNFTImageUrl}
            onChange={(e) => setNewNFTImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateNFTDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateNFTSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NFTMarketplace;