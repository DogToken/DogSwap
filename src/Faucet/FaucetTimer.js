// FaucetTimer.jsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';

const FaucetTimer = ({ countdown, onCountdownComplete }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      const formattedCountdown = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      setFormattedTime(formattedCountdown);

      if (countdown === 0) {
        clearInterval(interval);
        onCountdownComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, onCountdownComplete]);

  return (
    <Typography variant="body1">
      Next claim available in: {formattedTime}
    </Typography>
  );
};

export default FaucetTimer;