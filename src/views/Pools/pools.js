// pools.js
import React from 'react';
import StakingPool from './StakingPool';
import { poolData } from '../../constants/poolData';

const Pools = () => {
  
    return (
      <div maxWidth="lg">
        <h3>
          Reward Pools
        </h3>
        <div container spacing={4} justify="center">
          {poolData.map((pool, index) => (
            <div item xs={12} sm={6} md={4} key={index}>
              <StakingPool
                title={pool.title}
                subTitle={pool.subTitle}
                BONE_TOKEN_ADDRESS={pool.BONE_TOKEN_ADDRESS}
                MASTER_CHEF_ADDRESS={pool.MASTER_CHEF_ADDRESS}
                poolId={pool.poolId}
                lpTokenAddress={pool.lpTokenAddress}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Pools;