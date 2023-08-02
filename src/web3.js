import { ethers } from "ethers";
import TokenABI from "./build/dogToken.abi.json";
import StakingAbi from "./build/stakingVault.abi.json";

const TOKEN_ADDRESS = "0x38924b27e5A43A6D9AD1377eC828C056120f06a0"; // Replace with the actual token address
const STAKING_ADDRESS = "0x38D613a0636Bd10043405D76e52f7540eeE913d0"; // Replace with the actual staking address

export async function initializeContracts() {
  try {
    if (window.ethereum) {
      await window.ethereum.enable();
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const TOKEN = new ethers.Contract(TOKEN_ADDRESS, TokenABI, signer);
    const STAKING_CONTRACT = new ethers.Contract(STAKING_ADDRESS, StakingAbi, signer);

    return {
      TOKEN,
      STAKING_CONTRACT,
    };
  } catch (error) {
    console.error("Error initializing contracts:", error);
    throw error;
  }
}
