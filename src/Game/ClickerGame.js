import React, { useState, useEffect } from 'react';
import UpgradeButton from './UpgradeButton';
import ScoreDisplay from './ScoreDisplay';
import Bank from './Bank';
import Shop from './Shop';
import './styles/global.css';

const ClickerGame = () => {
  // Initialize state from local storage if available
  const initialState = {
    score: 0,
    smollTokens: 0,
    ether: 0,
    clickMultiplier: 1,
    autoClicker: false,
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
      score: prevState.score + prevState.clickMultiplier,
      smollTokens: prevState.smollTokens + prevState.clickMultiplier,
    }));
  };

  return (
    <div className="container">
      <h1>DogMiner - Incremental Clicker Game</h1>
      <button onClick={handleClick}>Click Me</button>
      <ScoreDisplay score={state.score} />
      <UpgradeButton
        score={state.score}
        setScore={(newScore) => setState((prevState) => ({ ...prevState, score: newScore }))}
        smollTokens={state.smollTokens}
        setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
      />
      <Bank
        smollTokens={state.smollTokens}
        setSmollTokens={(newTokens) => setState((prevState) => ({ ...prevState, smollTokens: newTokens }))}
        ether={state.ether}
        setEther={(newEther) => setState((prevState) => ({ ...prevState, ether: newEther }))}
      />
      <Shop
        ether={state.ether}
        setEther={(newEther) => setState((prevState) => ({ ...prevState, ether: newEther }))}
        clickMultiplier={state.clickMultiplier}
        setClickMultiplier={(newMultiplier) => setState((prevState) => ({ ...prevState, clickMultiplier: newMultiplier }))}
        autoClicker={state.autoClicker}
        setAutoClicker={(newAutoClicker) => setState((prevState) => ({ ...prevState, autoClicker: newAutoClicker }))}
      />
    </div>
  );
};

export default ClickerGame;
