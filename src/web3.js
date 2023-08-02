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

export const TOKEN_ADDRESS = import.meta.env.TOKEN_ADDRESS;
export const TOKEN = new ethers.Contract(
    TOKEN_ADDRESS,
    TokenABI
);

export const STAKING_ADDRESS = import.meta.env.STAKING_ADDRESS;
export const STAKING_CONTRACT = new ethers.Contract(
    STAKING_ADDRESS,
    StakingAbi
);