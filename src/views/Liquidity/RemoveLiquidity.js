import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  getBalanceAndSymbol,
  getReserves,
} from "../../utils/ethereumFunctions";
import { removeLiquidity, quoteRemoveLiquidity } from "./LiquidityFunctions";
import {
  RemoveLiquidityField1,
  RemoveLiquidityField2,
} from "../CoinSwapper/CoinField";
import CoinDialog from "../CoinSwapper/CoinDialog";
import LoadingButton from "../../components/LoadingButton";
import WrongNetwork from "../../components/wrongNetwork";

function LiquidityRemover(props) {
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
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  const handleChange = {
    field1: (e) => {
      setField1Value(e.target.value);
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

    // If both coins have been selected, and a valid float has been entered for both, which are less than the user's balances, then return true
    const parsedInput = parseFloat(field1Value);
    return (
      coin1.address &&
      coin2.address &&
      parsedInput !== NaN &&
      0 < parsedInput &&
      parsedInput <= liquidityTokens
    );
  };

  const remove = () => {
    console.log("Attempting to remove liquidity...");
    setLoading(true);

    removeLiquidity(
      coin1.address,
      coin2.address,
      field1Value,
      0,
      0,
      props.network.router,
      props.network.account,
      props.network.signer,
      props.network.factory
    )
      .then(() => {
        setLoading(false);

        // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
        setField1Value("");
        enqueueSnackbar("Removal Successful", { variant: "success" });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar("Deployment Failed (" + e.message + ")", {
          variant: "error",
          autoHideDuration: 10000,
        });
      });
  };

  // Called when the dialog window for coin1 exits
  const onToken1Selected = (address) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
        ).then((data) => {
        setCoin1({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  // Called when the dialog window for coin2 exits
  const onToken2Selected = (address) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
        ).then((data) => {
        setCoin2({
          address: address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  // This hook is called when either of the state variables `coin1.address` or `coin2.address` change.
  // This means that when the user selects a different coin to convert between, or the coins are swapped,
  // the new reserves will be calculated.
  useEffect(() => {
    console.log(
      "Trying to get reserves between:\n" + coin1.address + "\n" + coin2.address
    );

    if (coin1.address && coin2.address && props.network.account) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account).then(
        (data) => {
          setReserves([data[0], data[1]]);
          setLiquidityTokens(data[2]);
        }
      );
    }
  }, [coin1.address, coin2.address, props.network.account, props.network.factory, props.network.signer]);

  // This hook is called when either of the state variables `field1Value`, `coin1.address` or `coin2.address` change.
  // It will give a preview of the liquidity removal.
  useEffect(() => {
    if (isButtonEnabled()) {
      console.log("Trying to preview the liquidity removal");
      quoteRemoveLiquidity(
        coin1.address,
        coin2.address,
        field1Value,
        props.network.factory,
        props.network.signer
      ).then((data) => {
        setTokensOut(data);
      });
    }
  }, [coin1.address, coin2.address, field1Value, props.network.factory, props.network.signer]);

  useEffect(() => {
    // This hook creates a timeout that will run every ~10 seconds, it's role is to check if the user's balance has
    // updated has changed. This allows them to see when a transaction completes by looking at the balance output.

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

      if (coin1.address && props.network.account &&!wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address, props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
          ).then(
          (data) => {
            setCoin1({
              ...coin1,
              balance: data.balance,
            });
          }
        );
      }
      if (coin2.address && props.network.account &&!wrongNetworkOpen) {
        getBalanceAndSymbol(props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
          ).then(
          (data) => {
            setCoin2({
              ...coin2,
              balance: data.balance,
            });
          }
        );
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  });

  return (
    <div>

      {/* Dialog Windows */}
      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        coins={props.network.coins}
        signer={props.network.signer}
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        coins={props.network.coins}
        signer={props.network.signer}
      />
      <WrongNetwork
        open={wrongNetworkOpen}
      />

      <div container direction="column" alignItems="center" spacing={2}>
        <div item xs={12}>
          <RemoveLiquidityField1
            activeField={true}
            value={field1Value}
            onClick={() => setDialog1Open(true)}
            onChange={handleChange.field1}
            symbol={coin1.symbol !== undefined ? coin1.symbol : "Select"}
          />
        </div>

        <div item xs={12}>
          <RemoveLiquidityField2
            activeField={true}
            onClick={() => setDialog2Open(true)}
            symbol={coin2.symbol !== undefined ? coin2.symbol : "Select"}
          />
        </div>
      </div>

      <div
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >
        <hr />
        <div
          container
          item
          direction="column"
          alignItems="center"
          spacing={2}
        >
          {/* Balance Display */}
          <h6>Your Balances</h6>
          <div container direction="row" justifyContent="space-between">
            <div item xs={6}>
              <p>
                {formatBalance(coin1.balance, coin1.symbol)}
              </p>
            </div>
            <div item xs={6}>
              <p>
                {formatBalance(coin2.balance, coin2.symbol)}
              </p>
            </div>
          </div>

          <hr />

          {/* Reserves Display */}
          <h6>Reserves</h6>
          <div container direction="row" justifyContent="space-between">
            <div item xs={6}>
              <p>
                {formatReserve(reserves[0], coin1.symbol)}
              </p>
            </div>
            <div item xs={6}>
              <p>
                {formatReserve(reserves[1], coin2.symbol)}
              </p>
            </div>
          </div>

          <hr />

          {/* Liquidity Tokens Display */}
          <h6>Your Liquidity Pool Tokens</h6>
          <div container direction="row" justifyContent="center">
            <div item xs={6}>
              <p>
                {formatReserve(liquidityTokens, "UNI-V2")}
              </p>
            </div>
          </div>
        </div>

        <div >
          {/*Red  Display to show the quote */}
          <div
            container
            item
            direction="column"
            alignItems="center"
            spacing={2}
          >
            {/* Tokens in */}
            <h6>Liquidity Pool Tokens in</h6>
            <div container direction="row" justifyContent="center">
              <div item xs={6}>
                <p>
                  {formatBalance(tokensOut[0], "UNI-V2")}
                </p>
              </div>
            </div>

            <hr />

            {/* Liquidity Tokens Display */}
            <h6>Tokens Out</h6>
            <div container direction="row" justifyContent="space-between">
              <div item xs={6}>
                <p>
                  {formatBalance(tokensOut[1], coin1.symbol)}
                </p>
              </div>
              <div item xs={6}>
                <p>
                  {formatBalance(tokensOut[2], coin2.symbol)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>

      <div container direction="column" alignItems="center" spacing={2}>
        <LoadingButton
          loading={loading}
          valid={isButtonEnabled()}
          success={false}
          fail={false}
          onClick={remove}
        >
          Remove
        </LoadingButton>
      </div>
    </div>
  );
}

export default LiquidityRemover;