import React from 'react';
import Button from '@mui/material/Button';
import { FaCoins, FaEthereum } from 'react-icons/fa';

const Shop = ({ smollTokens, setSmollTokens, ether, setEther, clickMultiplier, setClickMultiplier, autoClicker, setAutoClicker }) => {
  const handleClickMultiplier = () => {
    if (smollTokens >= 5) {
      setSmollTokens(smollTokens - 5);
      setClickMultiplier(clickMultiplier + 1);
    } else {
      alert("Not enough Smoll Tokens to purchase the Click Multiplier!");
    }
  };

  const handleAutoClicker = () => {
    const autoclickerCost = Math.floor(10 * Math.pow(1.15, autoClicker));
    if (smollTokens >= autoclickerCost) {
      setSmollTokens(smollTokens - autoclickerCost);
      setAutoClicker(autoClicker + 1);
    } else {
      alert("Not enough Smoll Tokens to purchase the Auto Clicker!");
    }
  };

  // Calculate the autoclicks per 15 seconds based on the number of autoclickers
  const autoclicksPer15Seconds = Math.floor(autoClicker / 100) + 1;

  return (
    <div>
      <h2>Shop</h2>
      <div className="currency-container">
        <div className="currency">
          <FaCoins className="currency-icon" /> Smoll Tokens: {smollTokens}
        </div>
        {/* Add progress bar for Smoll Tokens here if desired */}
      </div>
      <p>Click Multiplier (Cost: 5 Smoll Tokens)</p>
      <Button variant="contained" color="primary" onClick={handleClickMultiplier}>
        Purchase Click Multiplier
      </Button>
      <p>Auto Clicker (Cost: {Math.floor(10 * Math.pow(1.15, autoClicker))} Smoll Tokens)</p>
      <p>Autoclicks per 15 seconds: {autoclicksPer15Seconds}</p>
      <Button variant="contained" color="primary" onClick={handleAutoClicker}>
        Purchase Auto Clicker
      </Button>
    </div>
  );
};

export default Shop;
