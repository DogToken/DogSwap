import React from "react";
import {createRoot} from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ethers, BrowserProvider } from 'ethers';

function getLibrary(provider) {
  if (provider && provider.isMetaMask) {
    return new BrowserProvider(window.ethereum);
  } else {
    return new BrowserProvider("https://node.1000x.ch");
  }
}

// Replace the Web3ReactProvider with direct Web3Provider
const provider = getLibrary(window.ethereum);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
);

reportWebVitals();
