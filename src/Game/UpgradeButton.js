import React from 'react';
import Button from '@mui/material/Button';

const UpgradeButton = ({ score, setScore, smollTokens, setSmollTokens }) => {
  const handleUpgradeClick = () => {
    if (score >= 10) {
      setScore(score - 10);
      setSmollTokens(smollTokens + 1);
      // Add your upgrade logic here
    } else {
      alert("Not enough score to purchase the upgrade!");
    }
  };

  return (
    <div>
      <h2>Upgrade Button</h2>
      <Button variant="contained" color="primary" onClick={handleUpgradeClick}>
        Purchase Upgrade (Cost: 10 Score)
      </Button>
    </div>
  );
};

export default UpgradeButton;
