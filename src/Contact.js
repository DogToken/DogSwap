import React, { useState } from "react";
import {
  Container,
  Typography,
  makeStyles,
  TextField,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginRight: theme.spacing(2),
  },
  resetButton: {
    marginRight: theme.spacing(2),
  },
  footer: {
    marginTop: "250px",
  },
}));

function Contact() {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          className={classes.textField}
          required
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          className={classes.textField}
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          className={classes.textField}
          required
          name="message"
          value={formData.message}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.resetButton}
          onClick={handleReset}
        >
          Reset
        </Button>
      </form>

      {submitted && (
        <Typography variant="h6" align="center" gutterBottom>
          Thank you for your message! We'll get back to you soon.
        </Typography>
      )}

      <Grid
        container
        className={classes.footer}
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
      >
        {/* Footer content here */}
      </Grid>
    </Container>
  );
}

export default Contact;
