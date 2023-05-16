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
    abbr: "DOGSWAP",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
  },
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
