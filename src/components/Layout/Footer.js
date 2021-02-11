import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    position: "relative"
    // position: "fixed",
    // top: window.innerHeight - 20
  }
}));

export default function DenseAppBar() {
  const classes = useStyles();

  return (

    <AppBar className={classes.root}>Made by Ba Ngo</AppBar>

  );
}
