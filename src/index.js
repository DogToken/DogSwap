import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function getWeb3Library(provider) {
  // Check if the provider is available
  if (provider && provider.isMetaMask) {
    // If using MetaMask, return the ethers.js provider wrapping the MetaMask provider
    return new ethers.providers.Web3Provider(provider);
  } else {
    // Otherwise, return the default ethers.js provider (e.g., for testing)
    return new ethers.providers.JsonRpcProvider("https://node1.mintme.com");
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Web3ReactProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
