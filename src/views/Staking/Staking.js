import React, { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faHandHoldingUsd, faClock } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import boneTokenABI from "../../build/BoneToken.json"; // Import the ABI for the $BONE token contract
import masterChefABI from "../../build/MasterChef.json"; // Import the ABI for the MasterChef contract

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF"; // Update with the $BONE token contract address
const MASTER_CHEF_ADDRESS = "0x4f79af8335d41A98386f09d79D19Ab1552d0b925"; // Update with the MasterChef contract address

const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

const getMasterChefInstance = (networkId, signer) => {
  return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
};

const Staking = () => {
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [stakingAmount, setStakingAmount] = useState("");
  const [totalTokens, setTotalTokens] = useState("0");
  const [walletTokens, setWalletTokens] = useState("0");
  const [pendingBone, setPendingBone] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0"); // State variable to hold the staked amount

  useEffect(() => {
    // Fetch and set balances
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
      const boneTokenContract = getBoneTokenInstance(networkId, signer);
      const masterChefContract = getMasterChefInstance(networkId, signer);

      // Fetch the balance of the user's wallet
      const walletBalance = await boneTokenContract.balanceOf(signer.getAddress());
      const formattedWalletBalance = ethers.formatUnits(walletBalance, 18); // Assuming 18 decimals for the token
      setWalletTokens(parseFloat(formattedWalletBalance).toFixed(5));

      // Fetch total token supply
      const totalSupply = await boneTokenContract.totalSupply();
      const formattedTotalSupply = ethers.formatUnits(totalSupply, 18); // Assuming 18 decimals for the token
      setTotalTokens(parseFloat(formattedTotalSupply).toFixed(5));

      // Fetch pending rewards
      const pendingRewards = await masterChefContract.pendingBone(3, signer.getAddress()); // Assuming pool id is 0
      const formattedPendingRewards = ethers.formatUnits(pendingRewards, 18); // Assuming 18 decimals for the token
      setPendingBone(parseFloat(formattedPendingRewards).toFixed(5));

      // Fetch staked amount
      const userInfo = await masterChefContract.userInfo(3, signer.getAddress()); // Assuming pool id is 0
      const formattedStakedAmount = ethers.formatUnits(userInfo.amount, 18); // Assuming 18 decimals for the token
      setStakedAmount(parseFloat(formattedStakedAmount).toFixed(5));
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      setLoading(true);

      // Parse staking amount
      const amountToStake = ethers.parseUnits(stakingAmount, 18);

      // Ensure the amount to stake is greater than zero
      if (amountToStake.lte(0)) {
        throw new Error("Please enter a valid amount to stake.");
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Get Bone token instance
      const boneTokenContract = getBoneTokenInstance(networkId, signer);

      // Approve spending tokens
      const approveTx = await boneTokenContract.approve(MASTER_CHEF_ADDRESS, amountToStake);
      await approveTx.wait();

      // Deposit tokens
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.deposit(3, amountToStake, { value: 0 });
      await transaction.wait();

      setClaimMessage("Tokens staked successfully!");

      // Refresh balances after staking
      fetchBalances();
    } catch (error) {
      console.error("Error staking tokens:", error);
      setClaimMessage("Failed to stake tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      setLoading(true);

      // Parse withdrawal amount
      const amountToWithdraw = ethers.parseUnits(stakingAmount, 18);

      // Ensure the amount to withdraw is greater than zero
      if (amountToWithdraw.lte(0)) {
        throw new Error("Please enter a valid amount to withdraw.");
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Withdraw tokens
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.withdraw(3, amountToWithdraw);
      await transaction.wait();

      setClaimMessage("Tokens withdrawn successfully!");

      // Refresh balances after withdrawal
      fetchBalances();
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      setClaimMessage("Failed to withdraw tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>
        💰 Staking $BONE
      </h4>
      <p>
        Stake your $BONE tokens to earn rewards and support the DogSwap ecosystem. Carefull, there is a 10% deposit fee.
      </p>
      <div div spacing={2} justify="center">
        <div item xs={12} sm={6} md={3}>
          <div>
            <div>
              <FontAwesomeIcon icon={faCoins} size="2x" />
              <h6>Total $BONE: {totalTokens}</h6>
            </div>
          </div>
        </div>
        <div item xs={12} sm={6} md={3}>
          <div>
            <div>
              <FontAwesomeIcon icon={faWallet} size="2x" />
              <h6>Your $BONE: {walletTokens}</h6>
            </div>
          </div>
        </div>
        <div item xs={12} sm={6} md={3}>
          <div>
            <div>
              <FontAwesomeIcon icon={faHandHoldingUsd} size="2x" />
              <h6>Staked $BONE: {stakedAmount}</h6>
            </div>
          </div>
        </div>
        <div item xs={12} sm={6} md={3}>
          <div>
            <div>
              <FontAwesomeIcon icon={faClock} size="2x" />
              <h6>Pending $BONE: {pendingBone}</h6>
            </div>
          </div>
        </div>
      </div>
      <input
        label="Amount to Stake/Withdraw"
        variant="outlined"
        fullWidth
        margin="normal"
        value={stakingAmount}
        onChange={(e) => setStakingAmount(e.target.value)}
      />
      <button
        variant="contained"
        color="primary"
        onClick={handleStakeTokens}
        disabled={loading}
      >
        {loading ? <div size={24} color="inherit" /> : "Stake $BONE 💰"}
      </button>
      <button
        variant="contained"
        color="secondary"
        onClick={handleWithdrawTokens}
        disabled={loading}
      >
        {loading ? <div size={24} color="inherit" /> : "Withdraw $BONE 💰"}
      </button>
      {claimMessage && (
        <p>
          {claimMessage}
        </p>
      )}
    </div>
  );
};

export default Staking;
