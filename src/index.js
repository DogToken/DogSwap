import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ethers } from "ethers";

function getLibrary(provider) {
  if (provider && provider.isMetaMask) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return new ethers.providers.JsonRpcProvider("https://node.1000x.ch");
  }
}

// Replace the Web3ReactProvider with direct Web3Provider
const provider = getLibrary(window.ethereum);

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
