import React from 'react';
import { Button, Flex, Text } from '@dogswapfinance/uikit';
import { makeStyles } from '@material-ui/core';
import { getBalanceNumber } from 'utils/formatBalance';
import DepositModal from '../DepositModal';
import WithdrawModal from '../WithdrawModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: theme.palette.text.primary,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, tokenBalance, tokenName, pid, depositFeeBP }) => {
  const classes = useStyles();
  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />);
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  );

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button className={classes.button} onClick={onPresentDeposit}>Stake</Button>
    ) : (
      <div className={classes.actions}>
        <Button className={classes.button} variant="tertiary" onClick={onPresentWithdraw}>Withdraw</Button>
        <Button className={classes.button} variant="tertiary" onClick={onPresentDeposit}>Stake</Button>
      </div>
    )
  }

  return (
    <Flex className={classes.root}>
      <Text className={classes.heading}>{displayBalance}</Text>
      {renderStakingButtons()}
    </Flex>
  )
};

export default StakeAction;
