import React, { useEffect } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useSnackbar } from "notistack";
import {
  getBalanceAndSymbol,
  getReserves,
} from "../ethereumFunctions";
import { removeLiquidity, quoteRemoveLiquidity } from "./LiquidityFunctions";
import {
  RemoveLiquidityField1,
  RemoveLiquidityField2,
} from "../CoinSwapper/CoinField";
import CoinDialog from "../CoinSwapper/CoinDialog";
import LoadingButton from "../Components/LoadingButton";
import WrongNetwork from "../Components/wrongNetwork";

const styles = (theme) => ({
  paperContainer: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    width: "40%",
    overflow: "wrap",
    background: "linear-gradient(45deg, #ff0000 30%, #FF8E53 90%)",
    color: "white",
  },
  fullWidth: {
    width: "100%",
  },
  values: {
    width: "50%",
  },
  title: {
    textAlign: "center",
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  hr: {
    width: "100%",
  },
  balance: {
    padding: theme.spacing(1),
    overflow: "wrap",
    textAlign: "center",
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(0.4),
  },
});

const useStyles = makeStyles(styles);

function LiquidityRemover(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // Stores a record of whether their respective dialog window is open
  const [dialog1Open, setDialog1Open] = React.useState(false);
  const [dialog2Open, setDialog2Open] = React.useState(false);
  const [wrongNetworkOpen, setwrongNetworkOpen] = React.useState(false);

  // Stores data about their respective coin
  const [coin1, setCoin1] = React.useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = React.useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = React.useState(["0.0", "0.0"]);

  // Stores the current value of their respective text box
  const [field1Value, setField1Value] = React.useState("");

  // Controls the loading button
  const [loading, setLoading] = React.useState(false);

  // Stores the liquidity tokens balance of the user
  const [liquidityTokens, setLiquidityTokens] = React.useState("");

  // Stores the input and output for the liquidity removal preview
  const [tokensOut, setTokensOut] = React.useState([0, 0, 0]);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setReserves(reserves.reverse());  };

  // Handles the removal of liquidity
  const handleRemoveLiquidity = async () => {
    if (!coin1.address || !coin2.address) {
      return;
    }

    setLoading(true);

    try {
      const result = await removeLiquidity(
        coin1.address,
        coin2.address,
        field1Value,
        liquidityTokens
      );

      // Display success message
      enqueueSnackbar("Liquidity removed successfully", {
        variant: "success",
      });

      // Clear input fields
      setField1Value("");
      setLiquidityTokens("");
      setTokensOut([0, 0, 0]);

      // TODO: Perform any additional actions after removing liquidity

    } catch (error) {
      // Display error message
      enqueueSnackbar("Error removing liquidity", {
        variant: "error",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Check if the user is connected to the correct network
      const isConnectedToCorrectNetwork = await checkNetwork();

      if (!isConnectedToCorrectNetwork) {
        setwrongNetworkOpen(true);
        return;
      }

      // Fetch the balance and symbol for coin1
      const coin1Data = await getBalanceAndSymbol(coin1.address);
      setCoin1(coin1Data);

      // Fetch the balance and symbol for coin2
      const coin2Data = await getBalanceAndSymbol(coin2.address);
      setCoin2(coin2Data);

      // Fetch the current reserves in the liquidity pool
      const reservesData = await getReserves(coin1.address, coin2.address);
      setReserves(reservesData);
    };

    fetchData();
  }, [coin1.address, coin2.address]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.title}>
          Remove Liquidity
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paperContainer}>
          <Typography variant="h6" className={classes.title}>
            <span className={classes.values}>
              {coin1.balance ? coin1.balance.toFixed(2) : "0.00"}
            </span>{" "}
            {coin1.symbol}
          </Typography>
          <RemoveLiquidityField1
            coin={coin1}
            dialogOpen={dialog1Open}
            setDialogOpen={setDialog1Open}
            setCoin={setCoin1}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paperContainer}>
          <Typography variant="h6" className={classes.title}>
            <span className={classes.values}>
              {coin2.balance ? coin2.balance.toFixed(2) : "0.00"}
            </span>{" "}
            {coin2.symbol}
          </Typography>
          <RemoveLiquidityField2
            coin={coin2}
            dialogOpen={dialog2Open}
            setDialogOpen={setDialog2Open}
            setCoin={setCoin2}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paperContainer}>
          <Typography variant="h6" className={classes.title}>
            Your Liquidity
          </Typography>
          <Typography variant="body1" className={classes.balance}>
            {liquidityTokens ? liquidityTokens.toFixed(2) : "0.00"} LP Tokens
          </Typography>
          <CoinDialog
            open={dialog1Open}
            setOpen={setDialog1Open}
            setCoin={setCoin1}
          />
          <CoinDialog
            open={dialog2Open}
            setOpen={setDialog2Open}
            setCoin={setCoin2}
          />
          <Typography variant="body1" className={classes.balance}>
            {tokensOut[0]} {coin1.symbol} + {tokensOut[1]} {coin2.symbol}
          </Typography>
          <Typography variant="body1" className={classes.balance}>
            = {tokensOut[2]} LP Tokens
          </Typography>
          <LoadingButton
            onClick={handleRemoveLiquidity}
            loading={loading}
            disabled={!field1Value || !liquidityTokens}
            startIcon={<ArrowDownwardIcon />}
            className={classes.fullWidth}
          >
            Remove Liquidity
          </LoadingButton>
        </Paper>
      </Grid>
      <WrongNetwork open={wrongNetworkOpen} setOpen={setwrongNetworkOpen} />
    </Grid>
  );
}

export default LiquidityRemover;
