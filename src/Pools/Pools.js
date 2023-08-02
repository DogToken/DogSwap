import React from "react";
import {
  Container,
  Typography,
  makeStyles,
  Paper,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  paragraph: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

function Pools() {
  const classes = useStyles();

  return (
    
  );
}

export default Pools;
