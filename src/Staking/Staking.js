import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MasterChefABI from './abis/MasterChef.json'; // Import MasterChef ABI
import BoneTokenABI from './abis/BoneToken.json'; // Import BoneToken ABI

// MasterChef contract address
const masterChefAddress = '0x4f79af8335d41A98386f09d79D19Ab1552d0b925';

const networks = [24734];

export const ChainId = {
  MINTME: 24734,
};

export const routerAddress = new Map();
routerAddress.set(ChainId.MINTME, "0x38D613a0636Bd10043405D76e52f7540eeE913d0");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100px', // Adjust the width as needed
    margin: theme.spacing(1),
  }
}));

const StakingDapp = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [stake, setStake] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [views, setViews] = useState({
    staked: 0,
    reward: 0,
    totalStaked: 0,
    currentBalance: 0, // New state for current Bone token balance
  });

  // Connect to the Ethereum network on component mount
  useEffect(() => {
    connectToEthereum();
  }, []);

  // Function to connect to the Ethereum network and set up the contract
  const connectToEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        // Check if the connected network is supported
        if (network && networks.includes(network.chainId)) {
          const signer = provider.getSigner();
          setAccount(await signer.getAddress());

          // Setup MasterChef contract
          const masterChefContract = new ethers.Contract(masterChefAddress, MasterChefABI, signer);
          // Now you can use the masterChefContract to interact with MasterChef functions
          setContract(masterChefContract); // Set the contract state
          
          // Call fetchStakingDetails only if contract is not null
          if (masterChefContract) {
            fetchStakingDetails(); // Fetch the user's staking details
            fetchBoneTokenBalance(); // Fetch the user's Bone token balance
          }
        } else {
          console.log('Unsupported network. Please switch to the correct network.');
        }
      } else {
        console.log('Please install MetaMask to use this dApp.');
      }
    } catch (error) {
      console.error('Error connecting to Ethereum:', error);
    }
  };

  // Function to fetch the user's staking details and update the views
  const fetchStakingDetails = async () => {
    try {
      if (contract) { // Check if contract is not null
        const stakingBalance = await contract.stakingBalanceOf(account);
        const stakingReward = await contract.stakingRewardOf(account);
        const totalStakedBalance = await contract.totalStakedBalance();

        setViews((prevViews) => ({
          ...prevViews,
          staked: ethers.utils.formatUnits(stakingBalance, 18),
          reward: ethers.utils.formatUnits(stakingReward, 18),
          totalStaked: ethers.utils.formatUnits(totalStakedBalance, 18),
        }));
      }
    } catch (error) {
      console.error('Error fetching staking details:', error);
    }
  };

  // Function to fetch the user's Bone token balance
  const fetchBoneTokenBalance = async () => {
    try {
      if (contract) {
        const boneTokenAddress = '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF'; // BoneToken address
        const boneTokenContract = new ethers.Contract(boneTokenAddress, BoneTokenABI, contract.signer); // Use contract signer
        const balance = await boneTokenContract.balanceOf(account);
        setViews((prevViews) => ({
          ...prevViews,
          currentBalance: ethers.utils.formatUnits(balance, 18),
        }));
      }
    } catch (error) {
      console.error('Error fetching Bone token balance:', error);
    }
  };

  // Function to handle stake submission
  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(stake.toString(), 18);
      const tokenAddress = '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF'; // BoneToken address

      // Get the token contract instance
      const tokenContract = new ethers.Contract(tokenAddress, BoneTokenABI, contract.signer);

      // Check if the user has enough balance
      const userBalance = await tokenContract.balanceOf(account);
      if (userBalance.lt(amount)) {
        console.error('Insufficient balance');
        return;
      }

      // Estimate gas for stake transaction
      const gasEstimate = await contract.estimateGas.deposit(0, amount);
      const gasLimit = gasEstimate.mul(ethers.BigNumber.from('110')).div(ethers.BigNumber.from('100')); // Add 10% buffer
      const gasPrice = await contract.provider.getGasPrice();
      const gasFee = gasPrice.mul(gasLimit);

      // Prompt user to confirm transaction
      if (!window.confirm(`Stake ${stake} BONE tokens with gas fee of ${ethers.utils.formatEther(gasFee)} ETH?`)) {
        console.log('Transaction cancelled by user.');
        return;
      }

      // First, check if the contract is approved to spend the user's tokens
      const approvedAmount = await tokenContract.allowance(account, masterChefAddress);
      if (approvedAmount.lt(amount)) {
        // If not approved, approve the contract to spend tokens
        const approveTx = await tokenContract.approve(masterChefAddress, ethers.constants.MaxUint256);
        await approveTx.wait();
      }

      // Now deposit (stake) the tokens
      const pid = 0; // Assuming you want to stake in the first pool (pool id 0)
      const poolInfo = await contract.poolInfo(pid);
      const depositFeeBP = poolInfo.depositFeeBP;

      if (depositFeeBP > 0) {
        const depositFee = amount.mul(depositFeeBP).div(10000);
        const userStakedAmount = await contract.userInfo(pid, account);
        if (userStakedAmount.amount.lt(depositFee)) {
          console.error('Deposit fee is greater than the user\'s staked amount');
          return;
        }
      }

      // Check if the lpSupply is not 0 before calling updatePool
      const lpSupply = await poolInfo.lpToken.balanceOf(masterChefAddress);
      if (lpSupply.gt(0)) {
        await contract.updatePool(pid);
      }

      const depositTx = await contract.deposit(pid, amount, { gasPrice, gasLimit });
      await depositTx.wait();
      setStake('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  // Function to handle withdraw submission
  const handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      const amount = ethers.utils.parseUnits(withdraw.toString(), 18);
      const tx = await contract.withdraw(0, amount); // Assuming pool id is 0
      await tx.wait();
      setWithdraw('');
      fetchStakingDetails();
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
    }
  };

  // Function to handle claiming reward
  const handleClaimReward = async (event) => {
    event.preventDefault();
    try {
      const tx = await contract.claim(0); // Assuming pool id is 0
      await tx.wait();
      fetchStakingDetails();
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  return (
    <div>
      <h1>Staking Dapp</h1>
      <p>Connected Account: {account}</p>
      <p>Current Bone Balance: {views.currentBalance}</p>
      <h2>Stake</h2>
      <form onSubmit={handleStake}>
        <input
          type="text"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          placeholder="Enter amount to stake"
        />
        <button type="submit">Stake</button>
      </form>
      <h2>Withdraw</h2>
      <form onSubmit={handleWithdraw}>
        <input
          type="text"
          value={withdraw}
          onChange={(e) => setWithdraw(e.target.value)}
          placeholder="Enter amount to withdraw"
        />
        <button type="submit">Withdraw</button>
      </form>
      <h2>Reward</h2>
      <button onClick={handleClaimReward}>Claim Reward</button>
      <h2>Staking Details</h2>
      <p>Staked: {views.staked}</p>
      <p>Reward: {views.reward}</p>
      <p>Total Staked: {views.totalStaked}</p>
    </div>
  );
};

export default StakingDapp;
