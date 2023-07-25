import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { ethers } from "ethers";
import COINS from "../constants/coins";
import * as ethereumFunctions from "../ethereumFunctions";
import SwitchButton from "../Liquidity/SwitchButton";
import LiquidityDeployer from "../Liquidity/LiquidityDeployer";
import LiquidityRemover from "../Liquidity/RemoveLiquidity";

const styles = (theme) => ({
  paperContainer: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    maxWidth: 700,
    margin: "auto",
  },
  title: {
    textAlign: "center",
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  footer: {
    marginTop: "155px",
  },
});

const useStyles = makeStyles(styles);

function Farms(props) {
  const classes = useStyles();

  const [deploy, setDeploy] = useState(true);
  const [account, setAccount] = useState("");
  const [tokenBalances, setTokenBalances] = useState({});

  const deploy_or_remove = (deploy) => {
    if (deploy === true) {
      return <LiquidityDeployer network={props.network} />;
    }
    return <LiquidityRemover network={props.network} />;
  };

  useEffect(() => {
    const fetchTokenBalances = async () => {
      try {
        const provider = ethereumFunctions.getProvider();
        const signer = ethereumFunctions.getSigner(provider);
        const accountAddress = await ethereumFunctions.getAccount();
        setAccount(accountAddress);

        // Fetch balances for each token in COINS
        const balances = {};
        for (const coin of COINS.get(props.network)) {
          const balanceAndSymbol = await ethereumFunctions.getBalanceAndSymbol(
            accountAddress,
            coin.address,
            provider,
            signer,
            COINS.get(props.network)[0].address, // Weth address
            COINS.get(props.network)
          );
          balances[coin.abbr] = balanceAndSymbol.balance;
        }

        setTokenBalances(balances);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      }
    };

    fetchTokenBalances();
  }, [props.network]);

  return (
    <div>
      <Container>
        <Paper className={classes.paperContainer}>
          <Typography variant="h5" className={classes.title}>
            <SwitchButton setDeploy={setDeploy} />
          </Typography>

          {deploy_or_remove(deploy)}
        </Paper>
      </Container>

      <Grid
        container
        className={classes.footer}
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        {/* Display token balances */}
        {Object.keys(tokenBalances).map((abbr) => (
          <Grid item key={abbr}>
            <Typography>
              {abbr}: {tokenBalances[abbr]}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Farms;
