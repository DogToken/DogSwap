import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";

const NavBar = ({ isConnected, walletAddress }) => {
  return (
    <nav>
      <div className="Title">
        <h1 className="navbar-logo">
          <span role="img" aria-label="dog">
            🐶
          </span>{" "}
          DogSwap
        </h1>
      </div>

      <div className="NavbarItems">
        <ul className={`nav-menu`}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={"nav-links"} to={item.url}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isConnected ? (
        <div className="ConnectionInfo">
          <p>Connected: {walletAddress}</p>
        </div>
      ) : (
        <div className="ConnectionInfo">
          <Link className={"nav-links"} to="/connect-metamask">
            Connect with MetaMask
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
