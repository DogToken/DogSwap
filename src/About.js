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
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  paragraph: {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
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
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          <InfoIcon className={classes.icon} />
          About DogSwap
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Welcome to DogSwap, your ultimate destination for decentralized finance (DeFi) solutions! 🐾
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          At DogSwap, we're committed to empowering users with secure, transparent, and efficient trading experiences. Our native token, $BONE, lies at the heart of our ecosystem, facilitating transactions, providing liquidity, and enabling community governance.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Powered by the Ethereum blockchain, DogSwap offers a wide range of features, including token swaps, liquidity pools, and yield farming opportunities. We're excited to announce our recent listing on MintMe.com, expanding accessibility and liquidity for our growing community.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Have questions or feedback? We'd love to hear from you! Reach out to us at{" "}
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
