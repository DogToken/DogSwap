import React from "react";
import COINS from "../../constants/coins";
import CoinButton from "./CoinButton";
import { doesTokenExist } from "../../utils/ethereumFunctions";
import PropTypes from "prop-types";

// This is a modified version of MaterialUI's DialogTitle component, I've added a close button in the top right corner

CoinDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  coins: PropTypes.array.isRequired,
};

export default function CoinDialog(props) {
  // The CoinDialog component will display a dialog window on top of the page, allowing a user to select a coin
  // from a list (list can be found in 'src/constants/coins.js') or enter an address into a search field. Any entered
  // addresses will first be validated to make sure they exist.
  // When the dialog closes, it will call the `onClose` prop with 1 argument which will either be undefined (if the
  // user closes the dialog without selecting anything), or will be a string containing the address of a coin.

  const { onClose, open, coins, signer, ...others } = props;

  const [address, setAddress] = React.useState("");
  const [error, setError] = React.useState("");

  // Called when the user tries to input a custom address, this function will validate the address and will either
  // then close the dialog and return the validated address, or will display an error.
  const submit = () => {
    if (doesTokenExist(address, signer)) {
      exit(address);
    } else {
      setError("This address is not valid");
    }
  };

  // Resets any fields in the dialog (in case it's opened in the future) and calls the `onClose` prop
  const exit = (value) => {
    const coinCanAdd = COINS.get(window.chainId);
    if(coinCanAdd&&window.ethereum){
      const info = coinCanAdd.filter(x=>x.address===value)[0];
      console.log(info);
      const added = localStorage.getItem(value)||(info&&info.abbr==='MINTME')
      if(added){
        console.log('already added')
      }
      if(info&&!added){
        (async ()=>{
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: value, // The address that the token is at.
                symbol: info.abbr, // A ticker symbol or shorthand, up to 5 chars.
                decimals: info.decimals||18, // The number of decimals in the token
                image: 'https://dogswap.xyz/images/coins/'+info.abbr.toLocaleLowerCase()+'.png', // A string url of the token logo
              },
            },
          });
        
          if (wasAdded) {
            console.log('Thanks for your interest!');
            localStorage.setItem(value,'done')
          } else {
            console.log('Your loss!');
          }
        })();
      }
      
    }
    setError("");
    setAddress("");
    onClose(value);
  };

  return (
    <div
      open={open}
      onClose={() => exit(undefined)}
      fullWidth
      maxWidth="sm" // Change the maxWidth here
      sx={{ zIndex: 500000 }}
    >
      <div onClose={() => exit(undefined)}>Select Coin</div>

      <hr/>

      <div>
        <div container direction="column" spacing={1} alignContent="center">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            placeholder="Paste Address"
            error={error !== ""}
            helperText={error}
            fullWidth
          />

          <hr/>

          <div item>
            <div container direction="column">
              {/* Maps all of the tokens in the constants file to buttons */}
              {coins.map((coin, index) => (
                <div item key={index} xs={12}>
                  <CoinButton
                    coinName={coin.name}
                    coinAbbr={coin.abbr}
                    onClick={() => exit(coin.address)}
                    logoUrl={coin.logoUrl} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <button autoFocus onClick={submit} color="primary">
          Enter
        </button>
      </div>
    </div>
  );
}
