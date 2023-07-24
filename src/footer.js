import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

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
          {/* Styled buttons for Discord and Twitter */}
          <div>
            <button className="discord-button">
              <FaDiscord /> Join our Discord
            </button>
          </div>
          <div>
            <button className="twitter-button">
              <FaTwitter /> Follow us on Twitter
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
