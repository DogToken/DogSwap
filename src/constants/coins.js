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
    abbr: "DOGSWP",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
    logoURI: "/images/coins/DOGSWAP-icon.png",
  },
  {
    name: "Bone",
    abbr: "BONE",
    address: "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF",
    logoURI: "/images/coins/DOGSWAP-icon.png",
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
  {
    name: "Zarali",
    abbr: "ZAR",
    address: "0xa88bCa314ebe9301cBa3b4C718149b05D4AD0ea5",
  },
  {
    name: "Anukis",
    abbr: "ANUKS",
    address: "0xfcC19E279D0240cFdaBdEEB6885f6829FCCfa501",
  },
  {
    name: "Shells",
    abbr: "SHELLS",
    address: "0xaa153ce997e1363cb31231e644c4266d9c954630",
  },
  {
    name: "Prunity",
    abbr: "PRNTY",
    address: "0x78CF733E6e113BA393b3bd17E4738E4dd63366fb",
  },
  {
    name: "TREE",
    abbr: "TREE",
    address: "0x69a3eDdB6bE2d56E668E7DfF68DB1303e675A0F0",
    logoURI: "/images/coins/Tree-icon.png",
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
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
