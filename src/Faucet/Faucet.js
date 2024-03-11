import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../ethereumFunctions";
import boneABI from "./abis/bone.json"; // Import the ABI for $BONE token
import faucetABI from "./abis/faucet.json"; // Import the ABI for the faucet contract

// Replace these with the actual addresses of your contracts
const BONE_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF"; // $BONE token address
const FAUCET_ADDRESS = "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250"; // Faucet contract address

// Function to get the faucet contract instance
const getFaucetContractInstance = (networkId, signer) => {
  return new Contract(FAUCET_ADDRESS, faucetABI, signer);
};

// Function to claim tokens from the faucet
const claimTokensFromFaucet = async () => {
  try {
    const provider = getProvider();
    const signer = getSigner(provider);
    const networkId = await getNetwork(provider);

    const faucetContract = getFaucetContractInstance(networkId, signer);
    const transaction = await faucetContract.claimTokens();

    // Wait for the transaction to be mined
    await transaction.wait();

    return { success: true, message: "Tokens claimed successfully!" };
  } catch (error) {
    console.error("Error claiming tokens:", error);
    return { success: false, message: "Failed to claim tokens. Please try again later." };
  }
};

export { claimTokensFromFaucet, BONE_ADDRESS, boneABI };
