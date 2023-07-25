import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Your sidebar content goes here */}
        <ul>
          <li>
            <Link to="/">Sidebar Link 1</Link>
          </li>
          <li>
            <Link to="/">Sidebar Link 2</Link>
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </div>

      {/* Navigation Bar */}
      <nav>
        <div className="Title">
          <h1 className="navbar-logo">
            🐶 DogSwap
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
      </nav>
    </div>
  );
};

export default NavBar;
