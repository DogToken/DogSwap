// StakingPool.jsx
import React, { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../../utils/ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faHandHoldingUsd, faClock } from '@fortawesome/free-solid-svg-icons';
import boneTokenABI from '../../build/BoneToken.json';
import masterChefABI from '../../build/MasterChef.json';

  const StakingPool = ({
    title,
    subTitle,
    BONE_TOKEN_ADDRESS,
    MASTER_CHEF_ADDRESS,
    poolId,
    lpTokenAddress,
  }) => {
    const [loading, setLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState('');
    const [stakingAmount, setStakingAmount] = useState('');
    const [totalLpTokens, setTotalLpTokens] = useState('0');
    const [walletBalance, setWalletBalance] = useState('0');
    const [stakedLpTokens, setStakedLpTokens] = useState('0');
    const [pendingBone, setPendingBone] = useState('0');
  
    useEffect(() => {
      // Fetch and set balances
      fetchBalances();
    }, []);
  
    const fetchBalances = async () => {
      try {
        const provider = getProvider();
        const signer = getSigner(provider);
        const networkId = await getNetwork(provider);
        const lpTokenContract = getLpTokenInstance(networkId, signer, lpTokenAddress);
        const masterChefContract = getMasterChefInstance(networkId, signer);
  
      // Fetch the balance of the user's wallet
        const walletBalance = await lpTokenContract.balanceOf(signer.getAddress());
        const formattedWalletBalance = ethers.formatUnits(walletBalance, 18); // Assuming 18 decimals for the token
        setWalletBalance(parseFloat(formattedWalletBalance).toFixed(5));

        // Fetch the total LP token supply
        const totalSupply = await lpTokenContract.totalSupply();
        const formattedTotalSupply = ethers.formatUnits(totalSupply, 18);
        setTotalLpTokens(parseFloat(formattedTotalSupply).toFixed(5));
  
        // Fetch staked LP tokens
        const userInfo = await masterChefContract.userInfo(poolId, signer.getAddress());
        const formattedStakedAmount = ethers.formatUnits(userInfo.amount, 18);
        setStakedLpTokens(parseFloat(formattedStakedAmount).toFixed(5));
  
        // Fetch pending rewards
        const pendingRewards = await masterChefContract.pendingBone(poolId, signer.getAddress());
        const formattedPendingRewards = ethers.formatUnits(pendingRewards, 18);
        setPendingBone(parseFloat(formattedPendingRewards).toFixed(5));
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };  

    const handleStakeTokens = async () => {
        try {
          setLoading(true);
      
          // Parse staking amount
          const amountToStake = ethers.parseUnits(stakingAmount, 18);
      
          // Ensure the amount to stake is greater than zero
          if (amountToStake.lte(0)) {
            throw new Error('Please enter a valid amount to stake.');
          }
      
          // Get the network ID
          const provider = getProvider();
          const networkId = await getNetwork(provider);
          const signer = getSigner(provider);
      
          // Get LP token instance
          const lpTokenContract = getLpTokenInstance(networkId, signer, lpTokenAddress);
      
          // Approve spending LP tokens
          const approveTx = await lpTokenContract.approve(MASTER_CHEF_ADDRESS, amountToStake);
          await approveTx.wait();
      
          // Deposit LP tokens
          const masterChefContract = getMasterChefInstance(networkId, signer);
          const transaction = await masterChefContract.deposit(poolId, amountToStake, { value: 0 });
          await transaction.wait();
      
          setClaimMessage('Tokens staked successfully!');
      
          // Refresh balances after staking
          fetchBalances();
        } catch (error) {
          console.error('Error staking tokens:', error);
          setClaimMessage('Failed to stake tokens. Please try again later.');
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
        throw new Error('Please enter a valid amount to withdraw.');
      }

      // Get the network ID
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      // Withdraw tokens
      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.withdraw(poolId, amountToWithdraw);
      await transaction.wait();

      setClaimMessage('Tokens withdrawn successfully!');

      // Refresh balances after withdrawal
      fetchBalances();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setClaimMessage('Failed to withdraw tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getLpTokenInstance = (networkId, signer, lpTokenAddress) => {
    return new Contract(lpTokenAddress, boneTokenABI, signer);
  };

  const getBoneTokenInstance = (networkId, signer) => {
    return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
  };

  const getMasterChefInstance = (networkId, signer) => {
    return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
  };

  return (
    <div>
      <h5>
        {title}
      </h5>
      <p>
        {subTitle}
      </p>
      <div>
        <div>
          <FontAwesomeIcon icon={faCoins} size="1x" />
          <p>My Balance: {walletBalance}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faHandHoldingUsd} size="1x" />
          <p>Staked: {stakedLpTokens}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faClock} size="1x" />
          <p>Pending $BONE: {pendingBone}</p>
        </div>
      </div>
      <div>
        <input
          label="Amount to Deposit/Withdraw"
          variant="outlined"
          fullWidth
          margin="normal"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
        />
        <div>
          <button
            variant="contained"
            color="primary"
            onClick={handleStakeTokens}
            disabled={loading}
          >
            {loading ? <div size={24} color="inherit" /> : "Deposit"}
          </button>
          <button
            variant="contained"
            color="secondary"
            onClick={handleWithdrawTokens}
            disabled={loading}
          >
            {loading ? <div size={24} color="inherit" /> : "Withdraw"}
          </button>
        </div>
      </div>
      {claimMessage && (
        <p>
          {claimMessage}
        </p>
      )}
    </div>
  );
};

export default StakingPool;