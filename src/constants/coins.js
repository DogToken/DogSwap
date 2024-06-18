import * as chains from './chains';

// If you add coins for a new network, make sure Weth address (for the router you are using) is the first entry

const MINTMECoins = [
  {
    name: "MintMe",
    abbr: "MINTME",
    address: "", 
    logoUrl: "https://dogswap.xyz/images/coins/mintme.png",
  },
  {
    name: "DogSwap",
    abbr: "DOGSWP",
    address: "0x1628160C66e0330090248a163A34Ba5B5A82D4f7",
    logoUrl: "https://dogswap.xyz/images/coins/dogswap.png",
  },
  {
    name: "Bone",
    abbr: "BONE",
    address: "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF",
    logoUrl: "https://dogswap.xyz/images/coins/bone.png",
  },
  // {
  //   name: "Bridged Bone",
  //   abbr: "bBONE",
  //   address: "0x46700A70314623D4F17561c237252Ff0F6bEe656",
  //   logoUrl: "https://dogswap.xyz/images/coins/bone.png",
  // },
  {
    name: "1000x",
    abbr: "1000X",
    address: "0x7b535379bBAfD9cD12b35D91aDdAbF617Df902B2",
    logoUrl: "https://dogswap.xyz/images/coins/1000x.png",
  },
  {
    name: "Peppermint",
    abbr: "PMINT",
    address: "0xe67f14Fa595947bd63546866a1FCCf27E2D58203",
    logoUrl: "https://dogswap.xyz/images/coins/peppermint.png",
  },
  {
    name: "MintMeBull",
    abbr: "MMBUL",
    address: "0xd5c9BFF69210129764DEFEc86bD7e239dD2cE844",
    logoUrl: "https://dogswap.xyz/images/coins/mintmebull.png",
  },
  {
    name: "Dance And Music",
    abbr: "Dance And Music",
    address: "0x381911b21E0Cd8C3F4A57B332adCcfC0a64E26c5",
    logoUrl: "https://www.mintme.com/media/cache/avatar_large/uploads/images/4e771a96-d83b-11ec-bec9-ac162db679ce.png",
  },
  {
    name: "Shells",
    abbr: "SHELLS",
    address: "0xaa153ce997e1363cb31231e644c4266d9c954630",
    logoUrl: "https://dogswap.xyz/images/coins/shells.jpeg",
  },
  {
    name: "Anukis",
    abbr: "ANUKS",
    address: "0xfcC19E279D0240cFdaBdEEB6885f6829FCCfa501",
    logoUrl: "https://dogswap.xyz/images/coins/anukis.png",
  },
  {
    name: "Prunity",
    abbr: "PRNTY",
    address: "0x78CF733E6e113BA393b3bd17E4738E4dd63366fb",
    logoUrl: "https://dogswap.xyz/images/coins/prunity.png",
  },
  {
    name: "TREE",
    abbr: "TREE",
    address: "0x69a3eDdB6bE2d56E668E7DfF68DB1303e675A0F0",
    logoUrl: "https://dogswap.xyz/images/coins/tree.jpeg",
  },
  {
    name: "Xatter",
    abbr: "XTR",
    address: "0xB580f1dbA1c17882Fca8f6DDadA8428c9cB177fC",
    logoUrl: "https://dogswap.xyz/images/coins/xatter.jpeg",
  },
  {
    name: "BitMonky",
    abbr: "BITM",
    address: "0x3Eb5Ea03039450621500a7481525494c33d2aa0A",
    logoUrl: "https://dogswap.xyz/images/coins/bitmonky.png",
  },
  {
    name: "MineMintToken",
    abbr: "MMT",
    address: "0xA27c1AbD15bfFAAde6c2e873C10fc7a2beb72d69",
    logoUrl: "https://dogswap.xyz/images/coins/mineminttoken.png",
  },
  {
    name: "MintMoXMR",
    abbr: "MMXMR",
    address: "0x3AD09254A2406B6CDf2b184479EaC284E99A72D3",
    logoUrl: "https://dogswap.xyz/images/coins/mintmoxmr.png",
  },
  {
    name: "SMILE",
    abbr: "SMILE",
    address: "0xe5a65FE59B03301C2409c6C5aDe432F44fa1eD0c",
    logoUrl: "https://dogswap.xyz/images/coins/smile.png",
  },
  {
    name: "VEXE",
    abbr: "VXE",
    address: "0x54DAa721aaF6938cdc3c6c455A9C5400e9A9462e",
    logoUrl: "https://dogswap.xyz/images/coins/vexe.png",
  },
  {
    name: "Zenny",
    abbr: "ZENNY",
    address: "0xe7D8B46047d55902982CeD9D37eE85A63B991a1a",
    logoUrl: "https://dogswap.xyz/images/coins/zenny.jpeg",
  },
  {
    name: "10K Litoshi",
    abbr: "10KL",
    address: "0x02d0E745f6A5BCC5216E63E12249e08514CcFfE4",
    logoUrl: "https://dogswap.xyz/images/coins/10klitoshi.png",
  },
  {
    name: "MLM",
    abbr: "MLM",
    address: "0xAf0589ce275Bff00a6C71E70Cc4187B7B6894306",
    logoUrl: "https://dogswap.xyz/images/coins/mlm.jpeg",
  },
]

const COINS = new Map();
COINS.set(chains.ChainId.MINTME, MINTMECoins);
export default COINS
