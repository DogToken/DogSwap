import React from "react";

const styles = (theme) => ({
  dialogContainer: {
    borderRadius: theme.spacing(2),
  },
});


export default function WrongNetwork(props) {
  const {open} = props;
  return (
    <div>
      <div>Unsupported Network, make sure you are connected to the MintMe chain.</div>
    </div>
  );
}