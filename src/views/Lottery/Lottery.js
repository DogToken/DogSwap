import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField, Grid, Card, CardContent } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faWallet, faCoins, faTrophy, faCog } from '@fortawesome/free-solid-svg-icons';
import lotteryABI from "../../build/Lottery.json";
import boneTokenABI from "../../build/BoneToken.json";


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
const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";

const getLotteryInstance = (networkId, signer) => {
  return new Contract(LOTTERY_CONTRACT_ADDRESS, lotteryABI, signer);
};

const Lottery = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketNumbers, setTicketNumbers] = useState(["", "", "", ""]);
  const [walletBalance, setWalletBalance] = useState("0");
  const [totalTickets, setTotalTickets] = useState("0");
  const [jackpotAmount, setJackpotAmount] = useState("0");
  const [maxNumber, setMaxNumber] = useState(0);
  const [minPrice, setMinPrice] = useState("0");
  const [isAdmin, setIsAdmin] = useState(false);
  const [allocation, setAllocation] = useState([0, 0, 0]);
  const [drawed, setDrawed] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState(["", "", "", ""]);
  const [issueIndex, setIssueIndex] = useState(0);

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

      // Check if the lottery is already drawn
      const drawedStatus = await lotteryContract.drawed();
      setDrawed(drawedStatus);

      // Fetch winning numbers and issue index if drawn
      if (drawedStatus) {
        const winningNumbersData = await lotteryContract.winningNumbers();
        setWinningNumbers(winningNumbersData.map(num => num.toString()));
        const currentIssueIndex = await lotteryContract.issueIndex();
        setIssueIndex(currentIssueIndex.toNumber());
      }
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

      // Parse the ticket price and numbers
      const parsedPrice = ethers.utils.parseUnits(ticketPrice, 18);
      const parsedNumbers = ticketNumbers.map(num => parseInt(num, 10));

      // Ensure the ticket price and numbers are valid
      if (parsedPrice.lt(ethers.utils.parseUnits(minPrice, 18))) {
        throw new Error("The ticket price must be greater than or equal to the minimum price.");
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

      // Call the buy function on the Lottery contract
      const tx = await lotteryContract.buy(parsedPrice, parsedNumbers, { value: parsedPrice });
      await tx.wait();

      setMessage("Ticket purchased successfully!");

      // Refresh data after buying the ticket
      fetchInitialData();
    } catch (error) {
      console.error("Error buying ticket:", error);
      setMessage("Failed to buy ticket. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async () => {
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

      setMessage("Rewards claimed successfully!");

      // Refresh data after claiming rewards
      fetchInitialData();
    } catch (error) {
      console.error("Error claiming rewards:", error);
      setMessage("Failed to claim rewards. Please try again later.");
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
        label="Ticket Price"
        variant="outlined"
        fullWidth
        margin="normal"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
      />
      {[0, 1, 2, 3].map((index) => (
        <TextField
          key={index}
          label={`Number ${index + 1}`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={ticketNumbers[index]}
          onChange={(e) => {
            const newNumbers = [...ticketNumbers];
            newNumbers[index] = e.target.value;
            setTicketNumbers(newNumbers);
          }}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={buyTickets}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Buy Ticket 🎟️"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={claimReward}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Claim Reward 💰"}
      </Button>
      {drawed && (
        <Typography variant="body1" className={classes.loading}>
          Winning Numbers: {winningNumbers.join(", ")} (Issue {issueIndex})
        </Typography>
      )}
      {isAdmin && (
        <>
          <TextField
            label="External Random Number"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => drawWinningNumbers(0)} // Replace 0 with the external random number
            disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Draw Winning Numbers 🎰"
            )}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={resetLottery}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Lottery 🔄"}
          </Button>
          <TextField
            label="New Minimum Price"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => updateMinPrice("0.1")} // Replace "0.1" with the desired new minimum price
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Minimum Price 💰"
            )}
          </Button>
          <TextField
            label="New Maximum Number"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => updateMaxNumber(100)} // Replace 100 with the desired new maximum number
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Maximum Number 🔢"
            )}
          </Button>
          <TextField
            label="Allocation 1 (%)"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Allocation 2 (%)"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Allocation 3 (%)"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => updateAllocation(70, 20, 10)} // Replace 70, 20, 10 with the desired allocation percentages
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Allocation 📈"
            )}
          </Button>
        </>
      )}
      {message && (
        <Typography variant="body1" className={classes.loading}>
          {message}
        </Typography>
      )}
    </Container>
  );
 };
 
 export default Lottery;