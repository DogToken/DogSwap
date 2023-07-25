// NavBar.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

const NavBar = () => {
  const [tvl, setTVL] = useState(null);
  const [connected, setConnected] = useState(false);

  // Function to calculate TVL based on your specific logic (replace with your actual calculation)
  const calculateTVL = (totalSupply, burnedSupply) => {
    // Your TVL calculation logic here
    // Example: const tvlValue = totalSupply - burnedSupply;
    // Replace this with your specific TVL calculation logic
    return YOUR_TV_CALCULATION;
  };

  const fetchTVLData = async () => {
    try {
      // Make the API call to fetch TVL data
      const response = await fetch('https://api.dogswap.online');
      const data = await response.json();

      // Extract the required data from the API response
      const totalSupply = data.totalSupply;
      const burnedSupply = data.burnedSupply;

      // Calculate TVL based on your specific logic
      const calculatedTVL = calculateTVL(totalSupply, burnedSupply);

      // Update the state with the calculated TVL value
      setTVL(calculatedTVL);
    } catch (error) {
      console.error('Error fetching TVL data:', error);
    }
  };

  useEffect(() => {
    fetchTVLData();
  }, []);

  useEffect(() => {
    // Check if MetaMask provider is available
    detectEthereumProvider().then(provider => {
      if (provider) {
        setConnected(true);
      }
    });
  }, []);

  const connectToMetaMask = async () => {
    try {
      // Request access to the user's MetaMask accounts
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        // Once connected, you can interact with the Ethereum blockchain using ethers.js
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Perform Ethereum transactions or any other interactions
        // Example: const signer = provider.getSigner();
        //          const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        //          const transaction = await contract.transfer(toAddress, amount);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <nav>
      <div className="Title">
        <h1 className="navbar-logo">
          🐶 DogSwap
          {/* Display the TVL value in the navbar */}
          {tvl !== null && <span className="tvl-value">TVL: ${tvl}</span>}
        </h1>
      </div>

      <div className="NavbarItems">
        <ul className={`nav-menu`}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={"nav-links"} to={item.url}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* MetaMask button */}
      <div className="metamask-button">
        {connected ? (
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        ) : (
          <p>MetaMask not detected.</p>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
