// Web3Provider.js
import React from "react";
import useWeb3Provider from "../hooks/useWeb3Provider";
import ConnectWalletPage from "../components/connectWalletPage";

const Web3Provider = (props) => {
  const { isConnected, network } = useWeb3Provider();

  return (
    <>
      {!isConnected && <ConnectWalletPage />}
      {isConnected && props.render(network)}
    </>
  );
};

export default Web3Provider;