import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Badge, Box } from "@material-ui/core/";

import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import FacebookIcon from "@material-ui/icons/Facebook";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { isMeRecoil, notificationsRecoil } from "../Data/data";
import { socket } from "../Data/socketio";
import ChatApp from "../Socketio/ChatApp"
import PeopleMayYouKnow from "../Pages/PeopleMayYouKnow"
import Search from "../Pages/Search"
import MenuProfile from "../Pages/MenuProfile"
import ListPost2 from "../Post/ListPost"

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: "10px 0px",
    minWidth: "60px",
  },
  selected: {
    color: "white !important",
  },
  menuPaper: {
    maxWidth: "none",
    maxHeight: "94%",
    width: "100%",
    height: "100%",
    top: "48px !important",
    left: "0 !important",
    borderRadius: 0,
  },
  featureNotYet: {
    textDecoration: "line-through"
  },
  //style or ShowTab
  box: {
    marginTop: 50,
    minHeight: window.innerHeight
  }
}));

function ShowTab(props) {
  const { children, value, index } = props;
  const classes = useStyles();
  return (
    value === index && (
      <Box className={classes.box}>
        {children}
      </Box>
    )
  );
}

export default function PrimarySearchAppBar() {
  // console.log(useRecoilValueLoadable(isMe));
  const classes = useStyles();
  const isMe = useRecoilValue(isMeRecoil);
  const [value, setValue] = useState(0);
  const [notifications, setNotifications] = useRecoilState(notificationsRecoil)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    socket.on("notifications", (data) => setNotifications(data))
  }, [setNotifications])
  return (
    <div>
      <AppBar>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={<FacebookIcon />}
            aria-label="Home"
            component={NavLink}
            to="/"
          />
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={<PeopleAltIcon />}
            aria-label="add friend"
          />
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={
              <Badge badgeContent={notifications ? notifications.length : 0} color="error">
                <MailIcon />
              </Badge>
            }
            aria-label="Messages"
          />
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={<NotificationsIcon />}
            aria-label="NotificationsIcon"
          />
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={<SearchIcon />}
            aria-label="SearchIcon"
          />
          <Tab
            classes={{
              root: classes.tab,
              selected: classes.selected,
            }}
            icon={<MenuIcon />}
            aria-label="MenuIcon"

          />
        </Tabs>
      </AppBar>
      <ShowTab value={value} index={0}>
        <ListPost2 />
      </ShowTab>
      <ShowTab value={value} index={1}>
        <PeopleMayYouKnow />
      </ShowTab>
      <ShowTab value={value} index={2}>
        <ChatApp notifications={notifications} />
      </ShowTab>
      <ShowTab value={value} index={3}>
        Notifications  : Coming soon
      </ShowTab>
      <ShowTab value={value} index={4}>
        <Search />
      </ShowTab>
      <ShowTab value={value} index={5}>
        <MenuProfile id={isMe._id} />
      </ShowTab>
    </div>
  );
}

