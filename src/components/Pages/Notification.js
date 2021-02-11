import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
  },
}));

export default function DenseAppBar() {
  const classes = useStyles();

  return <div className={classes.root}>notifuncation tab</div>;
}
