import React from "react";

import { Route,Redirect} from "react-router-dom";
const token = localStorage.getItem("lite-friend");
const isAuthenticated = token !== null ? true : false;
export const GoHomeIfLogged = ({ component: Component, ...rest }) => {

    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated  ? (
            <Redirect to="/" />
          ) : (
            <Component {...props}  />
          )
        }
      />
    );
  };

  export const GologinIfNotLogin = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={(props) =>
            !isAuthenticated  ? (
              <Redirect to="/login" />
            ) : (
              <Component {...props}  />
            )
          }
        />
      );
    };

