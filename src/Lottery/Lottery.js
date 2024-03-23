import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField, Grid, Card, CardContent } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faWallet, faCoins, faTrophy, faCog } from '@fortawesome/free-solid-svg-icons';
import lotteryABI from "./abis/Lottery.json";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    textAlign: "center",
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    background: theme.palette.background.default,
    boxShadow: theme.shadows[3],
  },
  button: {
    margin: theme.spacing(2),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  subTitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.light,
  },
  cardContent: {
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  balanceIcon: {
    marginRight: theme.spacing(1),
  },
  balanceText: {
    fontSize: "1.2rem",
    marginLeft: theme.spacing(1),
  },
}));

const LOTTERY_CONTRACT_ADDRESS = "0x70360f7c6ca76B81AF0B38C7aD8ee0e625190804"; // Update with the Lottery contract address

const getLotteryInstance = (networkId, signer) => {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, lotteryABI, signer);
};

const Lottery = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketAmount, setTicketAmount] = useState("");
  const [numbers, setNumbers] = useState(["", "", "", ""]);
  const [walletBalance, setWalletBalance] = useState("0");
  const [totalTickets, setTotalTickets] = useState("0");
  const [jackpotAmount, setJackpotAmount] = useState("0");
  const [maxNumber, setMaxNumber] = useState(0);
  const [minPrice, setMinPrice] = useState("0");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allocation, setAllocation] = useState([0, 0, 0]);
  const [drawingPhase, setDrawingPhase] = useState(false);
  const [drawed, setDrawed] = useState(false);

  useEffect(() => {
    // Fetch and set initial data
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Fetch wallet balance
      const walletBalance = await fetchWalletBalance(signer);
      setWalletBalance(walletBalance);

      // Fetch total tickets
      const totalTickets = await lotteryContract.totalAmount();
      setTotalTickets(ethers.utils.formatUnits(totalTickets, 18));

      // Fetch jackpot amount
      const jackpotAmount = await lotteryContract.totalAmount();
      setJackpotAmount(ethers.utils.formatUnits(jackpotAmount, 18));

      // Fetch max number
      const maxNumber = await lotteryContract.maxNumber();
      setMaxNumber(maxNumber);

      // Fetch min price
      const minPrice = await lotteryContract.minPrice();
      setMinPrice(ethers.utils.formatUnits(minPrice, 18));

      // Check if the current user is an admin
      const adminAddress = await lotteryContract.adminAddress();
      setIsAdmin(adminAddress === signer.getAddress());

      // Fetch allocation
      const allocationData = await lotteryContract.allocation();
      setAllocation(allocationData);

      // Check if the drawing phase is active
      const drawingPhaseStatus = await lotteryContract.drawingPhase();
      setDrawingPhase(drawingPhaseStatus);

      // Check if the lottery is already drawn
      const drawedStatus = await lotteryContract.drawed();
      setDrawed(drawedStatus);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchWalletBalance = async (signer) => {
    // Implement the logic to fetch the wallet balance
    // For example, you can use the ethers.js library to interact with the $BONE token contract
    const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
    const balance = await boneContract.balanceOf(signer.getAddress());
    return ethers.utils.formatUnits(balance, 18);
  };

  const buyTickets = async () => {
    try {
      setLoading(true);

      // Parse the ticket amount and numbers
      const numTickets = parseInt(ticketAmount, 10);
      const parsedNumbers = numbers.map(num => parseInt(num, 10));

      // Ensure the ticket amount and numbers are valid
      if (isNaN(numTickets) || numTickets <= 0) {
        throw new Error("Please enter a valid number of tickets to buy.");
      }
      for (let i = 0; i < parsedNumbers.length; i++) {
        if (isNaN(parsedNumbers[i]) || parsedNumbers[i] > maxNumber || parsedNumbers[i] < 1) {
          throw new Error("Invalid number entered. Please make sure all numbers are between 1 and the maximum number.");
        }
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Calculate the total price
      const totalPrice = ethers.utils.parseUnits(String(numTickets * parseFloat(minPrice)), 18);

      // Call the buy function on the Lottery contract
      const tx = await lotteryContract.buy(totalPrice, parsedNumbers, { value: totalPrice });
      await tx.wait();

      setMessage("Tickets purchased successfully!");

      // Refresh data after buying tickets
      fetchInitialData();
    } catch (error) {
      console.error("Error buying tickets:", error);
      setMessage("Failed to buy tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const claimJackpot = async () => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the claimReward function on the Lottery contract for the user's tickets
      const userTickets = await lotteryContract.userInfo(signer.getAddress());
      const claimPromises = userTickets.map(async (ticketId) => {
        const tx = await lotteryContract.claimReward(ticketId);
        await tx.wait();
      });
      await Promise.all(claimPromises);

      setMessage("Jackpot claimed successfully!");

      // Refresh data after claiming the jackpot
      fetchInitialData();
    } catch (error) {
      console.error("Error claiming jackpot:", error);
      setMessage("Failed to claim the jackpot. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const enterDrawingPhase = async () => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the enterDrawingPhase function on the Lottery contract
      const tx = await lotteryContract.enterDrawingPhase();
      await tx.wait();

      setMessage("Drawing phase entered successfully!");

      // Refresh data after entering the drawing phase
      fetchInitialData();
    } catch (error) {
      console.error("Error entering drawing phase:", error);
      setMessage("Failed to enter the drawing phase. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const drawWinningNumbers = async (externalRandomNumber) => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the drawing function on the Lottery contract
      const tx = await lotteryContract.drawing(externalRandomNumber);
      await tx.wait();

      setMessage("Winning numbers drawn successfully!");

      // Refresh data after drawing the winning numbers
      fetchInitialData();
    } catch (error) {
      console.error("Error drawing winning numbers:", error);
      setMessage("Failed to draw winning numbers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetLottery = async () => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the reset function on the Lottery contract
      const tx = await lotteryContract.reset();
      await tx.wait();

      setMessage("Lottery reset successfully!");

      // Refresh data after resetting the lottery
      fetchInitialData();
    } catch (error) {
      console.error("Error resetting lottery:", error);
      setMessage("Failed to reset the lottery. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateMinPrice = async (newMinPrice) => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the setMinPrice function on the Lottery contract
      const parsedMinPrice = ethers.utils.parseUnits(newMinPrice, 18);
      const tx = await lotteryContract.setMinPrice(parsedMinPrice);
      await tx.wait();

      setMessage("Minimum price updated successfully!");

      // Refresh data after updating the minimum price
      fetchInitialData();
    } catch (error) {
      console.error("Error updating minimum price:", error);
      setMessage("Failed to update the minimum price. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateMaxNumber = async (newMaxNumber) => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the setMaxNumber function on the Lottery contract
      const tx = await lotteryContract.setMaxNumber(newMaxNumber);
      await tx.wait();

      setMessage("Maximum number updated successfully!");

      // Refresh data after updating the maximum number
      fetchInitialData();
    } catch (error) {
      console.error("Error updating maximum number:", error);
      setMessage("Failed to update the maximum number. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateAllocation = async (allocation1, allocation2, allocation3) => {
    try {
      setLoading(true);

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get the Lottery contract instance
      const lotteryContract = getLotteryInstance(networkId, signer);

      // Call the setAllocation function on the Lottery contract
      const tx = await lotteryContract.setAllocation(allocation1, allocation2, allocation3);
      await tx.wait();

      setMessage("Allocation updated successfully!");

      // Refresh data after updating the allocation
      fetchInitialData();
    } catch (error) {
      console.error("Error updating allocation:", error);
      setMessage("Failed to update the allocation. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        🎟️ DogSwap Lottery
      </Typography>
      <Typography variant="body1" className={classes.subTitle}>
        Buy tickets for a chance to win the jackpot! The more tickets you buy, the higher your chances of winning.
      </Typography>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faWallet} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Your Balance: {walletBalance}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faTicketAlt} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Total Tickets: {totalTickets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faCoins} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Jackpot: {jackpotAmount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <FontAwesomeIcon icon={faTrophy} size="2x" className={classes.balanceIcon} />
              <Typography variant="h6" className={classes.balanceText}>Your Tickets: 0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TextField
        label="Number of Tickets"
        variant="outlined"
        fullWidth
        margin="normal"
        value={ticketAmount}
        onChange={(e) => setTicketAmount(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={buyTickets}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Buy Tickets 🎟️"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={claimJackpot}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Claim Jackpot 🏆"}
      </Button>
      {message && (
        <Typography variant="body1" className={classes.loading}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Lottery;