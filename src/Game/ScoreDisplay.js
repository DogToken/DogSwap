import React from 'react';
import Typography from '@mui/material/Typography';

const ScoreDisplay = ({ score }) => {
  return (
    <div>
      <h2>Score Display</h2>
      <Typography variant="h4">Score: {score}</Typography>
    </div>
  );
};

export default ScoreDisplay;
