import React from "react";
import { useRecoilValueLoadable, useRecoilValue } from "recoil"
import { isMeRecoilState } from "./components/Data/data"
import { Route, Redirect } from "react-router-dom";

export const GoHomeIfLogged = ({ component: Component, ...rest }) => {
  const status = useRecoilValueLoadable(isMeRecoilState).state
  const isLoading = status === "loading" ? false : true;
  let isAuthenticated = status === "hasValue" ? true : false;

  return (
    isLoading && <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/" />
        ) : (
            <Component {...props} />
          )
      }
    />
  );
};

export const GoLoginIfNotLoggedin = ({ component: Component, ...rest }) => {
  const status = useRecoilValueLoadable(isMeRecoilState).state
  const isLoading = status === "loading" ? false : true;
  let isAuthenticated = status === "hasValue" ? true : false;

  return (
    isLoading && <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect to="/login" />
          )
      }
    />
  );
};

