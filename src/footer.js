import React from "react";
import { FaDiscord, FaTwitter, FaRobot, FaHeart, FaGlobe, FaEnvelope, FaPhoneAlt, FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import Button from "@mui/material/Button";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Navigation</h3>
          <div className="backlinks">
            <div className="backlinks-column">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy</a>
            </div>
            <div className="backlinks-column">
              <a href="https://1000x.ch" target="_blank" rel="noopener noreferrer">
                1000x <FiExternalLink />
              </a>
              <a href="/tvl">TVL</a>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <h3>Social Media</h3>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaDiscord />}
              href="https://discord.gg/RSQZDGThfU"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FaTwitter />}
              href="https://twitter.com/DogSwapDeFi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#26a7de", color: "#fff" }}
            >
              Twitter
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FaGithub />}
              href="https://github.com/DogSwap"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#24292e", color: "#fff" }}
            >
              GitHub
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FiExternalLink />}
              href="https://mintme.com/dogswap"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#6c63ff", color: "#fff" }}
            >
              MintMe
            </Button>
          </div>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <p>
              <FaGlobe /> www.dogswap.online
            </p>
            <p>
              <FaEnvelope /> support@dogswap.online
            </p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>
          <FaHeart /> © DogSwap 2023 &nbsp;&nbsp; Created with the help of AI <FaRobot />
        </p>
      </div>
    </footer>
  );
};

export default Footer;