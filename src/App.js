import React from "react";
import "./App.css";
import { ethers } from "ethers";
import Web3Provider from "./network";
import NavBar from "./NavBar/NavBar";
import CoinSwapper from "./CoinSwapper/CoinSwapper";
import { Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./Liquidity/Liquidity";
import Farms from "./Farms/Farms";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Footer from "./footer"; // Import the Footer component
import Game from "./Game/Game"
import "./footer.css"; // Import the Footer styles

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
          <Web3Provider
            render={(network) => (
              <div>
                <NavBar />
                <div className="NavbarContainer">
                  <Route exact path="/">
                    <CoinSwapper network={network} />
                  </Route>
                  <Route exact path="/liquidity">
                    <Liquidity network={network} />
                  </Route>
                  <Route exact path="/farms">
                    <Farms network={network} />
                  </Route>
                </div>
              </div>
            )}
          ></Web3Provider>
          {/* Include the Footer component here */}
          <Footer />
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
};

export default App;
