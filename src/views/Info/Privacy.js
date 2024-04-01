import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  makeStyles,
  Paper,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
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

function Privacy() {
  const classes = useStyles();

  const [agreed, setAgreed] = useState(false);

  // Load user agreement status from local storage on component mount
  useEffect(() => {
    const userAgreed = localStorage.getItem("privacyAgreement");
    if (userAgreed === "true") {
      setAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    // Update local storage to remember user's agreement
    localStorage.setItem("privacyAgreement", "true");
    setAgreed(true);
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Privacy Policy for DogSwap.Online
        </Typography>

        {/* Improved readability by breaking content into sections */}

        <Typography variant="h5">What information we collect</Typography>

        <Typography variant="body1">
          We may collect personal identification information from Users in
          various ways, including when Users visit our Site, register on the
          Site, place an order, subscribe to the newsletter, respond to a
          survey, fill out a form, and in connection with other activities,
          services, features, or resources we make available on our Site.
        </Typography>

        <Typography variant="body1">
          We may also collect non-personal identification information about
          Users whenever they interact with our Site. Non-personal
          identification information may include browser name, computer type,
          and technical information about Users' connection to our Site.
        </Typography>

        <Typography variant="h5">How we use collected information</Typography>

        <Typography variant="body1">
          We may use Users' personal and non-personal information for various
          purposes including:
        </Typography>

        <ul>
          <li>To improve customer service</li>
          <li>To personalize user experience</li>
          <li>To improve our Site</li>
          <li>To process payments</li>
          <li>To run promotions, contests, surveys</li>
          <li>To send periodic emails and respond to inquiries</li>
        </ul>

        <Typography variant="h5">How we protect information</Typography>

        <Typography variant="body1">
          We adopt appropriate data practices and security measures to protect
          against unauthorized access, alteration, disclosure, or destruction of
          personal and non-personal information.
        </Typography>

        <Typography variant="h5">Sharing information</Typography>

        <Typography variant="body1">
          We do not sell or share personal identification information with third
          parties except to provide requested services. We may share aggregated
          non-personal demographic information with partners.
        </Typography>

        <Typography variant="h5">Changes to privacy policy</Typography>

        <Typography variant="body1">
          We may update this privacy policy and encourage Users to review it
          periodically.
        </Typography>

        <Typography variant="h5">Contact us</Typography>

        <Typography variant="body1">
          Please contact us at{" "}
          <Link href="mailto:contact@dogswap.online">
            contact@dogswap.online
          </Link>{" "}
          with any questions about this privacy policy.
        </Typography>
      </Paper>
    </Container>
  );
}

export default Privacy;
