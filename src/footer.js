import React from "react";
import { FaDiscord, FaTwitter, FaRobot, FaHeart, FaGlobe, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Navigation</h3>
          <div className="backlinks">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/tvl">TVL</a>
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
          </div>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <p>
              <FaGlobe /> dogswap.online
            </p>
            <p>
              <FaEnvelope /> info@dogswap.online
            </p>
            <p>
              <FaPhoneAlt /> +1 (555) 555-5555
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