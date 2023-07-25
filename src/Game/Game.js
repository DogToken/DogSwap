// Game.js
import React, { useState, useEffect } from 'react';
import Miner from './Miner';
import Shop from './Shop';
import { minersData } from './minersData';
import { itemsData } from './itemsData';
import './Game.css';

const Game = () => {
  const [hashes, setHashes] = useState(0);
  const [hashesPerClick, setHashesPerClick] = useState(1);
  const [miners, setMiners] = useState(minersData);
  const [items, setItems] = useState(itemsData);

  const handleHashButtonClick = () => {
    setHashes((prevHashes) => prevHashes + hashesPerClick);
  };

  const hireMiner = (minerId) => {
    const updatedMiners = miners.map((miner) =>
      miner.id === minerId ? { ...miner, level: miner.level + 1 } : miner
    );
    setMiners(updatedMiners);
  };

  const buyItem = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    setHashes((prevHashes) => prevHashes - item.cost);
    setHashesPerClick((prevHashesPerClick) => prevHashesPerClick + item.hashesPerClickBoost);
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHashes((prevHashes) =>
        prevHashes +
        miners.reduce((totalHashes, miner) => totalHashes + miner.level * miner.hashesPerSec, 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [miners]);

  return (
    <div>
      <h1>Incremental Mining Game</h1>
      <p>Hashes: {hashes}</p>
      <p>Hashes per Click: {hashesPerClick}</p>
      <button onClick={handleHashButtonClick}>Click to Mine Hashes</button>

      <div className="miners-container">
        <h2>Miners</h2>
        {miners.map((miner) => (
          <Miner key={miner.id} miner={miner} hashes={hashes} onHire={hireMiner} />
        ))}
      </div>

      <Shop items={items} hashes={hashes} onBuy={buyItem} />
    </div>
  );
};

export default Game;
