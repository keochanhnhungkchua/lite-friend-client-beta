import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { TextField, Button, Paper } from '@material-ui/core';
import logo from "./litefriend.png"
const useStyles = makeStyles((theme) => ({
  formLogin: {
    display: "flex",
    flexDirection: "column",
    padding: "10%",
    paddingBottom: 10
  },
  formInput: {
    margin: "5px 0px",
    marginLeft: 0,
    padding: 15,
  },
  signIn: {
    display: "flex",
    flexDirection: "column",
    padding: "10%",
    paddingTop: 0,
  },
  button: {
    marginTop: 10,
    backgroundColor: " #1877f2",
    fontWeight: "bold",
    color: "white",
    transitionDelay: '0.2s',
    "&:hover": {
      backgroundColor: "#1852f2f2",
    },
  }
}));

export default function Login() {
  const classes = useStyles();


  return (
    <Paper>
      <form className={classes.formLogin}>
        <img src={logo} alt="logo" />
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Features not yet available! Please come back later"
          variant="outlined"
        />
        <Button
          // type="submit" 
          variant="contained"
          className={classes.button}
        >
          Send
         </Button>
      </form>
      <div className={classes.signIn}>
        <Link to="/login"> If you have an account? Sign in</Link>
        <Link to="/register">Don't have an account? Sign up</Link>
        <Link to="/">  Go home</Link>
      </div>
    </Paper>
  );
}