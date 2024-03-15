import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { ethers } from "ethers"; // Import ethers
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions"; // Import necessary functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import boneTokenABI from "./abis/BoneToken.json"; // Import Bone token ABI
import masterChefABI from "./abis/MasterChef.json"; // Import MasterChef ABI

// Define styles object
const styles = (theme) => ({
  paperContainer: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  title: {
    textAlign: "center",
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  balance: {
    padding: theme.spacing(1),
    overflow: "wrap",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: theme.spacing(2), // Add space between the buttons and the content above
    display: "flex",
    justifyContent: "space-between",
  },
  stakeButton: {
    marginRight: theme.spacing(4), // Add 25px spacing to the right of the "Stake" button
  },
  withdrawButton: {
    marginLeft: theme.spacing(4), // Add 25px spacing to the left of the "Withdraw" button
  },
  footer: {
    marginTop: "50px",
  },
});

const useStyles = makeStyles(styles);

function Farms(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [boneTokenContract, setBoneTokenContract] = useState(null);
  const [masterChefContract, setMasterChefContract] = useState(null);
  const [boneBalance, setBoneBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [poolBalances, setPoolBalances] = useState([]);

  // Define poolsData
  const poolsData = [
    {
      poolAddress: "0x123456789abcdef",
      poolName: "Bone / MintMe",
    },
    {
      poolAddress: "0xabcdef123456789",
      poolName: "DogSwap / MintMe",
    },
    // Add more pools as needed...
  ];

  // Initialize contracts when component mounts
  useEffect(() => {
    const initializeContracts = async () => {
      const provider = getProvider(); // Get provider
      const signer = getSigner(); // Get signer

      if (provider && signer) {
        const boneToken = new ethers.Contract(
          "BONE_CONTRACT_ADDRESS", // Replace with actual Bone token contract address
          boneTokenABI,
          signer
        );
        const masterChef = new ethers.Contract(
          "MASTERCHEF_CONTRACT_ADDRESS", // Replace with actual MasterChef contract address
          masterChefABI,
          signer
        );

        setBoneTokenContract(boneToken);
        setMasterChefContract(masterChef);
      }
    };

    initializeContracts();
  }, []);

  // Fetch balances when user account or contracts change
  useEffect(() => {
    const fetchBalances = async () => {
      const network = getNetwork(); // Get network
      if (network.account && boneTokenContract && masterChefContract) {
        // Fetch Bone token balance
        const boneBalance = await boneTokenContract.balanceOf(network.account);
        setBoneBalance(boneBalance.toString());

        // Fetch staked balance
        const userInfo = await masterChefContract.userInfo(0, network.account);
        setStakedBalance(userInfo.amount.toString());

        // Fetch pool balances
        const balances = await Promise.all(
          poolsData.map(async (pool) => {
            const poolBalance = await masterChefContract.poolBalance(pool.poolAddress);
            return { ...pool, poolBalance: poolBalance.toString() };
          })
        );
        setPoolBalances(balances);
      }
    };

    fetchBalances();
  }, [boneTokenContract, masterChefContract]);

  // Stake function
  const stake = async () => {
    if (masterChefContract) {
      try {
        // Assuming you need to call a specific function to stake
        const tx = await masterChefContract.stake();
        await tx.wait();
        enqueueSnackbar("Stake Successful", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(`Stake Failed: ${error.message}`, {
          variant: "error",
        });
      }
    }
  };

  // Withdraw function
  const withdraw = async () => {
    if (masterChefContract) {
      try {
        // Assuming you need to call a specific function to withdraw
        const tx = await masterChefContract.withdraw();
        await tx.wait();
        enqueueSnackbar("Withdrawal Successful", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(`Withdrawal Failed: ${error.message}`, {
          variant: "error",
        });
      }
    }
  };

  // Other existing code...

  return (
    <div>
      {/* Warning Message */}
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="error" align="center">
              This page is currently in production and may not display accurate data.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Farms */}
      <Container maxWidth="md">
        <Grid container spacing={3}>
          {/* Placeholder Pool Cards */}
          {poolBalances.map((pool, index) => (
            <Grid item xs={4} key={index}>
              <Paper className={classes.paperContainer}>
                {/* Pool Name */}
                <Typography variant="h5" className={classes.title}>
                  {pool.poolName}
                </Typography>

                {/* Placeholder Pool Picture */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <FontAwesomeIcon icon={faMoneyBillAlt} size="5x" color="grey" />
                </div>

                {/* Pool Balance */}
                <Typography variant="body1" className={classes.balance}>
                  Pool Balance: {pool.poolBalance}
                </Typography>

                {/* Stake and Withdraw Buttons */}
                <div className={classes.buttonContainer}>
                  <Button variant="contained" color="primary" className={classes.stakeButton} onClick={stake}>
                    Stake
                  </Button>
                  <Button variant="contained" color="secondary" className={classes.withdrawButton} onClick={withdraw}>
                    Withdraw
                  </Button>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Grid
        container
        className={classes.footer}
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
      </Grid>
    </div>
  );
}

export default Farms;
