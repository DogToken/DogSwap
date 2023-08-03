import React, { useState } from 'react';
import { FaDog } from 'react-icons/fa';
import Shop from './Shop';
import Bank from './Bank';
import './styles/game.css';

const ClickerGame = () => {
  // ... (existing code)

  const [showShop, setShowShop] = useState(false);
  const [showBank, setShowBank] = useState(false);

  const handleShowShop = () => {
    setShowShop(true);
  };

  const handleHideShop = () => {
    setShowShop(false);
  };

  const handleShowBank = () => {
    setShowBank(true);
  };

  const handleHideBank = () => {
    setShowBank(false);
  };

  return (
    <div className="container">
      {/* Information Box */}
      <div className="info-box">
        <h2>Stats</h2>
        <div className="stat-item">
          <FaCoins className="currency-icon" /> Smoll Tokens: {state.smollTokens}
        </div>
        <div className="stat-item">
          <FaEthereum className="currency-icon" /> Ether: {state.ether}
        </div>
        <div className="stat-item">User Level: {calculateUserLevel()}</div>
        <div className="stat-item">Awards: (Coming Soon)</div>
        <div className="stat-item">Profile Picture: (Coming Soon)</div>
      </div>

      {/* Clicker Box */}
      <div className="clicker-box">
        <h1>DogMiner - Incremental Clicker Game</h1>
        <div className="center">
          <button className="click-button" onClick={handleClick}>
            <FaDog /> Click Me
          </button>
        </div>
      </div>

      {/* Add buttons to show/hide the pop-ups */}
      <div className="nav-links">
        <button onClick={handleShowShop}>Open Shop</button>
        <button onClick={handleShowBank}>Open Bank</button>
      </div>

      {/* Shop Pop-up */}
      <Shop open={showShop} handleClose={handleHideShop} />

      {/* Bank Pop-up */}
      <Bank open={showBank} handleClose={handleHideBank} />
    </div>
  );
};

export default ClickerGame;
