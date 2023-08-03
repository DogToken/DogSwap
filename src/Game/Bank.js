import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import { FaCoins, FaEthereum } from 'react-icons/fa';

const Bank = ({ smollTokens, setSmollTokens, ether, setEther }) => {
  const [sellAmount, setSellAmount] = useState(0);

  const handleSell = () => {
    if (sellAmount > 0) {
      setSmollTokens(smollTokens - sellAmount);
      setEther(ether + sellAmount / 10);
      setSellAmount(0);
    } else {
      alert("Please select an amount to sell!");
    }
  };

  return (
    <div>
      <h2>Bank</h2>
      <div className="currency-container">
        <div className="currency">
          <FaCoins className="currency-icon" /> Smoll Tokens:
        </div>
        <div className="slider-container">
          <Slider
            className="slider"
            value={sellAmount}
            onChange={(e, value) => setSellAmount(value)}
            max={smollTokens}
            step={1}
            valueLabelDisplay="auto"
            aria-labelledby="sell-slider"
          />
          <Button variant="contained" color="primary" onClick={handleSell}>
            Sell
          </Button>
        </div>
      </div>
      <div className="currency-container">
        <div className="currency">
          <FaEthereum className="currency-icon" /> Ether: {ether}
        </div>
        <div className="progress-bar">
          {/* Add progress bar for Smoll Tokens here if desired */}
        </div>
      </div>
    </div>
  );
};

export default Bank;
