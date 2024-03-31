import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import './NavBar.css';
import { ethers } from 'ethers';
import { FaUserCircle, FaBars, FaTimes, FaCaretDown } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import boneTokenABI from "./abis/BoneToken.json";
import pairABI from "../build/IUniswapV2Pair.json";
import axios from 'axios';

const POOLS = [
  { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
  { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
  { id: 3, name: "WMINT-DOGSP", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
  { id: 5, name: "$BONE-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
];

const BONE_TOKEN_DECIMALS = 18;

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boneBalance, setBoneBalance] = useState(0);
  const [mintmeBalance, setMintmeBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const [bonePriceInUSD, setBonePriceInUSD] = useState(0);
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

      // Calculate $BONE price in USD
      const bonePriceInMintMe = await getBonePriceInMintMe(boneContract, provider);
      const mintmePriceInUSD = await getMintmePriceInUSD();
      const bonePriceInUSDTemp = bonePriceInMintMe * mintmePriceInUSD;
      setBonePriceInUSD(bonePriceInUSDTemp.toFixed(4));

      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setBoneBalance(0);
    setMintmeBalance(0);
    setBonePriceInUSD(0);
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

    const checkWalletConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();

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

  const getBonePriceInMintMe = async (boneContract, provider) => {
    const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
    const boneReserves = await new ethers.Contract(bonePool.address, pairABI.abi, provider).getReserves();
    const boneReserve0 = boneReserves[0] / 10 ** BONE_TOKEN_DECIMALS;
    const boneReserve1 = boneReserves[1] / 10 ** 18;
    const boneInWMINT = boneReserve1 / boneReserve0;
    const bonePriceInMintMe = 1 / boneInWMINT;
    return bonePriceInMintMe.toFixed(8);
  };

  const getMintmePriceInUSD = async () => {
    const coinId = 'webchain';
    try {
      const mintmePriceResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const mintmePriceData = mintmePriceResponse.data[coinId]?.usd;
      if (mintmePriceData !== undefined) {
        return mintmePriceData;
      } else {
        throw new Error(`${coinId} price data is unavailable`);
      }
    } catch (error) {
      console.error('Error fetching MintMe price:', error);
      return 0;
    }
  };

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
                <button
                  className="wallet-button"
                  onClick={() => setShowBalances((prevState) => !prevState)}
                >
                  1 🦴 = ${bonePriceInUSD} USD <FaCaretDown />
                </button>
                {showBalances && (
                  <div className="balances-dropdown">
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