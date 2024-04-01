import { ethers } from "ethers";
import NFTContract from "../build/NFTContract.json";
import MarketplaceContract from "../build/MarketplaceContract.json";
import { nftContractAddress, marketplaceContractAddress } from "../constants/data";

const getNFTContract = (signer) => {
  try {
    const nftContract = new ethers.Contract(
      nftContractAddress,
      NFTContract.abi,
      signer
    );
    return nftContract;
  } catch (error) {
    console.error("Error creating NFT contract instance:", error);
    throw error;
  }
};

const getMarketplaceContract = (signer) => {
  try {
    const marketplaceContract = new ethers.Contract(
      marketplaceContractAddress,
      MarketplaceContract.abi,
      signer
    );
    return marketplaceContract;
  } catch (error) {
    console.error("Error creating Marketplace contract instance:", error);
    throw error;
  }
};

export { getNFTContract, getMarketplaceContract };