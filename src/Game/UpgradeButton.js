import React from 'react';
import Button from '@mui/material/Button';
import { FaCoins } from 'react-icons/fa';

const UpgradeButton = ({ smollTokens, setSmollTokens }) => {
  const handleUpgradeClick = () => {
    if (smollTokens >= 10) {
      setSmollTokens(smollTokens - 10);
      // Add your upgrade logic here
    } else {
      alert("Not enough Smoll Tokens to purchase the upgrade!");
    }
  };

  return (
    <div>
      <h2>Upgrade Button</h2>
      <div className="currency-container">
        <div className="currency">
          <FaCoins className="currency-icon" /> Smoll Tokens: {smollTokens}
        </div>
        {/* Add progress bar for Smoll Tokens here if desired */}
      </div>
      <Button variant="contained" color="primary" onClick={handleUpgradeClick}>
        Purchase Upgrade (Cost: 10 Smoll Tokens)
      </Button>
    </div>
  );
};

export default UpgradeButton;
