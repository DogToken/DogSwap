import React from "react";
import {
  Container,
  Typography,
  makeStyles,
  Paper,
  Link,
} from "@material-ui/core";
import { Info as InfoIcon, MailOutline as MailOutlineIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

function About() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          <InfoIcon className={classes.icon} />
          About DogSwap
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Welcome to DogSwap, your gateway to decentralized finance (DeFi)! 🐾 $BONE is our native token, powering transactions, liquidity, and governance within our ecosystem.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          DogSwap operates on the Ethereum blockchain, providing users with secure and transparent trading experiences. We're thrilled to announce our listing on MintMe.com, offering even more accessibility and liquidity to our community.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Have questions or feedback? Reach out to us at{" "}
          <Link
            href="mailto:contact@example.com"
            className={classes.link}
            underline="none"
          >
            <MailOutlineIcon />
            contact@example.com
          </Link>
          .
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;
