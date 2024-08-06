import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  unstable_createMuiStrictModeTheme,
  ThemeProvider,
  makeStyles,
  withStyles,
} from "@material-ui/core/styles";

import { useRecoilValue } from "recoil";
import { isMeRecoil } from "../Data/data";
import {
  CssBaseline,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  Avatar,
  Badge,
} from "@material-ui/core/";
import PrivateMessage from "./PrivateMessage";

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
  listItem: {
    borderBottom: "solid 1px #88888830",
  },
  paper: {
    paddingBottom: 50,
  },
  dialog: {
    margin: 0,
    width: "100%",
    height: "inherit",
  },
}));

export default function Friend({ userOnline }) {
  const classes = useStyles();
  const { _id, friends } = useRecoilValue(isMeRecoil);
  const [users, setUsers] = useState(friends);
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    async function getFriends() {
      try {
        const { data } = await axios.get(
          "https://lite-friend-server.onrender.com/api/user/me/friends"
        );
        if (isSubscribed) {
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getFriends();
    return () => (isSubscribed = false);
  }, []);

  const handleOpenPrivateMassge = async (userId) => {
    const userInRoom = [userId, _id].sort();
    const roomId = userInRoom.join("-");
    try {
      const { data } = await axios.post(
        `https://lite-friend-server.onrender.com/api/chat/room/${roomId}`,
        userInRoom
      );
      setRoomId(data._id);
    } catch (error) {
      console.error(error);
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
        <Paper square elevation={0} className={classes.paper}>
          <List className={classes.list}>
            {users.map(({ _id, name, avatar }, index) => (
              <React.Fragment key={_id ? _id : index}>
                <ListItem
                  button
                  className={classes.listItem}
                  onClick={() => handleOpenPrivateMassge(_id)}
                >
                  <ListItemAvatar>
                    {userOnline.some((x) => x === _id) ? (
                      <StyledBadge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar alt="Profile Picture" src={avatar} />
                      </StyledBadge>
                    ) : (
                      <Avatar alt="Profile Picture" src={avatar} />
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={name} />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Dialog
          classes={{ paper: classes.dialog }}
          onClose={handleClosePrivateMassge}
          aria-labelledby="open private massage"
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
