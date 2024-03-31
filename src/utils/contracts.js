import { ethers } from "ethers";
import NFTContract from "../build/NFTContract.json";
import MarketplaceContract from "../build/MarketplaceContract.json";
import { nftContractAddress, marketplaceContractAddress } from "../constants/data";

const getNFTContract = (signer) => {
  const nftContract = new ethers.Contract(
    nftContractAddress,
    NFTContract.abi,
    signer
  );
  return nftContract;
};

const getMarketplaceContract = (signer) => {
  const marketplaceContract = new ethers.Contract(
    marketplaceContractAddress,
    MarketplaceContract.abi,
    signer
  );
  return marketplaceContract;
};

export { getNFTContract, getMarketplaceContract };