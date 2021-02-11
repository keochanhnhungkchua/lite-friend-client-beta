import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core"
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  featureNotYet: {
    textDecoration: "line-through"
  },
}));

export default function DenseAppBar({ id }) {
  const classes = useStyles();
  const logOut = () => {
    localStorage.removeItem("lite-friend");
    window.location.href = "/login";
  };
  return <div className={classes.root}>
    <div>
      <Link to={`/profile/${id}`} style={{ textDecoration: "none" }}>
        Your profile
    </Link>
    </div>
    <List className={classes.featureNotYet} >Give Feedback</List>
    <List className={classes.featureNotYet} >Settings & Privacy</List>
    <List className={classes.featureNotYet} >Help & Support </List>
    <List className={classes.featureNotYet} >Display & Accessibility</List>
    <List onClick={logOut}>Log out</List>
  </div>;
}
