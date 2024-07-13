import React, { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import boneTokenABI from "../../build/BoneToken.json";
import { getProvider, getSigner, getNetwork, fetchReserves, fetchReservesRaw, getDecimals } from "../../utils/ethereumFunctions";

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";

const VotingPage = () => {
  const [currentVotes, setCurrentVotes] = useState(0);
  const [newDelegateAddress, setNewDelegateAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [voteQuestions, setVoteQuestions] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = await getProvider();
        const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI.abi, provider);

        // Fetch the current votes
        const currentVotesRaw = await boneContract.getCurrentVotes(provider.getSigner().getAddress());
        const currentVotes = ethers.formatEther(currentVotesRaw);
        setCurrentVotes(currentVotes);

        // Fetch the list of vote questions
        const questionsCount = await boneContract.getVoteQuestionsCount();
        const questions = [];
        for (let i = 0; i < questionsCount; i++) {
          const question = await boneContract.getVoteQuestion(i);
          questions.push(question);
        }
        setVoteQuestions(questions);

        // Fetch the user's votes
        const userVotes = {};
        for (let i = 0; i < questionsCount; i++) {
          const hasVoted = await boneContract.hasVoted(provider.getSigner().getAddress(), i);
          userVotes[i] = hasVoted;
        }
        setUserVotes(userVotes);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Display a user-friendly error message here
      }
    };

    fetchData();
  }, []);

  const handleDelegateChange = (event) => {
    setNewDelegateAddress(event.target.value);
  };

  const handleDelegate = async () => {
    try {
      setLoading(true);
      const provider = await getProvider();
      const signer = provider.getSigner();
      const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI.abi, signer);
      const tx = await boneContract.delegate(newDelegateAddress);
      await tx.wait();
      const updatedVotesRaw = await boneContract.getCurrentVotes(signer.getAddress());
      const updatedVotes = ethers.formatEther(updatedVotesRaw);
      setCurrentVotes(updatedVotes);
    } catch (error) {
      console.error("Error delegating votes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteIndex) => {
    try {
      setLoading(true);
      const provider = await getProvider();
      const signer = provider.getSigner();
      const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI.abi, signer);
      const tx = await boneContract.castVote(voteIndex);
      await tx.wait();
      const updatedVotesRaw = await boneContract.getCurrentVotes(signer.getAddress());
      const updatedVotes = ethers.formatEther(updatedVotesRaw);
      setCurrentVotes(updatedVotes);
      setUserVotes({ ...userVotes, [voteIndex]: true });
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          {/* ... (existing content) */}
          <div div>
            <div item xs={12}>
              <h6>
                Vote on Questions
              </h6>
            </div>
            <div item xs={12}>
              {voteQuestions.length > 0 ? (
                <div>
                  {voteQuestions.map((question, index) => (
                    <div key={index}>
                      <div>
                        <button
                          variant="contained"
                          color={userVotes[index] ? "secondary" : "primary"}
                          onClick={() => handleVote(index)}
                          disabled={loading || userVotes[index]}
                        >
                          {userVotes[index] ? "Voted" : "Vote"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No vote questions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;