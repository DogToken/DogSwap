import React, { useEffect } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { useSnackbar } from "notistack";
import { getBalanceAndSymbol, getReserves } from "../ethereumFunctions";
import COINS from "../constants/coins";

import { addLiquidity, quoteAddLiquidity } from "./LiquidityFunctions";

import CoinField from "../CoinSwapper/CoinField";
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
    background: "linear-gradient(45deg, #008e31 30%, #53ff8e 90%)",
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

function FarmDeployer(props) {
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
  const [field2Value, setField2Value] = React.useState("");

  // Controls the loading button
  const [loading, setLoading] = React.useState(false);

  // Stores the user's balance of liquidity tokens for the current pair
  const [liquidityTokens, setLiquidityTokens] = React.useState("");

  // Used when getting a quote of liquidity
  const [liquidityOut, setLiquidityOut] = React.useState([0, 0, 0]);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    let oldField1Value = field1Value;
    let oldField2Value = field2Value;

    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(oldField2Value);
    setField2Value(oldField1Value);
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  const handleChange = {
    field1: (e) => {
      setField1Value(e.target.value);
    },
    field2: (e) => {
      setField2Value(e.target.value);
    },
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance, symbol) => {
    if (balance && symbol)
      return parseFloat(balance).toPrecision(8) + " " + symbol;
    else return "0.0";
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve, symbol) => {
    if (reserve && symbol) return reserve + " " + symbol;
    else return "0.0";
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      parsedInput1 !== NaN &&
      0 < parsedInput1 &&
      parsedInput2 !== NaN &&
      0 < parsedInput2 &&
      parsedInput1 <= coin1.balance &&
      parsedInput2 <= coin2.balance
    );
  };

  const deploy = () => {
    console.log("Attempting to deploy liquidity...");
    setLoading(true);

    addLiquidity(
      coin1.address,
      coin2.address,
      field1Value,
      field2Value,
      "0",
      "0",
      props.network.router,
      props.network.account,
      props.network.signer
    )
      .then(() => {
        setLoading(false);
        setField1Value("");
        setField2Value("");
        enqueueSnackbar("Deployment Successful", { variant: "success" });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar("Deployment Failed (" + e.message + ")", {
          variant: "error",
          autoHideDuration: 10000,
        });
      });
  };

  const onToken1Selected = (address) => {
    setDialog1Open(false);

    if (address === coin2.address) {
      switchFields();
    } else if (address) {
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        COINS.get(props.network).find((coin) => coin.address === address)
      ).then((data) => {
        setCoin1({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  const onToken2Selected = (address) => {
    setDialog2Open(false);

    if (address === coin1.address) {
      switchFields();
    } else if (address) {
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        COINS.get(props.network).find((coin) => coin.address === address)
      ).then((data) => {
        setCoin2({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };
  useEffect(() => {
    console.log("Trying to get reserves between:\n" + coin1.address + "\n" + coin2.address);

    if (coin1.address && coin2.address && props.network.account) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => {
        setReserves([data[0], data[1]]);
        setLiquidityTokens(data[2]);
      });
    }
  }, [coin1.address, coin2.address, props.network.account, props.network.factory, props.network.signer]);

  useEffect(() => {
    if (isButtonEnabled()) {
      console.log("Trying to preview the liquidity deployment");

      quoteAddLiquidity(
        coin1.address,
        coin2.address,
        field1Value,
        field2Value,
        props.network.factory,
        props.network.signer
      ).then((data) => {
        setLiquidityOut([data[0], data[1], data[2]]);
      });
    }
  }, [coin1.address, coin2.address, field1Value, field2Value, props.network.factory, props.network.signer]);

  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log("Checking balances & Getting reserves...");

      if (coin1.address && coin2.address && props.network.account) {
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => {
          setReserves([data[0], data[1]]);
          setLiquidityTokens(data[2]);
        });
      }

      if (coin1.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          COINS.get(props.network).find((coin) => coin.address === coin1.address)
        ).then((data) => {
          setCoin1({
            ...coin1,
            balance: data.balance,
          });
        });
      }
      if (coin2.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          COINS.get(props.network).find((coin) => coin.address === coin2.address)
        ).then((data) => {
          setCoin2({
            ...coin2,
            balance: data.balance,
          });
        });
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  });

  return (
    <div>
      {/* Liquidity deployer */}
      <Typography variant="h5" className={classes.title}></Typography>

      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        coins={COINS.get(props.network)}
        signer={props.network.signer}
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        coins={COINS.get(props.network)}
        signer={props.network.signer}
      />
      <WrongNetwork
        open={wrongNetworkOpen}
      />

      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12} className={classes.fullWidth}>
          <CoinField
            activeField={true}
            value={field1Value}
            onClick={() => setDialog1Open(true)}
            onChange={handleChange.field1}
            symbol={coin1.symbol !== undefined ? coin1.symbol : "Select"}
          />
        </Grid>

        <Grid item xs={12} className={classes.fullWidth}>
          <CoinField
            activeField={true}
            value={field2Value}
            onClick={() => setDialog2Open(true)}
            onChange={handleChange.field2}
            symbol={coin2.symbol !== undefined ? coin2.symbol : "Select"}
          />
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={4}
        className={classes.balance}
      >
        <hr className={classes.hr} />
        <Grid
          container
          item
          className={classes.values}
          direction="column"
          alignItems="center"
          spacing={2}
        >
          {/* Balance Display */}
          <Typography variant="h6">Your Balances</Typography>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatBalance(coin1.balance, coin1.symbol)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatBalance(coin2.balance, coin2.symbol)}
              </Typography>
            </Grid>
          </Grid>

          <hr className={classes.hr} />

          {/* Reserves Display */}
          <Typography variant="h6">Reserves</Typography>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatReserve(reserves[0], coin1.symbol)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatReserve(reserves[1], coin2.symbol)}
              </Typography>
            </Grid>
          </Grid>

          <hr className={classes.hr} />

          {/* Liquidity Tokens Display */}
          <Typography variant="h6">Your Liquidity Pool Tokens</Typography>
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatReserve(liquidityTokens, "UNI-V2")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Paper className={classes.paperContainer}>
        {/* Red Display to show the quote */}
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          spacing={2}
          className={classes.fullWidth}
        >
          {/* Tokens in */}
          <Typography variant="h6">Tokens in</Typography>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatBalance(liquidityOut[0], coin1.symbol)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatBalance(liquidityOut[1], coin2.symbol)}
              </Typography>
            </Grid>
          </Grid>

          <hr className={classes.hr} />

          {/* Liquidity Tokens Display */}
          <Typography variant="h6">Liquidity Pool Tokens Out</Typography>
          <Grid container direction="row" justifyContent="center">
            <Grid item xs={6}>
              <Typography variant="body1" className={classes.balance}>
                {formatReserve(liquidityOut[2], "UNI-V2")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <hr className={classes.hr} />
      <Grid container direction="column" alignItems="center" spacing={2}>
        <LoadingButton
          loading={loading}
          valid={isButtonEnabled()}
          success={false}
          fail={false}
          onClick={deploy}
        >
          <AccountBalanceIcon className={classes.buttonIcon} />
          Deploy
        </LoadingButton>
      </Grid>
    </div>
  );
}

export default FarmDeployer;
  );
}

export default FarmDeployer;