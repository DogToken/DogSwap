import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField, Grid, Card, CardContent } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faWallet, faCoins, faTrophy } from '@fortawesome/free-solid-svg-icons';

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

const Lottery = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketAmount, setTicketAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");
  const [totalTickets, setTotalTickets] = useState("0");
  const [jackpotAmount, setJackpotAmount] = useState("0");

  useEffect(() => {
    // Fetch and set initial data
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch wallet balance
      const walletBalance = await fetchWalletBalance();
      setWalletBalance(walletBalance);

      // Fetch total tickets
      const totalTickets = await fetchTotalTickets();
      setTotalTickets(totalTickets);

      // Fetch jackpot amount
      const jackpotAmount = await fetchJackpotAmount();
      setJackpotAmount(jackpotAmount);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchWalletBalance = async () => {
    // Implement the logic to fetch the wallet balance
    // Return the wallet balance as a string
    return "100.0";
  };

  const fetchTotalTickets = async () => {
    // Implement the logic to fetch the total number of tickets sold
    // Return the total tickets as a string
    return "1000";
  };

  const fetchJackpotAmount = async () => {
    // Implement the logic to fetch the current jackpot amount
    // Return the jackpot amount as a string
    return "10000.0";
  };

  const buyTickets = async () => {
    try {
      setLoading(true);

      // Parse the ticket amount
      const numTickets = parseInt(ticketAmount, 10);

      // Ensure the ticket amount is valid
      if (isNaN(numTickets) || numTickets <= 0) {
        throw new Error("Please enter a valid number of tickets to buy.");
      }

      // Implement the logic to buy tickets
      // You may need to call a contract function or perform other operations

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

      // Implement the logic to claim the jackpot
      // You may need to call a contract function or perform other operations

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