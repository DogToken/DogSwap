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

function About() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          About Us
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
          diam ut nunc facilisis euismod a ac metus. Nulla facilisi. Proin
          fermentum, elit quis dignissim luctus, velit elit faucibus elit, sit
          amet hendrerit nisi mauris et dolor. Nulla facilisi. Cras interdum
          justo et felis eleifend, vel facilisis nunc dignissim. Phasellus
          auctor aliquam nisi, et rhoncus nibh accumsan nec. Sed consequat ut
          justo id ultricies. Nullam id lacus id eros varius finibus vel a mi.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Proin eget libero velit. Nunc tincidunt vel turpis id ullamcorper.
          Sed id facilisis elit. Nulla facilisi. Cras a nunc augue. Aenean
          ultrices magna nec tortor ultrices rhoncus. Donec facilisis dolor nec
          sapien faucibus faucibus. In iaculis libero vel turpis volutpat, non
          dignissim nunc facilisis. Sed ut auctor nibh. Quisque luctus auctor
          augue, eu blandit nisi faucibus a. Fusce nec elit id felis ultrices
          hendrerit sit amet ac sapien. Fusce congue, lectus non cursus
          tristique, elit ligula hendrerit odio, a suscipit turpis nibh sit
          amet justo.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros
          vitae nunc tristique interdum. Integer feugiat euismod arcu eu
          pulvinar. Sed rhoncus et odio et placerat. Sed in felis consectetur,
          cursus arcu id, laoreet nunc. Vivamus ullamcorper finibus nunc, eget
          aliquet risus rhoncus sit amet. Praesent sodales vel elit id
          tincidunt. Suspendisse faucibus vel velit a cursus.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          If you have any questions or feedback, feel free to contact us at{" "}
          <Link
            href="mailto:contact@example.com"
            className={classes.link}
            underline="none"
          >
            contact@example.com
          </Link>
          .
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;
