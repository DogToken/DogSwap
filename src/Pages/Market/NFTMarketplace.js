import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Provider from "../../utils/network";
import { getNFTContract, getMarketplaceContract } from "../../constants/contracts";

const NFTMarketplace = () => {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    const provider = await Web3Provider();
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);

    const nftContract = getNFTContract(signer);
    setNFTContract(nftContract);
    const marketplaceContract = getMarketplaceContract(signer);
    setMarketplaceContract(marketplaceContract);

    loadNFTs();
  }

  async function loadNFTs() {
    if (!marketplaceContract) return;

    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await fetch(tokenUri).then((res) => res.json());
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );
    setNFTs(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    if (!marketplaceContract || !nftContract || !signer) return;

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await marketplaceContract
      .createMarketSale(nftContract.address, nft.tokenId, {
        value: price,
      })
      .catch((error) => {
        console.error("Error buying NFT:", error);
      });

    await transaction.wait();
    loadNFTs();
  }

  async function createNFT() {
    if (!nftContract || !signer) return;

    const transaction = await nftContract.createToken("https://my-nft-url.com");
    const tx = await transaction.wait();
    const event = tx.events[0];
    const tokenId = event.args[2];

    await listNFT(tokenId);
  }

  async function listNFT(tokenId) {
    if (!marketplaceContract || !nftContract || !signer) return;

    const price = ethers.utils.parseUnits("0.01", "ether");
    const transaction = await nftContract.approve(
      marketplaceContract.address,
      tokenId
    );
    await transaction.wait();

    const listingTransaction = await marketplaceContract.createToken(
      nftContract.address,
      tokenId,
      price,
      {
        value: ethers.utils.parseUnits("0.025", "ether"),
      }
    );
    await listingTransaction.wait();

    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={createNFT}
          >
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTMarketplace;