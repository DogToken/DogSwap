import React from "react";
import { ButtonBase, Grid, makeStyles, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import * as COLORS from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "100%",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover, &$focusVisible": {
      backgroundColor: COLORS.grey[200],
    },
  },
  coinName: {
    opacity: 0.6,
    textAlign: "center", // Center align the text
  },
  coinLogoContainer: {
    position: "relative",
    width: "100%",
  },
  coinLogo: {
    position: "absolute",
    top: "50%", // Adjust the top position to center vertically
    left: "20%", // Adjust the left position
    transform: "translateY(-50%)", // Adjust for vertical centering
    width: 48, // Double the width
    height: 48, // Double the height
  },
}));

CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logoUrl: PropTypes.string, // Add prop type for logoUrl
};

export default function CoinButton(props) {
  const { coinName, coinAbbr, onClick, logoUrl, ...other } = props;
  const classes = useStyles();

  return (
    <ButtonBase focusRipple className={classes.button} onClick={onClick}>
      <Grid container alignItems="center">
        <Grid item xs={3} className={classes.coinLogoContainer}> {/* Adjust the width */}
          {logoUrl && (
            <img src={logoUrl} alt={`${coinAbbr} Logo`} className={classes.coinLogo} />
          )}
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h6">{coinAbbr}</Typography>
          <Typography variant="body2" className={classes.coinName}>
            {coinName}
          </Typography>
        </Grid>
      </Grid>
    </ButtonBase>
  );
}
