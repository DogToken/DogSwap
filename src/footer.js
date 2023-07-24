import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa"; // Import Font Awesome icons

import "./footer.css"; // You can create a new CSS file for the footer styles

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
          <p>DogSwap</p>
          <p>Email: contact@dogswap.online</p>
          <p>
            <FaDiscord />{" "}
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer">
              Join our Discord
            </a>
          </p>
          <p>
            <FaTwitter />{" "}
            <a href="https://twitter.com/DogSwapDeFi" target="_blank" rel="noopener noreferrer">
              Follow us on Twitter
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
