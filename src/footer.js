import React from "react";
import { FaDiscord, FaTwitter, FaRobot, FaHeart } from "react-icons/fa";
import Button from "@mui/material/Button";

const Footer = ({ bonePriceInUSD, toggleTVLPage }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="backlinks">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          BONE Price:{" "}
              <span
                className="bone-price"
                onClick={toggleTVLPage}
                style={{ cursor: "pointer" }}
              >
                🦴 {bonePriceInUSD !== null ? `$${bonePriceInUSD}` : "Loading..."}
              </span>
        </div>
        <div className="company-info">
          {/* Styled buttons for Discord and Twitter */}
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
        <div className="copyright">
        <p>
          <FaHeart /> © DogSwap 2023 &nbsp;&nbsp; Created with the help of AI <FaRobot />
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
