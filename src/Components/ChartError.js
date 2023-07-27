import React from "react";
import { Typography } from "@material-ui/core";

function ChartError({ msg }) {
  return (
    <Typography variant="body1" color="error">
      {msg}
    </Typography>
  );
}

export default ChartError;
