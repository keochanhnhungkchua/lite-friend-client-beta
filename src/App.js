import React, { Suspense } from "react";
import jwt from "jsonwebtoken";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import setAuthHeader from "./components/Data/setAuthHeader";
import Profile from "./components/Pages/Profile";
import PostId from "./components/Pages/PostId";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

if (localStorage.getItem("lite-friend")) {
  const currentTime = Date.now() / 1000;
  const token = localStorage.getItem("lite-friend");
  const decoded = jwt.decode(token, { complete: true });

  if (currentTime > decoded.exp) {
    localStorage.removeItem("lite-friend");
    window.location.href = "/";
  } else {
    setAuthHeader(localStorage.getItem("lite-friend"));
  }
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/post/:postId" component={PostId} />
        <Route exact path="/profile/:userId">
          <Suspense fallback={<h3>loading data...</h3>}>
            <Profile />
          </Suspense>
        </Route>
        <Route exact path="/">
          <Suspense fallback={<h3>loading data...</h3>}>
            <Header />
            <Footer />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
}
