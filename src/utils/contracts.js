import { ethers } from "ethers";
import NFTContractABI from "../build/NFTContract.json";
import MarketplaceContractABI from "../build/MarketplaceContract.json";
import { nftContractAddress, marketplaceContractAddress } from "../constants/data";

const getNFTContract = (signer) => {
  try {
    const nftContract = new ethers.Contract(
      nftContractAddress,
      NFTContractABI.abi,
      signer
    );
    return nftContract;
  } catch (error) {
    console.error("Error creating NFT contract instance:", error);
  }
};

const getMarketplaceContract = (signer) => {
  try {
    const marketplaceContract = new ethers.Contract(
      marketplaceContractAddress,
      MarketplaceContractABI.abi,
      signer
    );
    return marketplaceContract;
  } catch (error) {
    console.error("Error creating Marketplace contract instance:", error);
  }
};

export { getNFTContract, getMarketplaceContract };