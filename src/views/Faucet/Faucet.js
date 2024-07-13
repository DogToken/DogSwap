import React, { useState, useEffect } from "react";
import { Contract } from "ethers";
import { getProvider, getSigner, getNetwork } from "../../utils/ethereumFunctions";
import boneABI from "../../build/BoneToken.json";
import faucetABI from "../../build/faucet.json";

const getFaucetContractInstance = (networkId, signer, faucetAddress) => {
  return new Contract(faucetAddress, faucetABI, signer);
};

const Faucet = ({ faucetAddress, title, description, claimInterval }) => {
  const [loading, setLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [countdown, setCountdown] = useState(() => {
    const storedCountdown = localStorage.getItem(`countdown_${faucetAddress}`);
    return storedCountdown ? parseInt(storedCountdown, 10) : 0;
  });

  useEffect(() => {
    const storedCountdown = localStorage.getItem(`countdown_${faucetAddress}`);
    const initialCountdown = storedCountdown ? parseInt(storedCountdown, 10) : claimInterval;
    setCountdown(initialCountdown);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = prevCountdown > 0 ? prevCountdown - 1 : 0;
        localStorage.setItem(`countdown_${faucetAddress}`, newCountdown.toString());
        return newCountdown;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [faucetAddress, claimInterval]);

  useEffect(() => {
    localStorage.setItem(`countdown_${faucetAddress}`, countdown.toString());
  }, [countdown, faucetAddress]);

  const handleClaimTokens = async () => {
    setLoading(true);
    const result = await claimTokensFromFaucet();
    setLoading(false);
    setClaimMessage(result.message);
    setCountdown(claimInterval);
  };

  const claimTokensFromFaucet = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);

      const faucetContract = getFaucetContractInstance(networkId, signer, faucetAddress);

      const gasLimit = 300000; // Adjust this value as needed

      const transaction = await faucetContract.requestTokens({ gasLimit });

      await transaction.wait();

      return { success: true, message: "Tokens claimed successfully!" };
    } catch (error) {
      console.error("Error claiming tokens:", error);
      return { success: false, message: "Failed to claim tokens. Please try again later." };
    }
  };

  const renderTimer = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return (
      <div>
        Next claim available in: {`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
      </div>
    );
  };

  return (
    <div>
      <div>
        <h6>
          {title}
        </h6>
        <div>
          {description}
        </div>
        <div>
          {countdown === 0 && (
            <button
              variant="contained"
              onClick={handleClaimTokens}
              disabled={loading}
            >
              {loading ? <div size={24} color="inherit" /> : "Claim!"}
            </button>
          )}
          {countdown > 0 && renderTimer()}
        </div>
        {claimMessage && (
          <div>
            {claimMessage}
          </div>
        )}
      </div>
    </div>
  );
};

const FaucetPage = () => {
  const faucets = [
    { id: 1, address: "0x99f1dad7e8bea4eb9e0829361d5322b63ff9c250", title: "The $BONE Faucet", description: "Claim 0.1 $BONE every 30 minutes. Stake, trade or hodl your tokens to support the DogSwap ecosystem", claimInterval: 1800 },
  ];

  return (
    <div>
      <div container spacing={4} justify="center">
        {faucets.map((faucet) => (
          <div item xs={12} sm={6} md={4} key={faucet.id}>
            <Faucet
              faucetAddress={faucet.address}
              title={faucet.title}
              description={faucet.description}
              claimInterval={faucet.claimInterval}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaucetPage;