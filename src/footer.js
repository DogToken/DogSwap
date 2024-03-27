import React from "react";
import { FaDiscord, FaTwitter, FaRobot, FaHeart, FaGlobe, FaEnvelope, FaPhoneAlt, FaGithub, FaMapMarkerAlt } from "react-icons/fa";
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
          <h3 className="centered-heading">Social Media</h3>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaDiscord />}
              href="https://discord.gg/RSQZDGThfU"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
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
              size="small"
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
              size="small"
            >
              GitHub
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
            <p>
              <FaPhoneAlt /> +1 (555) 123-4567
            </p>
            <p>
              <FaMapMarkerAlt /> 123 Main Street, Anytown USA
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