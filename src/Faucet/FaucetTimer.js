// FaucetTimer.jsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';

const FaucetTimer = ({ countdown }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    setFormattedTime(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
  }, [countdown]);

  return (
    <Typography variant="body1">
      Next claim available in: {formattedTime}
    </Typography>
  );
};

export default FaucetTimer;