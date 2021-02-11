import React from "react";

import Home from "./components/Pages/Home";
import AddFriend from "./components/Pages/AddFriend";
import Menu from "./components/Pages/Menu";
import Messages from "./components/Pages/Messages";
import Notification from "./components/Pages/Notification";
import Search from "./components/Pages/Search";

export const routes = [
  {
    path: "/",
    protect: false,
    exact: true,
    component: () => <Home />,
  },
  {
    path: "/addFriend",
    protect: false,
    exact: true,
    component: () => <AddFriend />,
  },
  {
    path: "/menu",
    protect: false,
    exact: true,
    component: () => <Menu />,
  },
  {
    path: "/messages",
    protect: false,
    exact: true,
    component: () => <Messages />,
  },
  {
    path: "/notification",
    protect: false,
    exact: true,
    component: () => <Notification />,
  },
  {
    path: "/search",
    protect: false,
    exact: true,
    component: () => <Search />,
  },
];
