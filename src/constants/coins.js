import * as chains from './chains';

// If you add coins for a new network, make sure Weth address (for the router you are using) is the first entry

const MINTMECoins = [
  {
    name: "MintMe",
    abbr: "MINTME",
    address: "", // Weth address is fetched from the router
  },
  {
    name: "DogSwap",
    abbr: "DOGSWP",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
  },
  {
    name: "Bone",
    abbr: "BONE",
    address: "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF",
  },
  {
    name: "Peppermint",
    abbr: "PMINT",
    address: "0xe67f14Fa595947bd63546866a1FCCf27E2D58203",
  },
  {
    name: "1000x",
    abbr: "1000X",
    address: "0x7b535379bBAfD9cD12b35D91aDdAbF617Df902B2",
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
  },
  {
    name: "Xatter",
    abbr: "XTR",
    address: "0xB580f1dbA1c17882Fca8f6DDadA8428c9cB177fC",
  },
  {
    name: "BitMonky",
    abbr: "BITM",
    address: "0x3Eb5Ea03039450621500a7481525494c33d2aa0A",
  },
  {
    name: "MineMintToken",
    abbr: "MMT",
    address: "0xA27c1AbD15bfFAAde6c2e873C10fc7a2beb72d69",
  },
  {
    name: "MintMeBull",
    abbr: "MMBUL",
    address: "0xd5c9BFF69210129764DEFEc86bD7e239dD2cE844",
  },
  {
    name: "MintMoXMR",
    abbr: "MMXMR",
    address: "0x3AD09254A2406B6CDf2b184479EaC284E99A72D3",
  },
  {
    name: "SMILE",
    abbr: "SMILE",
    address: "0xe5a65FE59B03301C2409c6C5aDe432F44fa1eD0c",
  },
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
