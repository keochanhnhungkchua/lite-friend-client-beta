import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
  },
}));

export default function Post() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      Post
      <Link to="/">Back to home</Link>
    </div>
  );
}
