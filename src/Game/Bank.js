import React from 'react';
import Button from '@mui/material/Button';

const Bank = ({ smollTokens, setSmollTokens, ether, setEther }) => {
  const exchangeRate = 10; // 10 Smoll Tokens for 1 Ether

  const handleExchange = () => {
    if (smollTokens >= exchangeRate) {
      setSmollTokens(smollTokens - exchangeRate);
      setEther(ether + 1);
    } else {
      alert("Not enough Smoll Tokens to exchange!");
    }
  };

  return (
    <div>
      <h2>Bank</h2>
      <p>Exchange {exchangeRate} Smoll Tokens for 1 Ether</p>
      <Button variant="contained" color="primary" onClick={handleExchange}>
        Exchange
      </Button>
      <p>Smoll Tokens: {smollTokens}</p>
      <p>Ether: {ether}</p>
    </div>
  );
};

export default Bank;
