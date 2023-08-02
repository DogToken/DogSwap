import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function getLibrary(provider) {
  if (provider && provider.isMetaMask) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return new ethers.providers.JsonRpcProvider("https://node1.mintme.com");
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Web3ReactProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
