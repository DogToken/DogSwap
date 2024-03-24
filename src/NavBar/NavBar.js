import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './NavBar.css';
import { ethers } from 'ethers';
import { FaUserCircle, FaBars, FaTimes, FaCaretDown } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import boneTokenABI from "./abis/BoneToken.json";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boneBalance, setBoneBalance] = useState(0);
  const [mintmeBalance, setMintmeBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const balancesDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // $BONE token contract
      const boneContract = new ethers.Contract(
        // Replace with your $BONE token contract address
        '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF',
        boneTokenABI,
        signer
      );
      const boneBalance = await boneContract.balanceOf(address);
      setBoneBalance(ethers.utils.formatUnits(boneBalance, 4));

      // Native token (MintMe) balance
      const mintmeBalance = await provider.getBalance(address);
      setMintmeBalance(ethers.utils.formatEther(mintmeBalance));

      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setBoneBalance(0);
    setMintmeBalance(0);
    setShowBalances(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (balancesDropdownRef.current && !balancesDropdownRef.current.contains(event.target)) {
        setShowBalances(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [balancesDropdownRef]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <span role="img" aria-label="dog">
              🐶 &nbsp;
            </span>
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
              <div className="connected-wallet" ref={balancesDropdownRef}>
                <FaUserCircle />
                <button
                  className="wallet-button"
                  onClick={() => setShowBalances((prevState) => !prevState)}
                >
                  {boneBalance} $BONE <FaCaretDown />
                </button>
                {showBalances && (
                  <div className="balances-dropdown">
                    <p>
                      $BONE: {boneBalance}
                    </p>
                    <p>MintMe: {mintmeBalance}</p>
                  </div>
                )}
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