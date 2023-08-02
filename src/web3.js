import { ethers } from "ethers";
import TokenABI from "../build/dogToken.abi.json";
import StakingAbi from "../build/stakingVault.abi.json";

function getWeb3Provider() {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
}

export const provider = getWeb3Provider();

export function getContracts(TOKEN_ADDRESS, STAKING_ADDRESS) {
    const TOKEN = new ethers.Contract(TOKEN_ADDRESS, TokenABI);
    const STAKING_CONTRACT = new ethers.Contract(STAKING_ADDRESS, StakingAbi);
  
    return { TOKEN, STAKING_CONTRACT };
  }