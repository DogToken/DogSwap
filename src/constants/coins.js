import * as chains from './chains';

// If you add coins for a new network, make sure Weth address (for the router you are using) is the first entry

const MINTMECoins = [
  {
    name: "MintMe",
    abbr: "MINTME",
    address: "", // Weth address is fetched from the router
    logoURI: "/images/coins/MINTME-icon.png",
  },
  {
    name: "DogSwap",
    abbr: "DOGSWAP",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
    logoURI: "/images/coins/DOGSWAP-icon.png",
  },
  {
    name: "BNB",
    abbr: "BNB",
    address: "0x89456efa718884f48b51f4790557b4981ffc0aa2",
    logoURI: "/images/coins/BNB-icon.png",
  },
  {
    name: "Cronos",
    abbr: "CRO",
    address: "0xdfe3a98aa33c3393792e5e53e222f82f0b6482c0",
    logoURI: "/images/coins/CRO-icon.png",
  },
  {
    name: "Ethereum",
    abbr: "ETH",
    address: "0x818938a83036b18a44f2ddf43d47454f6ae49bd6",
    logoURI: "/images/coins/ETH-icon.png",
  },
  {
    name: "USD Coin",
    abbr: "USDC",
    address: "0xdcb579aa78e35e34581c72c291d493105949ac27",
    logoURI: "/images/coins/USDC-icon.png",
  },
  {
    name: "Tether USD",
    abbr: "USDT",
    address: "0xaae3f40c4d02c9cfa7d5cb6f371226b3fa9c8fc8",
    logoURI: "/images/coins/USDT-icon.png",
  },
  {
    name: "Wrapped BTC",
    abbr: "WBTC",
    address: "0x67f44cb704884e0eb53c48fec8f1b1e7f8a63729",
    logoURI: "/images/coins/WBTC-icon.png",
  },
  {
    name: "Peppermint",
    abbr: "PMINT",
    address: "0xe67f14Fa595947bd63546866a1FCCf27E2D58203",
    logoURI: "/images/coins/PMINT-icon.png",
  },
  {
    name: "1000x",
    abbr: "1000X",
    address: "0x7b535379bBAfD9cD12b35D91aDdAbF617Df902B2",
    logoURI: "/images/coins/1000X-icon.png",
  },
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
