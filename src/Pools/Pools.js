import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ERCAbi from '../constants/abis/IERC20.json';
import BarAbi from '../constants/abis/SushiBar.json';
import ChefAbi from '../constants/abis/MasterChef.json';
import addresses from '../constants/swapAddresses.json';
import deployAddresses from '../constants/swapAddresses24734.json';
import { ethers, utils } from 'ethers';
import WrongNetwork from '../components/wrongNetwork';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Stack from '@material-ui/core/Stack';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import HelpButton from '../components/helpButton';
import Modal from '@material-ui/core/Modal';
import StakeSection from './LPTStake';
import Paper from '@material-ui/core/Paper';
import COINS from '../constants/coins';
import { selectHttpOptionsAndBody } from '@apollo/react-hooks';

const BLOCKTIME_SEC = 15;
const BLOCKS_PER_DAY = Math.round((24 * 60 * 60) / BLOCKTIME_SEC);

console.log(BLOCKTIME_SEC, 'BLOCKERES');

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

function StakingModal(props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ display: 'inline' }}>
      <Button onClick={handleOpen} color="secondary">
        STAKE
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={modalStyle}>
          <Card>
            <CardContent>
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Stake LPT" {...a11yProps(0)} />
                    <Tab label="Unstake LPT" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel component="div" value={value} index={0}>
                  {value === 0 ? (
                    <StakeSection
                      coins={props.coins}
                      chef={props.chef}
                      poolId={props.poolId}
                      bar={null}
                      pmint={null}
                      lpt={props.lpt}
                      provider={props.provider}
                      coin={'pmint'}
                    />
                  ) : (
                    'Error'
                  )}
                </TabPanel>
                <TabPanel component="div" value={value} index={1}>
                  {value === 1 ? (
                    <StakeSection
                      coins={props.coins}
                      chef={props.chef}
                      poolId={props.poolId}
                      bar={null}
                      pmint={null}
                      lpt={props.lpt}
                      provider={props.provider}
                      coin={'xpmint'}
                    />
                  ) : (
                    'Error'
                  )}
                </TabPanel>
                <Typography variant="p" sx={{ fontSize: '14px', textAlign: 'center' }}>
                  You can acquire this LPT by clicking the "add" button next to the pool
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}

function RewardsHolder(props) {
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item sx={{ marginRight: 1 }}>
        <Stack spacing={0}>
          <Typography variant="b" sx={{ fontSize: '14px', fontWeight: 'bold', color: 'red' }}>
            {props.rewards}
          </Typography>
          {/* <Typography variant="b" sx={{fontSize:'10px',color:'gray'}}>Peppermint Pool</Typography> */}
        </Stack>
      </Grid>
      <Grid item>
        <img src={'/coins/pmint.png'} style={{ height: 20, width: 20 }} alt={'pmint'} />
      </Grid>
    </Grid>
  );
}

function PoolRow(props) {
  var info = props.poolInfo;
  var masterChef = props.chef;

  console.log('rerendered row', info.poolId);

  function openStakeModal() {
    console.log('opening modal for liquidity staking...');
  }

  const rewards = info.rewards;

  const allCoins = COINS.get(window.chainId);

  let coins = info.id.split('-').map((addr) => {
    for (var i in allCoins) {
      if (allCoins[i].address === addr) {
        return allCoins[i].abbr;
      }
    }
    return 'MINTME';
  });

  var v7d = info.volume7d;
  var ln = info.liquidityNative;
  var lu = v7d / ln;
  var APY = (100 * (Math.pow(1 + 0.003 * (5 / 6) * lu, 52) - 1)).toFixed(2);

  if (rewards) {
    var dollarsDay = window.PMINTprice * (rewards - 0);
    var fraction = (30 * dollarsDay) / info.liquidity;
    var rewardAPY = (100 * (Math.pow(1 + fraction, 365 / 30) - 1)).toFixed(2);
    console.log(rewardAPY, ' reward APY ');
    APY = ((APY - 0) + (rewardAPY - 0)).toFixed(2);
  }

  return (
    <TableRow key={info.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, fontSize: '14px' }}>
      <TableCell component="th" scope="row">
        <Grid container direction="row" alignItems="center">
          <Grid item sx={{ marginRight: 2 }}>
            <img
              src={'/coins/' + coins[0].toLocaleLowerCase() + '.png'}
              style={{ height: 30, width: 30 }}
              alt={coins[0]}
            />
            <img
              src={'/coins/' + coins[1].toLocaleLowerCase() + '.png'}
              style={{ height: 30, width: 30, marginLeft: -10 }}
              alt={coins[1]}
            />
          </Grid>
          <Grid item>
            <Stack spacing={0}>
              <Typography variant="h6" sx={{ fontSize: '16px' }}>
                <b>{coins[0]}/{coins[1]}</b>
              </Typography>
              <Typography variant="b" sx={{ fontSize: '10px', color: 'gray' }}>
                Peppermint Pool
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell className="tableCell">${info.liquidity}</TableCell>
      <TableCell className="tableCell">{rewards ? <RewardsHolder rewards={rewards} /> : 'SOON!'}</TableCell>
      <TableCell className="tableCell">
        {rewards ? (
          <b title="This APY accounts for rewards!" style={{ color: 'red' }}>
            {APY}%
          </b>
        ) : (
          APY + '%'
        )}
      </TableCell>
      <TableCell className="tableCell">
        <Link style={{ textDecoration: 'none' }} target="_blank" href={'/liquidity?poolId=' + info.id}>
          <Button>ADD</Button>
        </Link>
        {rewards ? (
          <StakingModal chef={props.chef} coins={coins} poolId={info.poolId} lpt={info.pair} provider={props.provider} />
        ) : (
          ''
        )}
      </TableCell>
    </TableRow>
  );
}

var pooldata = [];

function Pools(props) {
  const [wrongNetworkOpen, setwrongNetworkOpen] = React.useState(false);
  const [masterChef, setMasterChef] = React.useState(null);

  let [pools, setPools] = React.useState([]);

  if (props.provider) {
    (async function () {
      const { chainId } = await props.provider.getNetwork();
      if (chainId !== window.constants.chainIds['mintme']) {
        setwrongNetworkOpen(true);
      }
    })();
  }

  React.useEffect(() => {
    console.log('');
    try {
      fetch(window.chartHost + '/api/getPairs')
        .then((d) => d.json())
        .then(function (resp) {
          var data = resp.data;
          window.PMINTprice = resp.PMINTprice;
          console.log(data);
          const signer = window.provider.getSigner();
          var masterChef = new ethers.Contract(deployAddresses.masterChef, ChefAbi, signer);

          setMasterChef(masterChef);

          pooldata = JSON.parse(JSON.stringify(data));

          console.log('POOLS INCOMING');
          pooldata = pooldata.sort((a, b) => {
            return b.liquidity - a.liquidity;
          });

          setPools(pooldata);
          (async function () {
            var len = (await masterChef.poolLength()).toNumber();
            console.log('POOLS: ', len);
            for (var i = 0; i < len; i++) {
              var poolInfo = await masterChef.poolInfo(i);
              console.log('ALOC POINTS: ', poolInfo.allocPoint, poolInfo);

              var etherAloc = parseFloat(ethers.utils.formatEther(poolInfo.allocPoint.mul(1e12))) * BLOCKS_PER_DAY;

              for (var j = 0; j < pooldata.length; j++) {
                if (pooldata[j].pair === poolInfo.lpToken) {
                  console.log('reee ', etherAloc);
                  pooldata[j].rewards = etherAloc.toFixed(3);
                  pooldata[j].poolId = i;
                }
              }
            }
            setPools(JSON.parse(JSON.stringify(pooldata)));
          })();
        });
    } catch (e) {}
  }, []);

  return (
    <div>
      <WrongNetwork open={wrongNetworkOpen} />
      <Card>
        <CardContent>
          <Box fullWidth sx={{ width: '100%' }}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Pool</TableCell>
                    <TableCell>Liquidity</TableCell>
                    <TableCell>Rewards</TableCell>
                    <TableCell>APY</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pools.map((pool) => (
                    <PoolRow chef={masterChef} poolInfo={pool} provider={props.provider} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default Pools;
