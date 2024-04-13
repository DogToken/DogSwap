import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@material-ui/core";
import { Contract, ethers } from "ethers";
import Bone from "../../build/BoneToken.json";
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
  voteItem: {
    padding: theme.spacing(1, 2),
  },
  voteItemSecondaryAction: {
    padding: theme.spacing(1, 2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const VotingPage = () => {
  const classes = useStyles();
  const [currentVotes, setCurrentVotes] = useState(0);
  const [newDelegateAddress, setNewDelegateAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [voteQuestions, setVoteQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = await getProvider();
        const boneContract = new Contract(BONE_TOKEN_ADDRESS, Bone.abi, provider);
        const currentVotesRaw = await boneContract.getCurrentVotes(provider.getSigner().getAddress());
        const currentVotes = ethers.utils.formatEther(currentVotesRaw);
        setCurrentVotes(currentVotes);

        // Fetch the list of vote questions from the contract
        const questionsCount = await boneContract.getVoteQuestionsCount();
        const questions = [];
        for (let i = 0; i < questionsCount; i++) {
          const question = await boneContract.getVoteQuestion(i);
          questions.push(question);
        }
        setVoteQuestions(questions);
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
      const boneContract = new Contract(BONE_TOKEN_ADDRESS, Bone.abi, signer);
      const tx = await boneContract.delegate(newDelegateAddress);
      await tx.wait();
      const updatedVotesRaw = await boneContract.getCurrentVotes(signer.getAddress());
      const updatedVotes = ethers.utils.formatEther(updatedVotesRaw);
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
      const boneContract = new Contract(BONE_TOKEN_ADDRESS, Bone.abi, signer);
      const tx = await boneContract.castVote(voteIndex);
      await tx.wait();
      const updatedVotesRaw = await boneContract.getCurrentVotes(signer.getAddress());
      const updatedVotes = ethers.utils.formatEther(updatedVotesRaw);
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
          <Tooltip title="Your current voting power">
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Your current votes: {currentVotes}
            </Typography>
          </Tooltip>
          <Tooltip title="The address you want to delegate your votes to">
            <TextField
              label="New Delegate Address"
              variant="outlined"
              value={newDelegateAddress}
              onChange={handleDelegateChange}
            />
          </Tooltip>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDelegate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Delegate Votes"}
            </Button>
          </div>
          <Divider className={classes.divider} />
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3">
                Vote on Questions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {voteQuestions.map((question, index) => (
                  <Card key={index} className={classes.voteItem}>
                    <CardContent>
                      <Tooltip title="The current vote question">
                        <Typography variant="body1">{question}</Typography>
                      </Tooltip>
                    </CardContent>
                    <CardActions className={classes.voteItemSecondaryAction}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVote(index)}
                        disabled={loading}
                      >
                        Vote
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VotingPage;