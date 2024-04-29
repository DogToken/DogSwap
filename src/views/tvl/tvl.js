import React from 'react';
import { Container, Box } from '@material-ui/core';
import TVLCard from '../../components/TVL/TVL';

const MyPage = () => {
  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center">
        <TVLCard />
      </Box>
    </Container>
  );
};

export default MyPage;