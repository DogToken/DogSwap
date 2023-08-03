import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";

const NavBar = () => {
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
    </nav>
  );
};

export default NavBar;
