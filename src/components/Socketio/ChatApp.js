import React, { useState, useEffect } from "react";

import { Paper, Tabs, Tab, Badge } from "@material-ui/core";
import { Group, Mail, } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useRecoilValue } from "recoil";
import Inbox from "./Inbox";
import Friend from "./Friend";
import { startIOConnection, socket } from "../Data/socketio";
import { notificationsRecoil, isMeRecoil } from "../Data/data";


const useStyles = makeStyles({
  header: {
    backgroundColor: " #303f9f",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
  },
  tab: {
    marginTop: 48,
  }

});
export default function ChatApp() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [chat, setchat] = useState(false);
  const [userOnline, setUserOnline] = useState([]);
  const notifications = useRecoilValue(notificationsRecoil);
  const { friends } = useRecoilValue(isMeRecoil);

  const handleChange = (e, newValue) => {
    if (newValue === 0) {
      setchat(!chat);
    } else {
      setchat(!chat);
    }
    setValue(newValue);
  };

  useEffect(() => {
    socket.emit("getOnlineUsers")
    socket.on("getOnlineUsers", (listUserOnline) => {
      setUserOnline(listUserOnline);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [value]);
  var setA = new Set(userOnline);
  var setB = new Set(friends);

  let intersection = new Set([...setA].filter(x => setB.has(x)));

  return (
    <Paper elevation={0} >
      <Tabs
        className={classes.tab}
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        aria-label="chat app"
      >
        <Tab
          aria-label="Inbox"
          icon={<Badge
            badgeContent={notifications ? notifications.length : 0}
            color="error"
          >
            <Mail />
          </Badge>}

        />
        <Tab
          aria-label="friend"
          icon={
            <Badge
              badgeContent={intersection.size}
              color="error"
            >
              <Group />
            </Badge>
          }

        />
      </Tabs>

      {value === 0 ? (
        <Inbox
          userOnline={userOnline}
          notifications={notifications}
        />
      ) : (
          <Friend userOnline={userOnline} />
        )}
    </Paper>
  );
}

