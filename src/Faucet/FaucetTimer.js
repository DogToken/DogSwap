// FaucetTimer.jsx
import React from 'react';
import { Typography } from '@material-ui/core';

const FaucetTimer = ({ countdown }) => {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  return (
    <Typography variant="body1">
      Next claim available in: {`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
    </Typography>
  );
};

export default FaucetTimer;