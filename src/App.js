import React from "react";
import { ethers } from "ethers";
import Web3Provider from "./utils/network";
import NavBar from "./components/NavBar/NavBar";
import CoinSwapper from "./views/CoinSwapper/CoinSwapper";
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./views/Liquidity/Liquidity";
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
import VotingPage from "./views/Voting/vote"; 

const TRACKING_ID = "G-PNK1QQHD9M"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

inject();
injectSpeedInsights();

const App = () => {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
          <Web3Provider render={(network) => (
            <div>
              {/* Include the NavBar component */}
              <NavBar />
              <div className="NavbarContainer">
                <Routes>
                  <Route exact path="/" element={<CoinSwapper network={network} />} />
                  <Route exact path="/liquidity" element={<Liquidity network={network} />} />
                  <Route exact path="/stake" element={<Staking network={network} />} />
                  <Route exact path="/faucet" element={<Faucet network={network} />} />
                  <Route exact path="/tvl" element={<TVL network={network} />} />
                  <Route exact path="/pools" element={<Pools network={network} />} />
                  <Route exact path="/lottery" element={<Lottery network={network} />} />
                  <Route exact path="/vote" element={<VotingPage network={network} />} />
                  <Route exact path="/about" element={<About />} />
                  <Route exact path="/contact" element={<Contact />} />
                  <Route exact path="/privacy" element={<Privacy />} />
                  <Route exact path="/blog" component={PostList} />
                  <Route path="/posts/:id" component={SinglePost} />
                </Routes>
              </div>
            </div>
          )}></Web3Provider>
          <Footer />
      </SnackbarProvider>
    </div>
  );
};

export default App;