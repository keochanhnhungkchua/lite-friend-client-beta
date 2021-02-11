import React from "react";
import {useRecoilValueLoadable} from "recoil"
import { Route,Redirect} from "react-router-dom";

import {isMeRecoil} from "./components/Data/data";

export const GoHomeIfLogged = ({ component: Component, ...rest }) => {
    const isAuthenticated  = useRecoilValueLoadable(isMeRecoil).state === "hasValue" ? true :false;
    console.log(isAuthenticated)
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