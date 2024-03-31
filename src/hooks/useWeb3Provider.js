// useWeb3Provider.js
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { getAccount, getRouter, getNetwork, getWeth, getFactory } from "../ethereumFunctions";
import COINS from "../constants/coins";
import * as chains from "../constants/chains";

const useWeb3Provider = () => {
  const [isConnected, setIsConnected] = useState(false);
  const network = useRef({
    provider: null,
    signer: null,
    account: null,
    coins: [],
    chainID: null,
    router: null,
    factory: null,
    weth: null,
  });

  const setupConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await getAccount();
      const chainId = await getNetwork(provider);

      if (chains.networks.includes(chainId)) {
        const router = await getRouter(chains.routerAddress.get(chainId), signer);
        const coins = COINS.get(chainId);
        const wethAddress = await router.WETH();
        const weth = getWeth(wethAddress, signer);
        coins[0].address = wethAddress;
        const factoryAddress = await router.factory();
        const factory = getFactory(factoryAddress, signer);

        network.current = {
          provider,
          signer,
          account,
          coins,
          chainID: chainId,
          router,
          factory,
          weth,
        };

        setIsConnected(true);
      } else {
        console.log("Wrong network mate.");
        setIsConnected(false);
      }
    } catch (e) {
      console.log(e);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    setupConnection();

    const handleAccountChange = async () => {
      const account = await getAccount();
      if (account !== network.current.account) {
        await setupConnection();
      }
    };

    const handleNetworkChange = async () => {
      const chainId = await getNetwork(network.current.provider);
      if (chainId !== network.current.chainID) {
        setIsConnected(false);
        await setupConnection();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountChange);
    window.ethereum.on("chainChanged", handleNetworkChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
      window.ethereum.removeListener("chainChanged", handleNetworkChange);
    };
  }, []);

  return { isConnected, network: network.current };
};

export default useWeb3Provider;