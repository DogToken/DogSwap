import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './NavBar.css';
import { ethers } from 'ethers';

const NavBar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const connectWithMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setIsConnected(true);
      setWalletAddress(address);
    } catch (error) {
      console.error('Error connecting with MetaMask:', error);
    }
  };

  const disconnectMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(false);
      setWalletAddress('');
    } catch (error) {
      console.error('Error disconnecting MetaMask:', error);
    }
  };

  return (
    <nav>
      <div className="Title">
        <h1 className="navbar-logo">
          <span role="img" aria-label="dog">
            🐶
          </span>{' '}
          DogSwap
        </h1>
      </div>

      <div className="NavbarItems">
        <ul className={`nav-menu`}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={'nav-links'} to={item.url}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        {!isConnected && (
          <button className="connect-button" onClick={connectWithMetaMask}>
            Connect with MetaMask
          </button>
        )}
        {isConnected && (
          <div className="wallet-info">
            <span onClick={disconnectMetaMask} className="disconnect-button">{walletAddress}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
