import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  unstable_createMuiStrictModeTheme,
  ThemeProvider,
  makeStyles,
  withStyles,
} from "@material-ui/core/styles";

import {
  CssBaseline,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Dialog,
  Badge,
} from "@material-ui/core/";

import PrivateMessage from "./PrivateMessage";
import { isMeRecoil, notificationsRecoil } from "../Data/data";


const theme = unstable_createMuiStrictModeTheme();

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },

}))(Badge);

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingBottom: 50,
  },
  listItem: {
    borderBottom: "solid 1px #88888830",
  },
  notifications: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "1",
    overflow: "hidden",
    wordBreak: "break-word",
  },
  notificationsOn: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "1",
    overflow: "hidden",
    wordBreak: "break-word",
    fontWeight: "bold !important",
    color: "black !important"
  },
  dialog: {
    margin: 0,
    width: "100%",
    height: "inherit",
  },

}));

export default function Inbox({ userOnline }) {
  const classes = useStyles();
  const isMe = useRecoilValue(isMeRecoil);
  const [room, setRoom] = useState([]);
  const [notifications, setNotifications] = useRecoilState(notificationsRecoil)
  useEffect(() => {
    let isSubscribed = true
    async function getRoom() {
      try {
        const { data } = await axios.get("https://lite-friend.herokuapp.com/api/chat/room/");
        if (isSubscribed) {
          setRoom(data);
        }

      } catch (error) {
        console.error(error);
      }
    }
    getRoom();
    return () => isSubscribed = false
  }, []);

  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleOpenPrivateMassge = async (idRoomChat) => {
    setRoomId(idRoomChat);
    if (notifications.some(x => x === idRoomChat)) {
      const { data } = await axios.get(`https://lite-friend.herokuapp.com/api/chat/notifications/${idRoomChat}`);
      setNotifications(data)
    }
    setOpen(true);
  };
  const handleClosePrivateMassge = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Paper square className={classes.paper} elevation={0} >
          <List>
            {room.length !== 0
              ? room.map(({ _id, users, chats }) => {
                const { text } = chats[chats.length - 1] ? chats[chats.length - 1] : "";
                const userReceive = users.filter(
                  (user) => user._id !== isMe._id
                );

                return (
                  <React.Fragment key={_id}>
                    <ListItem
                      button
                      className={classes.listItem}
                      onClick={() =>
                        handleOpenPrivateMassge(_id)
                      }
                    >
                      <ListItemAvatar>
                        {userOnline.some(x => x === userReceive[0]._id) ? (
                          <StyledBadge
                            overlap="circle"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                          >
                            <Avatar
                              alt="Profile Picture"
                              src={userReceive[0].avatar}
                            />
                          </StyledBadge>
                        ) : (
                            <Avatar
                              alt="Profile Picture"
                              src={userReceive[0] ? userReceive[0].avatar : ""}
                            />
                          )}
                      </ListItemAvatar>
                      <div
                        className={notifications.indexOf(_id) < 0 ?
                          classes.notifications :
                          classes.notificationsOn}
                      >
                        <div>{userReceive[0] ? userReceive[0].name : ""} </div>
                        <div>{text} </div>
                      </div>
                    </ListItem>
                  </React.Fragment>
                );
              })
              : ""}
          </List>
        </Paper>

        <Dialog
          classes={{ paper: classes.dialog }}
          onClose={handleClosePrivateMassge}
          aria-labelledby="open private massge"
          open={open}
          fullScreen={true}
        >
          <PrivateMessage
            roomId={roomId}
            handleClosePrivateMassge={handleClosePrivateMassge}
            userOnline={userOnline}
          />
        </Dialog>
      </React.Fragment>
    </ThemeProvider>
  );
}
