import React, { useState } from "react";
import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  accordion: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  faqQuestion: {
    width: "100%",
  },
  faqTable: {
    border: "1px solid #ccc",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  faqTitle: {
    marginBottom: theme.spacing(2),
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

  // Sample FAQ Data
  const faqData = [
    {
      topic: "Topic 1",
      questions: [
        {
          question: "Question 1",
          answer: "Answer 1",
        },
        {
          question: "Question 2",
          answer: "Answer 2",
        },
      ],
    },
    {
      topic: "Topic 2",
      questions: [
        {
          question: "Question 3",
          answer: "Answer 3",
        },
        {
          question: "Question 4",
          answer: "Answer 4",
        },
      ],
    },
  ];

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

      {/* FAQ Section */}
      <Typography variant="h5" className={classes.faqTitle}>
        Frequently Asked Questions
      </Typography>
      <Grid container direction="column" alignItems="center">
        {faqData.map((faqItem, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={10}
            md={8}
            className={classes.accordion}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" gutterBottom>
                  {faqItem.topic}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column" alignItems="flex-start">
                  {faqItem.questions.map((question, qIndex) => (
                    <Grid
                      item
                      key={qIndex}
                      xs={12}
                      className={classes.faqQuestion}
                    >
                      <div className={classes.faqTable}>
                        <Typography variant="subtitle1">
                          {question.question}
                        </Typography>
                        <Typography variant="body2">
                          {question.answer}
                        </Typography>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

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
