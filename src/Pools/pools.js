// pools.js
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid } from '@material-ui/core';
import StakingPool from './StakingPool';
import { poolData } from './poolData';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  stakingPoolContainer: {
    marginBottom: theme.spacing(4),
  },
}));

const Pools = () => {
    const classes = useStyles();
  
    return (
      <Container maxWidth="lg" className={classes.root}>
        <Typography variant="h3" className={classes.title}>
          Reward Pools
        </Typography>
        <Grid container spacing={4} justify="center">
          {poolData.map((pool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} className={classes.stakingPoolContainer}>
              <StakingPool
                title={pool.title}
                subTitle={pool.subTitle}
                BONE_TOKEN_ADDRESS={pool.BONE_TOKEN_ADDRESS}
                MASTER_CHEF_ADDRESS={pool.MASTER_CHEF_ADDRESS}
                poolId={pool.poolId}
                lpTokenAddress={pool.lpTokenAddress}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

export default Pools;