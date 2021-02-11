import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import { ArrowBack, MoreHoriz, Mail, LocationOn, Home, School, CameraAlt } from "@material-ui/icons";
import { CardMedia, Paper, Avatar, Button, MenuItem, Menu, Badge, Dialog } from "@material-ui/core";

import AddPost from "../Post/AddPost";
import Post from "../Post/Post";
import { useRecoilValue, useRecoilState } from "recoil";
import { PostsRecoil, isMeRecoil } from "../Data/data";
import { UpdateCoverAvatar, UpdateInfo } from "../MyComponent/Upload"
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  Profile: {
    width: "100%",
  },
  Profile_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: " 0px 5px",
    height: 40,
    backgroundColor: " #3b5998",
    color: "white",
  },
  Profile_cover_avatar_avatar: {
    cursor: "pointer",
    width: 100,
    height: 100,
    border: "solid 4px white",
  },
  Profile_cover: {
    position: "relative",
  },
  Profile_cover_avatar: {
    position: "relative",
    bottom: 55,
    // left: (window.innerWidth / 2) - 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  Profile_cover_menu: {
    marginTop: -50,
    display: "flex",
  },
  Profile_cover_menu_addFriend: {
    flexGrow: 1,
    backgroundColor: "#1877f2",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#1877f2"
    }
  },
  Profile_cover_menu_icon: {
    backgroundColor: "#d7dadf",
    padding: "6px 10px",
    marginLeft: 5,
    borderRadius: 7,
  },
  Profile_cover_info: {
    display: "flex",
    alignItems: "center",
    color: "#1a1a1af5",
    margin: 4,
  },
  friend: {
    width: 80,
    height: 80,
    flexGrow: 1,
    margin: " 0 5px",
  },
  cv: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  bb: {
    width: "100%",
    backgroundColor: "#ced4ddd4",
    height: 30,
    borderRadius: 5,
    fontWeight: "bold",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "#ced4ddd4",
    }
  },
  coverEmpty: {
    backgroundColor: "#bbbbbb66"
  },
  CameraAlt: {
    backgroundColor: "#e4e6eb",
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  button: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#d5d7dc26",
    borderRadius: 5,
    zIndex: 1
  },
  input: {
    display: "none"
  }
}));


export default function UserProfile() {
  const classes = useStyles();
  const { userId } = useParams();
  const [isMe, setIsMe] = useRecoilState(isMeRecoil);
  const [posts, setPosts] = useRecoilState(PostsRecoil);
  const [user, setUser] = useState([]); //info of you into view
  const [friends, setFriends] = useState([])
  const [editProfile, setEditProfile] = useState(false);//set open close edit profile
  const checkFriend = new Set(isMe.friends).has(userId)
  const [open, setOpen] = useState(false);
  const [changeCoverAvatar, setChangeCoverAvatar] = useState("")
  useEffect(() => {
    let isSubscribed = true
    async function getUser() {
      try {
        const { data } = await axios.get(
          `https://lite-friend.herokuapp.com/api/post/profile/${userId}/`
        );
        const friend = await axios.get
          (`https://lite-friend.herokuapp.com/api/user/me/friends/${userId}`);

        if (isSubscribed) {
          setPosts(data.posts);
          setUser(data.user);
          setFriends(friend.data)
        }

      } catch (error) {
        console.error(error);
      }
    }
    getUser();
    return () => {
      setPosts([])
      setUser([])
      isSubscribed = false
    }
  }, [userId, setPosts]);

  const handleClickEditProfile = (event) => {
    event.stopPropagation();
    setEditProfile(event.currentTarget);
  };
  const addFriend = async (userId) => {
    try {
     const {data} = await axios.get
        (`https://lite-friend.herokuapp.com/api/user/addFriend/${userId}/`);
        setIsMe(data)
    } catch (error) {
      console.error(error);
    }
  }

  const closeUpdateCoverAvatar = () => {
    setOpen(false)
    setEditProfile(false)
  }
  const updateCover = () => {
    setChangeCoverAvatar("cover");
    setOpen(true);
  }
  const updateAvatar = () => {
    setChangeCoverAvatar("avatar");
    setOpen(true);
  }
  const updateInfo = () => {
    setChangeCoverAvatar("info");
    setOpen(true);
  }

  return (
    <div>
      {/* edit info user */}
      <Dialog
        onClose={closeUpdateCoverAvatar}
        aria-labelledby="edit info user"
        open={open}
        fullScreen={true}
      >
        {changeCoverAvatar === "info" ? <UpdateInfo closeUpdateCoverAvatar={closeUpdateCoverAvatar} /> :
          <UpdateCoverAvatar
            closeUpdateCoverAvatar={closeUpdateCoverAvatar}
            change={changeCoverAvatar} />
        }

      </Dialog>
      <Paper className={classes.Profile}>
        <Link style={{ textDecoration: "none" }} to="/">
          <div className={classes.Profile_header}>
            {" "}
            <ArrowBack />
            <h4> {user.name}</h4>
            <div></div>
          </div>
        </Link>


        <div className={classes.Profile_cover}>
          <div style={{ position: "relative" }}>
            <CardMedia
              className={user.cover ? "" : classes.coverEmpty}
              height="250px"
              component="img"
              image={userId === isMe._id ? isMe.cover : user.cover}
              title="cover"
            />

            {userId === isMe._id ?
              <Button
                onClick={updateCover}

                size="small"
                className={classes.button}
                startIcon={<CameraAlt />}
              >
                Edit Cover Photos
           </Button>
              : ""}
          </div>

          <div className={classes.Profile_cover_avatar}>
            <Badge
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              classes={{ anchorOriginBottomRightCircle: userId === isMe._id ? classes.CameraAlt : "" }}
              badgeContent={userId === isMe._id ?
                <CameraAlt onClick={updateAvatar} fontSize="small" /> : ""}
            >
              <Avatar
                className={classes.Profile_cover_avatar_avatar}
                alt="avatar"
                src={userId === isMe._id ? isMe.avatar : user.avatar}
              />
            </Badge>
            <h2 > {userId === isMe._id ? isMe.name : user.name} </h2>
          </div>
          <div className={classes.Profile_cover_menu}>
            <Button
              disabled={userId === isMe._id || checkFriend ? true : false}
              onClick={() => addFriend(userId)}
              className={classes.Profile_cover_menu_addFriend}>
              Add Friend
            </Button>
            <Mail className={classes.Profile_cover_menu_icon} />
            <MoreHoriz
              className={classes.Profile_cover_menu_icon}
              onClick={userId === isMe._id ? handleClickEditProfile : () => { }}
            />
          </div>
          <Menu
            anchorEl={editProfile}
            keepMounted
            open={Boolean(editProfile)}
            onClose={() => setEditProfile(false)}
          >
            <MenuItem onClick={updateAvatar}>Change Avatar </MenuItem>
            <MenuItem onClick={updateCover}>Change Cover</MenuItem>
            <MenuItem onClick={updateInfo}>Update Info</MenuItem>
          </Menu>
          <div style={{ borderBottom: "solid 1px #1a1a1ab5" }}>
            <div className={classes.Profile_cover_info}>
              <School />
              <span>&nbsp;Studied at &nbsp; </span>
              <h4 style={{ margin: 0 }}>{userId === isMe._id ? isMe.userInfo.studiedAt :
                user.userInfo === undefined ? "" : user.userInfo.studiedAt}</h4>
            </div>
            <div className={classes.Profile_cover_info}>
              <Home />
              <span>&nbsp; Lives in &nbsp; </span>
              <h4 style={{ margin: 0 }}>{userId === isMe._id ? isMe.userInfo.liveIn :
                user.userInfo === undefined ? "" : user.userInfo.liveIn}</h4>{" "}
            </div>
            <div className={classes.Profile_cover_info}>
              <LocationOn />
              <span>&nbsp; From &nbsp; </span>
              <h4 style={{ margin: 0 }}>{userId === isMe._id ? isMe.userInfo.from :
                user.userInfo === undefined ? "" : user.userInfo.from}</h4>
            </div>
            <div className={classes.Profile_cover_info}>
              <MoreHoriz /> <span>&nbsp; see more info &nbsp; </span>{" "}
            </div>
          </div>
          <div>
            <h3 style={{ margin: 0 }}> Friend</h3>
            <span> friends({user.friends ? user.friends.length : 0}) </span>

            <div className={classes.cv}>
              {friends ?
                friends.slice(0, 3).map((item) =>
                  <div key={item._id}>
                    <Link to={`/profile/${item._id}`}>
                      <img
                        className={classes.friend}
                        src={item.avatar}
                        alt="friend"
                      />
                    </Link>

                    <h4 style={{ margin: 0 }}> {item.name}</h4>
                  </div>
                ) : ""}

            </div>

            <Button className={classes.bb}>See All Friends</Button>
          </div>

          {userId === isMe._id ? <AddPost /> : ""}
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </Paper >
    </div>
  );
}
