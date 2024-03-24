import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './NavBar.css';
import { ethers } from 'ethers';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import boneTokenABI from "./abis/BoneToken.json";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boneBalance, setBoneBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const boneContract = new ethers.Contract(
        // Replace with your $BONE token contract address
        '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', 
        // Replace with your $BONE token ABI
        boneTokenABI,
        signer
      );
      const balance = await boneContract.balanceOf(address);
      setBoneBalance(ethers.utils.formatEther(balance));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setBoneBalance(0);
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <span role="img" aria-label="dog">
              🐶
            </span>{' '}
            DogSwap
          </Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
          {MenuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link className="nav-link" to={item.url}>
                {item.title}
              </Link>
            </li>
          ))}
          <li className="nav-item">
            {isConnected ? (
              <div className="connected-wallet">
                <FaUserCircle />
                <span className="bone-balance">{boneBalance} $BONE</span>
                <button className="disconnect-button" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button className="connect-button" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;