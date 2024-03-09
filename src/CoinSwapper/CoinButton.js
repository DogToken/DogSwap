import React from "react";
import { ButtonBase, Grid, makeStyles, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import * as COLORS from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "100%",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    "&:hover, &$focusVisible": {
      backgroundColor: COLORS.grey[200],
    },
  },
  coinName: {
    opacity: 0.6,
  },
  coinLogo: {
    marginRight: theme.spacing(1), // Adjust margin as needed
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
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
      <Grid container direction="column" alignItems="center">
        {logoUrl && (
          <Grid item>
            <img src={logoUrl} alt={`${coinAbbr} Logo`} className={classes.coinLogo} />
          </Grid>
        )}
        <Typography variant="h6">{coinAbbr}</Typography>
        <Typography variant="body2" className={classes.coinName}>
          {coinName}
        </Typography>
      </Grid>
    </ButtonBase>
  );
}
