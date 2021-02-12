import React from "react";
import jwt from "jsonwebtoken";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import setAuthHeader from "./components/Data/setAuthHeader";
import Profile from "./components/Pages/Profile"
import Home from "./components/Pages/Home"

import { GoHomeIfLogged,GoLoginIfNotLoggedin } from "./routes"

export default function App() {
  const token = localStorage.getItem("lite-friend");
  if (token) {
    const currentTime = Date.now() / 1000;
    const decoded = jwt.decode(token, { complete: true });
    if (currentTime > decoded.exp) {
      localStorage.removeItem("lite-friend");
    } else {
      setAuthHeader(token)
    }
  }
  return (
    <Router>
      <Switch>
        <GoHomeIfLogged exact path="/login" component={Login} />
        <GoHomeIfLogged exact path="/register" component={Register} />
        <GoHomeIfLogged exact path="/forgot-password" component={ForgotPassword} />
        <GoLoginIfNotLoggedin path="/" component={Home} />
        <GoLoginIfNotLoggedin path="/profile/:userId" component={Profile} />
      </Switch>   
    </Router>
  )
}

