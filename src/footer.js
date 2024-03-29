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
              <a href="/tvl">TVL</a>
            </div>
            <div className="backlinks-column">
            <a href="https://1000x.ch" target="_blank" rel="noopener noreferrer">
                1000x <FiExternalLink />
              </a> 
              <a href="https://www.mintme.com/token/DogSwap/invite" target="_blank" rel="noopener noreferrer">
                MintMe.com <FiExternalLink />
              </a>
              <a href="https://www.bybit.com/invite?ref=73ARRG" target="_blank" rel="noopener noreferrer">
                BYBIT <FiExternalLink />
              </a>
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
          <div className="button-container">
          <Button
              variant="contained"
              color="primary"
              startIcon={<img src="https://dogswap.online/images/coins/mintmelogo.png" alt="MintMe" width="100" height="20" />}
              href="https://www.mintme.com/token/BONE/invite"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#252525", color: "#fff" }}
              size="small"
            >
              
            </Button><Button
              variant="contained"
              color="primary"
              startIcon={<img src="https://dogswap.online/images/coins/nordlogo.svg" alt="Nord" width="20" height="20" />}
              href="https://ref.nordvpn.com/DRUHsAoWykw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#fff", color: "#fff" }}
              size="small"
            >
              
            </Button><Button
              variant="contained"
              color="primary"
              startIcon={<img src="https://dogswap.online/images/coins/mintmelogo.png" alt="MintMe" width="100" height="20" />}
              href="https://www.mintme.com/token/BONE/invite"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#252525", color: "#fff" }}
              size="small"
            >
              
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
              <FaPhoneAlt /> +1 (555) WOOF-WOOF
            </p>
            <p>
              <FaMapMarkerAlt /> 5th Tree, Barkingson USA
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