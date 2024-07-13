import React from "react";

export default function Switchbutton(props) {
  const { setDeploy } = props;

  const changeStyles = (K) => {
    if (K === true) {
      let add_button = document.getElementById("add-button");
      add_button.style.backgroundColor = "#008e31";

      let remove_button = document.getElementById("remove-button");
      remove_button.style.backgroundColor = "#9e9e9e";
    } else {
      let remove_button = document.getElementById("remove-button");
      remove_button.style.backgroundColor = "#008e31";

      let add_button = document.getElementById("add-button");
      add_button.style.backgroundColor = "#9e9e9e";
    }
  };

  return (
    <div>
      <div size="large" variant="contained">
        <button
          id="add-button"
          color="primary"
          text="white"
          onClick={() => {
            setDeploy(true);
            changeStyles(true);
          }}
        >
          Deploy Liquidity
        </button>

        <button
          id="remove-button"
          color="secondary"
          text="white"
          onClick={() => {
            setDeploy(false);
            changeStyles(false);
          }}
        >
          Remove Liquidity
        </button>
      </div>
    </div>
  );
}
