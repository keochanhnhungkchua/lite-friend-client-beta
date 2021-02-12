import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
}));

export default function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h6">
        Sorry, this page isn't available.
      </Typography>
      <Typography variant="subtitle1">
        The link you followed may be broken, or the page may have been removed.
        <Link component={NavLink} to="/">
          Go back to Home
        </Link>
      </Typography>
    </div>
  );
}