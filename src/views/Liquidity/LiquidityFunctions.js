import { Contract, ethers, BigNumber } from "ethers";
import { fetchReserves, fetchReservesRaw, getDecimals } from "../../utils/ethereumFunctions";

window.BigNumber = BigNumber;

const ERC20 = require("../../build/ERC20.json");
const PAIR = require("../../build/IUniswapV2Pair.json");

const ONE = ethers.BigNumber.from(1);
const TWO = ethers.BigNumber.from(2);

function sqrt(value) {
    let x = ethers.BigNumber.from(value);
    let z = x.add(ONE).div(TWO);
    let y = x;
    while (z.sub(y).isNegative()) {
        y = z;
        z = x.div(z).add(z).div(TWO);
    }
    return y;
}
function min(a,b){
  if(a.lt(b)){
    return a;
  }
  return b;
}

// Function used to add Liquidity to any pair of tokens or token-AUT
// To work correctly, there needs to be 9 arguments:
//    `address1` - An Ethereum address of the coin to add from (either a token or AUT)
//    `address2` - An Ethereum address of the coin to add to (either a token or AUT)
//    `amount1` - A float or similar number representing the value of address1's coin to add
//    `amount2` - A float or similar number representing the value of address2's coin to add
//    `amount1Min` - A float or similar number representing the minimum of address1's coin to add
//    `amount2Min` - A float or similar number representing the minimum of address2's coin to add
//    `routerContract` - The router contract to carry out this trade
//    `accountAddress` - An Ethereum address of the current user's account
//    `provider` - The current provider
//    `signer` - The current signer
export async function addLiquidity(
  address1,
  address2,
  amount1,
  amount2,
  amount1min,
  amount2min,
  routerContract,
  account,
  signer
) {
  const token1 = new Contract(address1, ERC20.abi, signer);
  const token2 = new Contract(address2, ERC20.abi, signer);

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const amountIn1 = ethers.utils.parseUnits(amount1, token1Decimals);
  const amountIn2 = ethers.utils.parseUnits(amount2, token2Decimals);

  const amount1Min = ethers.utils.parseUnits(amount1min, token1Decimals);
  const amount2Min = ethers.utils.parseUnits(amount2min, token2Decimals);

  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

   // Approve token1 for the router contract
   const token1ApprovalTx = await token1.approve(routerContract.address, amountIn1);
   await token1ApprovalTx.wait();
 
   // Approve token2 for the router contract
   const token2ApprovalTx = await token2.approve(routerContract.address, amountIn2);
   await token2ApprovalTx.wait();

  const wethAddress = await routerContract.WETH();

  console.log([
    address1,
    address2,
    amountIn1,
    amountIn2,
    amount1Min,
    amount2Min,
    account,
    deadline,
  ]);

  if (address1 === wethAddress) {
    // Eth + Token
    await routerContract.addLiquidityETH(
      address2,
      amountIn2,
      amount2Min,
      amount1Min,
      account,
      deadline,
      { value: amountIn1 }
    );
  } else if (address2 === wethAddress) {
    // Token + Eth
    await routerContract.addLiquidityETH(
      address1,
      amountIn1,
      amount1Min,
      amount2Min,
      account,
      deadline,
      { value: amountIn2 }
    );
  } else {
    // Token + Token
    await routerContract.addLiquidity(
      address1,
      address2,
      amountIn1,
      amountIn2,
      amount1Min,
      amount2Min,
      account,
      deadline
    );
  }
}

// Function used to remove Liquidity from any pair of tokens or token-AUT
// To work correctly, there needs to be 9 arguments:
//    `address1` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `address2` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `liquidity_tokens` - A float or similar number representing the value of liquidity tokens you will burn to get tokens back
//    `amount1Min` - A float or similar number representing the minimum of address1's coin to recieve
//    `amount2Min` - A float or similar number representing the minimum of address2's coin to recieve
//    `routerContract` - The router contract to carry out this trade
//    `accountAddress` - An Ethereum address of the current user's account
//    `provider` - The current provider
//    `signer` - The current signer
export async function removeLiquidity(
  address1,
  address2,
  liquidity_tokens,
  amount1min,
  amount2min,
  routerContract,
  account,
  signer,
  factory
) {
  const token1 = new Contract(address1, ERC20.abi, signer);
  const token2 = new Contract(address2, ERC20.abi, signer);

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const Getliquidity = (liquidity_tokens)=>{
    if (liquidity_tokens < 0.001){
      return ethers.BigNumber.from(liquidity_tokens*10**18);
    }
    return ethers.utils.parseUnits(String(liquidity_tokens), 18);
  }

  const liquidity = Getliquidity(liquidity_tokens);
  console.log('liquidity: ', liquidity);

  const amount1Min = ethers.utils.parseUnits(String(amount1min), token1Decimals);
  const amount2Min = ethers.utils.parseUnits(String(amount2min), token2Decimals);

  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const wethAddress = await routerContract.WETH();
  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, PAIR.abi, signer);

  const approvalTx = await pair.approve(routerContract.address, liquidity);
  await approvalTx.wait();

  console.log([
    address1,
    address2,
    Number(liquidity),
    Number(amount1Min),
    Number(amount2Min),
    account,
    deadline,
  ]);

  if (address1 === wethAddress) {
    // Eth + Token
    await routerContract.removeLiquidityETH(
      address2,
      liquidity,
      amount2Min,
      amount1Min,
      account,
      deadline
    );
  } else if (address2 === wethAddress) {
    // Token + Eth
    await routerContract.removeLiquidityETH(
      address1,
      liquidity,
      amount1Min,
      amount2Min,
      account,
      deadline
    );
  } else {
    // Token + Token
    await routerContract.removeLiquidity(
      address1,
      address2,
      liquidity,
      amount1Min,
      amount2Min,
      account,
      deadline
    );
  }
}

const quote = (amount1, reserve1, reserve2) => {
  const amount2 = amount1 * (reserve2 / reserve1);
  return [amount2];
};

// Function used to get a quote of the liquidity addition
//    `address1` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `address2` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `amountA_desired` - The prefered value of the first token that the user would like to deploy as liquidity
//    `amountB_desired` - The prefered value of the second token that the user would like to deploy as liquidity
//    `factory` - The current factory
//    `signer` - The current signer
async function estimateFee(pair,factory,_reserve0,_reserve1){
  const feeOn = (await factory.feeTo()) !== '0x3D041510f58665a17D722EE2BC73Ae409BB8715b';
  let kLast = await pair.kLast();
  console.log(kLast.toString(),_reserve0,_reserve1)
  let totalSupply = await pair.totalSupply();
  let _kLast = kLast; // gas savings
  if (feeOn) {
      if (!_kLast.eq(0)) {
          let rootK = sqrt((_reserve0).mul(_reserve1));
          let rootKLast = sqrt(_kLast);
          if (rootK.gt(rootKLast)) {
              let numerator = totalSupply.mul(rootK.sub(rootKLast));
              let denominator = rootK.mul(5).add(rootKLast);
              let liquidity = numerator.div(denominator);
              if (liquidity.gt(0)){
                return liquidity;
              };
          }
      }
  }
  return 0;
}

async function quoteMintLiquidity(
  address1,
  address2,
  amountA,
  amountB,
  factory,
  signer
){
  const MINIMUM_LIQUIDITY = 1000;
  let _reserveA = 0;
  let _reserveB = 0;
  let totalSupply = 0;
  let pair = null;
  [_reserveA, _reserveB, totalSupply,pair] = await factory.getPair(address1, address2).then(async (pairAddress) => {
    if (pairAddress !== '0x0000000000000000000000000000000000000000'){
      const pair = new Contract(pairAddress, PAIR.abi, signer);

      const reservesRaw = await fetchReservesRaw(address1, address2, pair, signer); // Returns the reserves already formated as ethers
      const reserveA = reservesRaw[0];
      const reserveB = reservesRaw[1];
      const totalSupply = await pair.totalSupply();
      return [reserveA, reserveB, totalSupply,pair]
    } else {
      return [0,0,0,null]
    }
  });


  const token1 = new Contract(address1, ERC20.abi, signer);
  const token2 = new Contract(address2, ERC20.abi, signer);

  // Need to do all this decimals work to account for 0 decimal numbers

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);
  amountA*=1;
  amountB*=1;
  if(isNaN(amountA)||isNaN(amountB)){
    amountA=amountB=0;
  }
  // let amountA = amountA*1, amountB = amountB*1;

  console.log(amountA,amountB)
  const valueA = ethers.utils.parseUnits(amountA+'', token1Decimals)
  const valueB = ethers.utils.parseUnits(amountB+'', token2Decimals)

  const reserveA = _reserveA
  const reserveB = _reserveB


  if (totalSupply === 0){
    const val = sqrt(valueA.mul(valueB).sub(MINIMUM_LIQUIDITY));
    return ethers.utils.formatEther(val)-0;
  };
  const fee = await estimateFee(pair,factory,reserveA,reserveB);
  console.log(fee);
  totalSupply = totalSupply.add(fee);
  let liquidity = min(valueA.mul(totalSupply).div(reserveA), valueB.mul(totalSupply).div(reserveB));
  return ethers.utils.formatEther(liquidity)-0;
};

export async function quoteAddLiquidity(
  address1,
  address2,
  amountADesired,
  amountBDesired,
  factory,
  signer
) {

  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, PAIR.abi, signer);

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  if (reserveA === 0 && reserveB === 0) {
    const amountOut = await quoteMintLiquidity(
      address1,
      address2,
      amountADesired,
      amountBDesired,
      factory,
      signer);
    return [
      amountADesired,
      amountBDesired,
      amountOut.toPrecision(8),
    ];
  } else {
    const amountBOptimal = quote(amountADesired, reserveA, reserveB);
    if (amountBOptimal <= amountBDesired) {
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountADesired,
        amountBOptimal,
        factory,
        signer);
      return [
        amountADesired,
        amountBOptimal,
        amountOut.toPrecision(8),
      ];
    } else {
      const amountAOptimal = quote(
        amountBDesired,
        reserveB,
        reserveA
      );
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountAOptimal,
        amountBDesired,
        factory,
        signer);
      return [
        amountAOptimal,
        amountBDesired,
        amountOut.toPrecision(8),
      ];
    }
  }
}

// Function used to get a quote of the liquidity removal
//    `address1` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `address2` - An Ethereum address of the coin to recieve (either a token or AUT)
//    `liquidity` - The amount of liquidity tokens the user will burn to get their tokens back
//    `factory` - The current factory
//    `signer` - The current signer

export async function quoteRemoveLiquidity(
  address1,
  address2,
  liquidity,
  factory,
  signer
) {
  const pairAddress = await factory.getPair(address1, address2);
  console.log("pair address", pairAddress);
  const pair = new Contract(pairAddress, PAIR.abi, signer);

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formated as ethers
  const reserveA = ethers.utils.parseEther(reservesRaw[0]+"");
  const reserveB = ethers.utils.parseEther(reservesRaw[1]+"");

  const feeOn =
    (await factory.feeTo()) !== '0x3D041510f58665a17D722EE2BC73Ae409BB8715b';

  const kLast = await pair.kLast();
  
  let totalSupply = await pair.totalSupply();
  const fee = await estimateFee(pair,factory,reserveA,reserveB);

  totalSupply = totalSupply.add(fee)

  //  if( feeOn && kLast.gt(0)){
  //   const rootK = sqrt(kLast);
  //   const rootReserve = sqrt(reserveA.mul(reserveB));
  //   const feeLiquidity = (totalSupply.mul(rootReserve).sub(rootK)).div(rootReserve.mul(5).add(rootK));
  //   totalSupply = totalSupply.add(feeLiquidity);
  //   console.log(ethers.utils.formatEther(totalSupply),ethers.utils.formatEther(feeLiquidity))
  // }

  totalSupply = ethers.utils.formatEther(totalSupply)-0;


  const Aout = (reservesRaw[0] * liquidity) / totalSupply;
  const Bout = (reservesRaw[1] * liquidity) / totalSupply;
  

  return [liquidity, Aout, Bout];
}
