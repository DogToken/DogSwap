import React, { useState, useEffect } from 'react';
import UpgradeButton from './UpgradeButton';
import ScoreDisplay from './ScoreDisplay';
import Bank from './Bank';
import Shop from './Shop';
import './styles/game.css';
import { FaDog, FaCoins, FaEthereum } from 'react-icons/fa';

const ClickerGame = () => {
  // Initialize state from local storage if available
  const initialState = {
    smollTokens: 0,
    ether: 0,
    clickMultiplier: 1,
    autoClicker: 0,
  };

  const [state, setState] = useState(() => {
    const savedState = JSON.parse(localStorage.getItem('dogMinerSave'));
    return savedState || initialState;
  });

  // Save state to local storage whenever there's a change
  useEffect(() => {
    localStorage.setItem('dogMinerSave', JSON.stringify(state));
  }, [state]);

  const handleClick = () => {
    setState((prevState) => ({
      ...prevState,
      smollTokens: prevState.smollTokens + 1,
    }));
  };

  // Calculate the Ether based on Smoll Tokens
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      ether: Math.floor(prevState.smollTokens / 1337),
    }));
  }, [state.smollTokens]);

  // Show/hide shop and bank
  const [showShop, setShowShop] = useState(false);
  const [showBank, setShowBank] = useState(false);

  return (
    <div className="container">
      <h1>DogMiner - Incremental Clicker Game</h1>
      <div className="paper">
        <button className="click-button" onClick={handleClick}>
          <FaDog /> Click Me
        </button>
        <div className="currency-container">
          <div className="currency">
            <FaCoins className="currency-icon" /> Smoll Tokens: {state.smollTokens}
          </div>
          {/* Add progress bar for Smoll Tokens here if desired */}
        </div>
        <div className="currency-container">
          <div className="currency">
            <FaEthereum className="currency-icon" /> Ether: {state.ether}
          </div>
          {/* Add progress bar for Ether here if desired */}
        </div>
      </div>
      {/* Shop */}
      <div className="paper">
        <button
          className="shop-bank-button"
          onClick={() => setShowShop(!showShop)}
        >
          Show Shop
        </button>
        {showShop && (
          <Shop
            smollTokens={state.smollTokens}
            setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
            ether={state.ether}
            setEther={(newEther) => setState((prevState) => ({ ...prevState, ether: newEther }))}
            clickMultiplier={state.clickMultiplier}
            setClickMultiplier={(newMultiplier) => setState((prevState) => ({ ...prevState, clickMultiplier: newMultiplier }))}
            autoClicker={state.autoClicker}
            setAutoClicker={(newAutoClicker) => setState((prevState) => ({ ...prevState, autoClicker: newAutoClicker }))}
          />
        )}
      </div>
      {/* Bank */}
      <div className="paper">
        <button
          className="shop-bank-button"
          onClick={() => setShowBank(!showBank)}
        >
          Show Bank
        </button>
        {showBank && (
          <Bank
            smollTokens={state.smollTokens}
            setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
            ether={state.ether}
            setEther={(newEther) => setState((prevState) => ({ ...prevState, ether: newEther }))}
          />
        )}
      </div>
      <UpgradeButton
        smollTokens={state.smollTokens}
        setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
      />
    </div>
  );
};

export default ClickerGame;
