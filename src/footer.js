import React from "react";
import "./Footer.css"; // You can create a new CSS file for the footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="backlinks">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
        <div className="company-info">
          <p>Company Name</p>
          <p>Address: 123 Main St, City, Country</p>
          <p>Email: contact@company.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
