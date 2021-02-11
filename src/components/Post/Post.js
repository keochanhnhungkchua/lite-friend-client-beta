import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import {
  Card, Menu,
  MenuItem,
  CardHeader,
  Collapse,
  Avatar,
  Button,
  Dialog,
  TextField
} from "@material-ui/core";
import {
  MoreHoriz,
  ThumbUpOutlined,
  ChatBubbleOutlineOutlined,
  ShareOutlined,
  ThumbUpAltSharp
} from "@material-ui/icons";
import Photos from "./Photo";
import Comment from "./Comment";

import { PostsRecoil, isMeRecoil } from "../Data/data";
const useStyles = makeStyles((theme) => ({
  Post: {
    marginBottom: 10,
    padding: "0 5px",
  },
  Post__action: {
    padding: "1px 6px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#aaaaaa38",
      borderRadius: 30
    }
  },
  Post__title: {
    fontWeight: "bold",
  },
  Post_text: {
    padding: "0px 10px"
  },
  Post_text_text: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "2",
    overflow: "hidden",
    wordBreak: "break-word",
  },
  Post_text_seeMore: {
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 5
  },
  Post_actionInfo: {
    display: "flex",
    justifyContent: "space-around",
    margin: 8,
    paddingLeft: 35,
    color: "#979aa0",
  },
  Post_action: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "solid 1px #f3f3f4",
    margin: 10,
    padding: 5,
    color: "#6a6f78",
  },
  Post_action_icon: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  featureNotYet: {
    textDecoration: "line-through"
  },
  //edit posts
  editPost_button: {
    display: "flex"
  },
  editPost_button_textField: {
    width: "-webkit-fill-available",
    margin: 8
  },
  editPost_button_button: {
    width: "48%",
    margin: 5,
    backgroundColor: "#2141b1",
    color: "white",
    '&:hover': {
      backgroundColor: '#0629a2',
    }
  }
}));

export default function Post({ post }) {
  const classes = useStyles();
  const { register, handleSubmit, reset } = useForm();

  const [like, setLike] = useRecoilState(PostsRecoil);
  const isMeId = useRecoilValue(isMeRecoil)._id;
  const time = moment(post.createdAt).fromNow();

  const [text, setText] = useState("");
  const [editPost, setEditPost] = useState(false);//set open close edit post
  const [openComment, setOpenComment] = useState(false);// set open close comment
  const [showText, setShowText] = useState(false);// set view see more text in post
  const [deletePost, setDeletePost] = useState(false);// set open close delete post

  const handleClick = (event) => {
    if (isMeId === post.user._id) {
      event.stopPropagation();
      setDeletePost(event.currentTarget);
    }
  };
  const handleClose = () => {
    setDeletePost(false);
  };
  const likeAndUnlike = async () => {
    const { data } = await axios.get(
      `https://lite-friend.herokuapp.com/api/post/${post._id}/like/`
    );
    const index = like.findIndex((like) => like._id === post._id);
    const newLike = [...like];
    newLike.splice(index, 1, data);
    setLike(newLike);
  };

  const deletePostFunciton = async (event) => {
    setDeletePost(false);
    try {
      const { data } = await axios.delete(
        `https://lite-friend.herokuapp.com/api/post/${post._id}/`
      );
      if (data.success) {
        const result = like.filter((item) => item._id !== post._id);
        setLike(result)
      }
    } catch (error) {
      console.log(error);
    }
  };
  //edit post
  const openEditPost = () => {
    setDeletePost(false);
    setText(post.text);
    setEditPost(true);
  };
  const editPostFunction = async (e) => {
    setText(e.text)
    try {
      const { data } = await axios.put(
        `https://lite-friend.herokuapp.com/api/post/${post._id}/`, e
      );
      if (data.success) {
        const index = like.findIndex((like) => like._id === post._id);
        const newLike = [...like];
        newLike.splice(index, 1, data.post);
        setLike(newLike);
      }
    } catch (error) {
      console.log(error);
    }
    reset()
    setEditPost(false);
  };


  return (
    <Card className={classes.Post}>
      <CardHeader
        classes={{
          title: classes.Post__title,
          action: classes.Post__action
        }}
        avatar={
          <Link to={`/profile/${post.user._id}`}>
            <Avatar
              aria-label="avatar"
              src={post.user.avatar}
            />
          </Link>
        }
        action={<MoreHoriz onClick={handleClick} />}
        title={<Link to={`/profile/${post.user._id}`}>{post.user.name}</Link>}
        subheader={time}
      />
      <Menu
        anchorEl={deletePost}
        keepMounted
        open={Boolean(deletePost)}
        onClose={handleClose}
      >
        <MenuItem onClick={openEditPost}>Edit post </MenuItem>
        <MenuItem onClick={deletePostFunciton}>Delete post</MenuItem>
        <MenuItem onClick={handleClose}
          className={classes.featureNotYet}>
          Save link
           </MenuItem>
        <MenuItem onClick={handleClose} className={classes.featureNotYet}>Hide from profile</MenuItem>
        <MenuItem onClick={handleClose} className={classes.featureNotYet}>View edit history</MenuItem>
        <MenuItem onClick={handleClose} className={classes.featureNotYet}>Edit Privacy</MenuItem>
        <MenuItem onClick={handleClose} className={classes.featureNotYet}>
          Turn on notifications for this post
        </MenuItem>
      </Menu>
      <Dialog onClose={() => setEditPost(false)}
        aria-labelledby="edit post"
        open={editPost}
        fullWidth={true}
      >
        <form onSubmit={handleSubmit(editPostFunction)}>
          <TextField
            className={classes.editPost_button_textField}
            variant="outlined"
            type="text"
            inputRef={register({ required: true })}
            name="text"
            multiline
            rowsMax={3}
            size="medium"
            margin="normal"
            autoFocus={true}
            required={true}
            value={text}
            onChange={(e) => setText(e.text)}
          />
          <div className={classes.editPost_button}>
            <Button
              className={classes.editPost_button_button}
              type="submit">
              Update
            </Button>
            <Button
              className={classes.editPost_button_button}
              onClick={() => setEditPost(false)}>
              Cancel
              </Button>
          </div>
        </form>
      </Dialog>
      <div className={classes.Post_text}>
        <div className={showText ? "" : classes.Post_text_text}>{post.text}</div>
        <Collapse
          in={post.text.length > 100 ? !showText : false}
          timeout={1}
          className={classes.Post_text_seeMore}
          onClick={() => setShowText(!showText)}
        >
          See More
        </Collapse>
      </div>
      <Photos post={post} />
      <div className={classes.Post_actionInfo}>
        <div> {post.likes.length} </div>
        <div> {post.comments.length} </div>
        <div> {post.share} Shares </div>
      </div>
      <div className={classes.Post_action}>
        <span className={classes.Post_action_icon} onClick={likeAndUnlike}>
          {post.likes.includes(isMeId) ? (
            <div className={classes.Post_action_icon} style={{ color: "blue" }}>
              {" "}
              <ThumbUpAltSharp /> Like{" "}
            </div>
          ) : (
              <div className={classes.Post_action_icon}>
                {" "}
                <ThumbUpOutlined /> Like{" "}
              </div>
            )}
        </span>
        <span
          className={classes.Post_action_icon}
          onClick={() => setOpenComment(!openComment)}
          aria-label="show comment on post"
        >
          <ChatBubbleOutlineOutlined /> Comment
        </span>

        <span className={classes.Post_action_icon}>
          <ShareOutlined />
          Share
        </span>
      </div>
      <Collapse in={openComment} timeout="auto" unmountOnExit>
        <Comment post={post} />
      </Collapse>
    </Card>
  );
}