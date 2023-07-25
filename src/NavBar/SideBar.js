import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={isOpen ? "sidebar open" : "sidebar"}>
      <ul className="sidebar-menu">
        {MenuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.url} onClick={toggleSidebar}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
