import { ethers } from "ethers";
import NFTContract from "../build/NFTContract.json";
import MarketplaceContract from "../build/MarketplaceContract.json";

const getNFTContract = (signer) => {
  const nftContract = new ethers.Contract(
    NFTContract.address,
    NFTContract.abi,
    signer
  );
  return nftContract;
};

const getMarketplaceContract = (signer) => {
  const marketplaceContract = new ethers.Contract(
    MarketplaceContract.address,
    MarketplaceContract.abi,
    signer
  );
  return marketplaceContract;
};

export { getNFTContract, getMarketplaceContract };