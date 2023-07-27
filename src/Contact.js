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
  accordion: {
    marginBottom: theme.spacing(2),
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
    // Add your logic for handling the form submission here
    // For example, you can send the form data to your backend server or show a success message.

    // For demonstration purposes, let's just log the form data to the console
    console.log("Form Data:", formData);

    // Clear form data after submission
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

  // Sample FAQ data
  const faqData = [
    {
      topic: "General",
      questions: [
        {
          question: "What are your office hours?",
          answer: "Our office is open from 9 AM to 5 PM, Monday to Friday.",
        },
        {
          question: "Where are you located?",
          answer: "We are located at 123 Main Street, City, Country.",
        },
      ],
    },
    {
      topic: "Products",
      questions: [
        {
          question: "Do you offer free shipping?",
          answer: "Yes, we offer free shipping on orders over $50.",
        },
        {
          question: "What is your return policy?",
          answer: "Our return policy allows for returns within 30 days of purchase.",
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
        {/* Form fields */}
        {/* ... */}
      </form>

      {submitted && (
        <Typography variant="h6" align="center" gutterBottom>
          Thank you for your message! We'll get back to you soon.
        </Typography>
      )}

      {/* FAQ Section */}
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
                    <Grid item key={qIndex} xs={12} className={classes.faqItem}>
                      <Typography variant="subtitle1" gutterBottom>
                        {question.question}
                      </Typography>
                      <Typography variant="body2">{question.answer}</Typography>
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
