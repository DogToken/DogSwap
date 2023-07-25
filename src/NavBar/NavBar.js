import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import "./NavBar.css";

const baseUrl = "https://api.dogswap.online/api/v1";

export const useGetStats = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/stat`);
        const responsedata = await response.json();
        setData(responsedata);
      } catch (error) {
        console.error("Unable to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return data;
};

const NavBar = () => {
  const [tvl, setTVL] = useState(null);
  const data = useGetStats(); // Fetch the TVL data using the useGetStats hook

  useEffect(() => {
    // Set the TVL value once the data is fetched
    if (data) {
      setTVL(data.total_value_locked);
    }
  }, [data]);

  return (
    <nav>
      <div className="Title">
        <h1 className="navbar-logo">
          🐶 DogSwap
          {/* Display the TVL value in the navbar */}
          {tvl !== null && <span className="tvl-value">TVL: ${tvl}</span>}
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
