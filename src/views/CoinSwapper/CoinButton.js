import React from "react";
import PropTypes from "prop-types";

CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logoUrl: PropTypes.string, // Add prop type for logoUrl
};

export default function CoinButton(props) {
  const { coinName, coinAbbr, onClick, logoUrl, ...other } = props;

  return (
    <button focusRipple onClick={onClick}>
      <div container alignItems="center">
        <div item xs={3}> {/* Adjust the width */}
          {logoUrl && (
            <img src={logoUrl} alt={`${coinAbbr} Logo`} />
          )}
        </div>
        <div item xs={9}>
          <div variant="h6">{coinAbbr}</div>
          <div variant="body2">
            {coinName}
          </div>
        </div>
      </div>
    </button>
  );
}
