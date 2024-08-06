import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Avatar, Dialog } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import MultiImageInput from "react-multiple-image-input";
import { Link } from "react-router-dom";
import { PostsRecoil, isMeRecoil } from "../Data/data";
import { uploadImage } from "../Data/api";
const useStyles = makeStyles((theme) => ({
  addPost: {
    padding: 10,
    paddingTop: 20,
    marginTop: 26,
    marginBottom: 10,
    display: "block",
  },
  addPost_children: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 10,
  },
  addPost_children_input: {
    width: "100%",
    border: "1px solid #DDD",
    borderRadius: 30,
    outline: "none",
    marginLeft: 5,
  },
  addPost_children_icon: {
    background: "#ebedf0",
    borderRadius: 19,
    borderRight: 0,
    color: "#606770",
    display: "flex",
    margin: "0 8px 0 0",
    padding: "4px 8px",
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  //dialog upload images
  uploadImage: {
    margin: 0,
    width: "100%",
    height: "inherit",
  },
  uploadImage_textarea: {
    width: "99%",
    borderColor: "#aaa",
  },
  uploadImage_addPost: {
    width: "100%",
    backgroundColor: " #4080ff",
    border: "none",
    borderRadius: 5,
    height: 40,
    color: "white",
    fontWeight: "bold",
  },
  uploadImage_form: {
    margin: 5,
  },
  uploadImage_form_header: {
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
  uploadImage_form_header_goback: {
    display: "flex",
    alignItems: "center",
  },
  uploadImage_form_header_addPost: {
    border: "none",
    borderLeft: "solid",
    background: "none",
    color: "white",
    fontWeight: "bold",
    paddingLeft: 5,
  },
}));

export default function BasicTextFields() {
  const [updateNewPost, setUpdateNewPost] = useRecoilState(PostsRecoil);
  const [images, setImages] = useState({});
  const classes = useStyles();
  const { register, handleSubmit, reset } = useForm();

  const { avatar, _id } = useRecoilValue(isMeRecoil);

  //new post
  const onSubmit = async (e) => {
    setOpen(false);
    const file = Object.values(images);
    var imgUrl = [];
    if (file.length !== 0) {
      imgUrl = await uploadImage(file);
    }
    const { text } = e;
    const { data } = await axios.post(
      "https://lite-friend-server.onrender.com/api/post",
      {
        text,
        imgUrl,
      }
    );
    reset();
    setImages({});
    const newPost = [...updateNewPost];
    newPost.unshift(data);
    setUpdateNewPost(newPost);
  };
  //dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper className={classes.addPost}>
      <div className={classes.addPost_children}>
        <Link to={`/profile/${_id}`}>
          <Avatar alt="avatar" src={avatar} />
        </Link>
        <input
          onClick={handleClickOpen}
          className={classes.addPost_children_input}
          placeholder="What's on your mind?"
        ></input>
      </div>
      <div onClick={handleClickOpen} className={classes.addPost_children}>
        <div className={classes.addPost_children_icon}>
          <ImageIcon />
          <div>Photo </div>
        </div>
        <div className={classes.addPost_children_icon}>
          <InsertEmoticonIcon />
          <div>Felling/Activity</div>
        </div>
        <div className={classes.addPost_children_icon}>
          <LocationOnIcon />
          <div>Check In</div>
        </div>
      </div>
      {/* upload image */}
      <Dialog
        classes={{ paper: classes.uploadImage }}
        onClose={handleClose}
        aria-labelledby="open upload image"
        open={open}
        fullScreen={true}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.uploadImage_form}
        >
          <div className={classes.uploadImage_form_header}>
            <div
              onClick={handleClose}
              className={classes.uploadImage_form_header_goback}
            >
              {" "}
              <ArrowBackIcon />
              Go Back
            </div>
            <input
              type="submit"
              className={classes.uploadImage_form_header_addPost}
              value="Add Post"
            />
          </div>
          <textarea
            type="textArea"
            name="text"
            placeholder="what's on your mind ?"
            className={classes.uploadImage_textarea}
            rows="4"
            ref={register({ required: false })}
          />

          <MultiImageInput
            images={images}
            setImages={setImages}
            max={5}
            allowCrop={false}
            theme="light"
          />
          <input
            type="submit"
            className={classes.uploadImage_addPost}
            value="Add Post"
          />
        </form>
      </Dialog>
    </Paper>
  );
}
