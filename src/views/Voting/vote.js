import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography, CircularProgress, TextField, Grid, Card, CardContent } from "@material-ui/core";
import { Contract, ethers } from "ethers";
import boneTokenABI from "../../build/BoneToken.json";
import { Contract, ethers } from "ethers";
import { getProvider, getSigner, getNetwork, fetchReserves, fetchReservesRaw, getDecimals } from "../../utils/ethereumFunctions";

const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
  voteContainer: {
    marginTop: theme.spacing(2),
  },
}));

const VotingPage = () => {
  const classes = useStyles();
  const [currentVotes, setCurrentVotes] = useState(0);
  const [newDelegateAddress, setNewDelegateAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [voteQuestions, setVoteQuestions] = useState([]);
  const [newVoteQuestion, setNewVoteQuestion] = useState("");

  useEffect(() => {
    const fetchCurrentVotes = async () => {
      try {
        const provider = await getProvider();
        const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, provider);
        const currentVotes = await boneContract.getCurrentVotes(provider.getSigner().getAddress());
        setCurrentVotes(currentVotes);
      } catch (error) {
        console.error("Error fetching current votes:", error);
      }
    };

    fetchCurrentVotes();
  }, []);

  const handleDelegateChange = (event) => {
    setNewDelegateAddress(event.target.value);
  };

  const handleVoteQuestionChange = (event) => {
    setNewVoteQuestion(event.target.value);
  };

  const handleAddVoteQuestion = () => {
    if (newVoteQuestion.trim() !== "") {
      setVoteQuestions([...voteQuestions, newVoteQuestion.trim()]);
      setNewVoteQuestion("");
    }
  };

  const handleVote = async () => {
    try {
      setLoading(true);
      const provider = await getProvider();
      const signer = provider.getSigner();
      const boneContract = new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
      const tx = await boneContract.delegate(newDelegateAddress);
      await tx.wait();
      const updatedVotes = await boneContract.getCurrentVotes(signer.getAddress());
      setCurrentVotes(updatedVotes);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Voting Page
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Your current votes: {currentVotes}
          </Typography>
          <TextField
            label="New Delegate Address"
            variant="outlined"
            value={newDelegateAddress}
            onChange={handleDelegateChange}
          />
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVote}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Vote"}
            </Button>
          </div>
          <div className={classes.voteContainer}>
            <TextField
              label="New Vote Question"
              variant="outlined"
              value={newVoteQuestion}
              onChange={handleVoteQuestionChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddVoteQuestion}
            >
              Add Question
            </Button>
            {voteQuestions.map((question, index) => (
              <Card key={index} className={classes.card}>
                <CardContent>
                  <Typography variant="body1">{question}</Typography>
                  {/* Add voting functionality here */}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VotingPage;