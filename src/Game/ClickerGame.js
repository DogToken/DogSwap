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
    clicks: 0,
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
      smollTokens: prevState.smollTokens + prevState.clickMultiplier,
      clicks: prevState.clicks + 1,
    }));
  };

  // Calculate the Ether based on Smoll Tokens
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      ether: Math.floor(prevState.smollTokens / 1337),
    }));
  }, [state.smollTokens]);

  // Calculate user level based on clicks
  const calculateUserLevel = () => {
    return Math.floor(100 * Math.pow(1.1, state.clicks / 10));
  };

  return (
    <div className="container">
      {/* Stats Box */}
      <div className="stats-box">
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
      <div className="clicker-paper">
        <h1>DogMiner - Incremental Clicker Game</h1>
        <div className="center">
          <button className="click-button" onClick={handleClick}>
            <FaDog /> Click Me
          </button>
        </div>
      </div>
      {/* Side Menu */}
      <div className="side-menu">
        <div className="paper">
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
