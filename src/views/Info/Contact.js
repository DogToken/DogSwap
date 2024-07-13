import React, { useState } from "react";

function Contact() {

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
    <div maxWidth="md">
      <h4>
        Contact Us
      </h4>
      <form onSubmit={handleSubmit}>
        <textarea
          label="Name"
          variant="outlined"
          fullWidth
          required
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <textarea
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <textarea
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          name="message"
          value={formData.message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </button>
        <button
          variant="contained"
          color="secondary"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>

      {submitted && (
        <h6>
          Thank you for your message! We'll get back to you soon.
        </h6>
      )}
    </div>
  );
}

export default Contact;
