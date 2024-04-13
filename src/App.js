import React from "react";
import { ethers } from "ethers";
import Web3Provider from "./utils/network";
import NavBar from "./components/NavBar/NavBar";
import CoinSwapper from "./views/CoinSwapper/CoinSwapper";
import { Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./views/Liquidity/Liquidity";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Footer from "./components/Footer/footer";
import "./components/Footer/footer.css";
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import About from "./views/Info/About";
import Contact from "./views/Info/Contact";
import Privacy from "./views/Info/Privacy";
import Staking from "./views/Staking/Staking";
import Faucet from "./views/Faucet/Faucet";
import TVL from "./views/tvl/tvl";
import Pools from "./views/Pools/pools";
import Lottery from "./views/Lottery/Lottery";
import PostList from './views/Blog/PostList';
import SinglePost from './views/Blog/SinglePost';
import ReactGA from 'react-ga';
import Market from './views/Market/NFTMarketplace';
import VotingPage from "./views/Voting/vote"; 

const TRACKING_ID = "G-PNK1QQHD9M"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

inject();
injectSpeedInsights();

const theme = createTheme({
  palette: {
    primary: {
      main: "#008e31",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },
  },
});

const App = () => {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <Web3Provider render={(network) => (
            <div>
              {/* Include the NavBar component */}
              <NavBar />
              <div className="NavbarContainer">
                <Route exact path="/">
                  <CoinSwapper network={network} />
                </Route>
                <Route exact path="/liquidity">
                  <Liquidity network={network} />
                </Route>
                <Route exact path="/stake">
                  <Staking network={network} />
                </Route>
                <Route exact path="/faucet">
                  <Faucet network={network} />
                </Route>
                <Route exact path="/tvl">
                  <TVL network={network} />
                </Route>
                <Route exact path="/pools">
                  <Pools network={network} />
                </Route>
                <Route exact path="/lottery">
                  <Lottery network={network} />
                </Route>
                <Route exact path="/market">
                  <Market network={network} />
                </Route>
                <Route exact path="/vote">
                  <VotingPage network={network} />
                </Route>
                <Route exact path="/about">
                  <About />
                </Route>
                <Route exact path="/contact">
                  <Contact />
                </Route>
                <Route exact path="/privacy">
                  <Privacy />
                </Route>
                <Route exact path="/blog" component={PostList} />
                <Route path="/posts/:id" component={SinglePost} />
              </div>
            </div>
          )}></Web3Provider>
          {/* Include the Footer component here */}
          <Footer />
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
};

export default App;