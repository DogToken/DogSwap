import { ethers } from "ethers";
import TokenABI from "./build/dogToken.abi.json";
import StakingAbi from "./build/stakingVault.abi.json";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const TOKEN_ADDRESS = "0x38924b27e5A43A6D9AD1377eC828C056120f06a0"; // Replace with the actual token address
const STAKING_ADDRESS = "0x38D613a0636Bd10043405D76e52f7540eeE913d0"; // Replace with the actual staking address

export function initializeContracts() {
  const { library } = useWeb3React();

  if (!library) {
    throw new Error("Web3 provider not found. Make sure to connect your wallet.");
  }

  const provider = new Web3Provider(library);
  const signer = provider.getSigner();
  const TOKEN = new ethers.Contract(TOKEN_ADDRESS, TokenABI, signer);
  const STAKING_CONTRACT = new ethers.Contract(STAKING_ADDRESS, StakingAbi, signer);

  return {
    TOKEN,
    STAKING_CONTRACT,
  };
}
