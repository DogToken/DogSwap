import React from 'react';
import Button from '@mui/material/Button';

const Shop = ({ ether, setEther, clickMultiplier, setClickMultiplier, autoClicker, setAutoClicker }) => {
  const handleClickMultiplier = () => {
    if (ether >= 5) {
      setEther(ether - 5);
      setClickMultiplier(clickMultiplier + 1);
    } else {
      alert("Not enough Ether to purchase the Click Multiplier!");
    }
  };

  const handleAutoClicker = () => {
    if (ether >= 10) {
      setEther(ether - 10);
      setAutoClicker(true);
    } else {
      alert("Not enough Ether to purchase the Auto Clicker!");
    }
  };

  return (
    <div>
      <h2>Shop</h2>
      <p>Click Multiplier (Cost: 5 Ether)</p>
      <Button variant="contained" color="primary" onClick={handleClickMultiplier}>
        Purchase Click Multiplier
      </Button>
      <p>Auto Clicker (Cost: 10 Ether)</p>
      <Button variant="contained" color="primary" onClick={handleAutoClicker}>
        Purchase Auto Clicker
      </Button>
    </div>
  );
};

export default Shop;
