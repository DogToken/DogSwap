// components/Shop.js
import React from 'react';

const Shop = ({ items, gold, onBuy }) => {
  return (
    <div className="shop">
      <h2>Shop</h2>
      {items.map((item) => (
        <div key={item.id} className="item">
          <p>
            {item.name} - Cost: {item.cost} Gold
            <button onClick={() => onBuy(item.id)} disabled={gold < item.cost}>
              Buy
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Shop;
