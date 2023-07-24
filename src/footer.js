import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import Button from "@mui/material/Button";

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
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaDiscord />}
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Discord
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FaTwitter />}
              href="https://twitter.com/DogSwapDeFi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow us on Twitter
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
