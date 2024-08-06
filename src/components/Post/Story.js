import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { useForm } from "react-hook-form";

import ScrollMenu from "react-horizontal-scrolling-menu";
import MultiImageInput from "react-multiple-image-input";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Paper, Dialog } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AvTimerIcon from "@material-ui/icons/AvTimer";

import { isMeRecoil } from "../Data/data";
import { uploadImage } from "../Data/api";

const useStyles = makeStyles((theme) => ({
  story: {
    marginBottom: 10,
  },
  story_story: {
    display: "flex",
    justifyContent: "space-between",
    margin: 8,
    paddingTop: 8,
  },
  story_story_: {
    display: "flex",
    margin: "unset",
    fontWeight: "bold",
  },
  story_story_icon: {
    display: "flex",
    alignItems: "center",
    color: "#606770",
  },
  // set story
  setStory: {
    marginRight: 6,
    width: 100,
    position: "relative",
    height: 150,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderRadius: 15,
    color: "white",
  },
  avatar: {
    position: "absolute",
    top: 8,
    left: 8,
    border: "solid 2.5px #3578e5",
  },
  avatar0: {
    position: "absolute",
    top: 8,
    left: 8,
    border: "solid 2.5px #fff",
    backgroundColor: "white",
    color: "#3578e5",
    fontSize: "2rem",
  },
  name: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontWeight: "bold",
    fontSize: 13,
  },

  //upload story
  uploadStory: {
    margin: 5,
  },
  uploadStory_button: {
    width: "100%",
    backgroundColor: " #4080ff",
    border: "none",
    borderRadius: 5,
    height: 40,
    color: "white",
    fontWeight: "bold",
  },
  uploadStory_header: {
    display: "flex",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "space-between",
    padding: " 0px 5px",
    height: 40,
    backgroundColor: " #3b5998",
    color: "white",
    borderRadius: 5,
  },
  uploadStory_goback: {
    display: "flex",
    alignItems: "center",
  },
  uploadStory_addStory: {
    border: "none",
    borderLeft: "solid",
    background: "none",
    color: "white",
    fontWeight: "bold",
    paddingLeft: 5,
  },
  // view story
  showStory: {
    position: "absolute",
    color: "white",
    fontSize: "2rem",
    right: 10,
  },
  root: {
    margin: 0,
    width: "100%",
  },
}));

function Story({ list }) {
  const classes = useStyles();
  return (
    <div
      className={classes.setStory}
      style={{
        backgroundImage: "url(" + list.imgUrl + ")",
      }}
    >
      <Avatar className={classes.avatar} alt="avatar" src={list.user.avatar} />

      <div className={classes.name}>{list.user.name}</div>
    </div>
  );
}

function Story0({ list }) {
  const classes = useStyles();

  return (
    <label htmlFor="icon-button-file">
      <div
        className={classes.setStory}
        style={
          list.avatar === ""
            ? {
                backgroundColor: "#888",
              }
            : {
                backgroundImage: "url(" + list.avatar + ")",
              }
        }
      >
        <Avatar className={classes.avatar0} alt="avatar">
          +
        </Avatar>
        <div className={classes.name}>{"Add to Story"}</div>
      </div>
    </label>
  );
}

export default function App() {
  const classes = useStyles();
  const [storyUpdate, setstoryUpdate] = useState([]);
  const [open, setOpen] = useState(false);
  const [story, setStory] = useState(false);
  const [showStory, setshowStory] = useState("");
  const user = useRecoilValue(isMeRecoil);
  const [images, setImages] = useState({});
  const { handleSubmit } = useForm();

  const onSelect = (key) => {
    if (key === user._id) {
      setOpen(true);
    } else {
      const myInfo = storyUpdate.find((item) => item._id === key);
      setshowStory(myInfo);
      setStory(true);
    }
  };
  const handStory = () => {
    setStory(false);
    setshowStory("");
  };
  const handleClose = () => {
    setImages({});
    setOpen(false);
  };
  useEffect(() => {
    let isSubscribed = true;
    async function getStory() {
      try {
        const { data } = await axios.get(
          "https://lite-friend-server.onrender.com/api/story"
        );
        if (isSubscribed) setstoryUpdate(data);
      } catch (error) {
        console.log(error);
      }
    }
    getStory();
    return () => (isSubscribed = false);
  }, []);
  //upload story
  const onSubmit = async (e) => {
    setOpen(false);
    const file = Object.values(images);
    if (file.length !== 0) {
      const imgUrl = await uploadImage(file);
      const { data } = await axios.post(
        "https://lite-friend-server.onrender.com/api/story",
        { imgUrl: imgUrl[0] }
      );
      setstoryUpdate((prev) => [user, data, ...prev.slice(1)]);
      setImages({});
    }
  };
  return (
    <div>
      <Paper className={classes.story}>
        <div className={classes.story_story}>
          <p className={classes.story_story_text}>Stories</p>
          <div className={classes.story_story_icon}>
            <AvTimerIcon />
            <p
              className={classes.s}
              style={{
                fontWeight: "normal",
              }}
            >
              Your Archive
            </p>
          </div>
        </div>
        <ScrollMenu
          data={storyUpdate.map((list, index) => {
            if (index === 0) {
              return <Story0 list={list} key={list._id} index={index} />;
            } else {
              return <Story list={list} key={list._id} index={index} />;
            }
          })}
          onSelect={onSelect}
          dragging="false"
        />
      </Paper>
      {/* open image when user clicks  */}
      <Dialog
        classes={{ paper: classes.root }}
        onClose={handStory}
        aria-labelledby="view story"
        open={story}
      >
        <div onClick={handStory} className={classes.showStory}>
          X
        </div>
        <img src={showStory.imgUrl} style={{ width: "inherit" }} alt="logo" />
      </Dialog>
      {/* upload story */}
      <Dialog
        onClose={handleClose}
        aria-labelledby="upload story"
        open={open}
        fullScreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={classes.uploadStory}>
          <div className={classes.uploadStory_header}>
            <div onClick={handleClose} className={classes.uploadStory_goback}>
              {" "}
              <ArrowBackIcon />
              Go Back
            </div>
            <input
              type="submit"
              className={classes.uploadStory_addStory}
              value="Add Story"
            />
          </div>
          <MultiImageInput
            images={images}
            setImages={setImages}
            max={1}
            allowCrop={false}
            theme="light"
          />
          <input
            type="submit"
            className={classes.uploadStory_button}
            value="Add Story"
          />
        </form>
      </Dialog>
    </div>
  );
}
