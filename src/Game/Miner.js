// Miner.js
import React from 'react';

const Miner = ({ miner, hashes, onHire }) => {
  return (
    <div className="miner">
      <p>
        {miner.name} - Level {miner.level}
        <button onClick={() => onHire(miner.id)} disabled={hashes < miner.cost}>
          Hire ({miner.cost} Hashes)
        </button>
      </p>
    </div>
  );
};

export default Miner;
