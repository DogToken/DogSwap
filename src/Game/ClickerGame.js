import React, { useState, useEffect } from 'react';
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

  return (
    <div className="container">
      <div className="clicker-paper">
        <h1>DogMiner - Incremental Clicker Game</h1>
        <div className="center">
          <button className="click-button" onClick={handleClick}>
            <FaDog /> Click Me
          </button>
          <div className="currency-container">
            <div className="currency">
              <FaCoins className="currency-icon" /> Smoll Tokens: {state.smollTokens}
            </div>
          </div>
        </div>
      </div>
      {/* Side Menu */}
      <div className="side-menu">
        <div className="paper">
          <h2>Shop</h2>
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
        </div>
        <div className="paper">
          <h2>Bank</h2>
          <Bank
            smollTokens={state.smollTokens}
            setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
            ether={state.ether}
            setEther={(newEther) => setState((prevState) => ({ ...prevState, ether: newEther }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ClickerGame;
