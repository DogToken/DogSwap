import React from "react";
import PropTypes from "prop-types";

CoinField.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  activeField: PropTypes.bool.isRequired,
};

export function RemoveLiquidityField1(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol, value, onChange, activeField } = props;
  return (
    <div>
      <div
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Button */}
        <div item xs={3}>
          <div
            size="small"
            variant="extended"
            onClick={onClick}
          >
            {symbol}
            <div />
          </div>
        </div>
        {/* Text Field */}
        <div item xs={9}>
          <input
            value={value}
            onChange={onChange}
            placeholder="0.0"
            disabled={!activeField}
          />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export function RemoveLiquidityField2(props) {
  // This component is used to selecting a coin and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol } = props;

  return (
    <div>
      <div
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Button */}
        <div item xs={3}>
          <div
            size="small"
            variant="extended"
            onClick={onClick}
          >
            {symbol}
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoinField(props) {
  // This component is used to selecting a token and entering a value, the props are explained below:
  //      onClick - (string) => void - Called when the button is clicked
  //      symbol - string - The text displayed on the button
  //      value - string - The value of the text field
  //      onChange - (e) => void - Called when the text field changes
  //      activeField - boolean - Whether text can be entered into this field or not

  const { onClick, symbol, value, onChange, activeField } = props;

  return (
    <div>
      <div
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Button */}
        <div item xs={3}>
          <div
            size="small"
            variant="extended"
            onClick={onClick}
          >
            {symbol}
            <div />
          </div>
        </div>

        {/* Text Field */}
        <div item xs={9}>
          <input
            value={value}
            onChange={onChange}
            placeholder="0.0"
            disabled={!activeField}
          />
        </div>
      </div>
    </div>
  );
}
