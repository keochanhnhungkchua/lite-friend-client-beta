import React, { useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { useForm } from "react-hook-form";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, TextField, Link } from "@material-ui/core";

import { PostsRecoil, isMeRecoil } from "../Data/data";

const useStyles = makeStyles((theme) => ({
  //add comment
  form: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10,
    borderBottom: "solid 1px #ebedf0",
    paddingBottom: 10,
  },
  form_input: {
    flexGrow: 1,
    margin: "0px 10px",
    backgroundColor: "#f0f2f5",
    borderRadius: "5px !important",
  },

  form_button: {
    border: "solid 1px #ddd",
    width: 48,
    minWidth: 48,
    color: "#999",
    backgroundColor: "#f0f2f5",
  },
  //show comments
  showComment: {
    display: "flex",
    marginBottom: 10,
    alignItems: "end",
  },
  showComment_viewMore: {
    color: "#aaa",
    cursor: "pointer",
  },
  showComment__name: {
    margin: "0px 5px 2px 10px",
  },
  showComment__text: {
    margin: "0px 5px 5px 5px",
    borderRadius: 10,
    paddingLeft: 7,
    backgroundColor: "#ebedf075",
  },
  showComment__reply: {
    marginLeft: 10,
    paddingRight: 5,
    fontWeight: "bold",
    color: "#ccd0d5",
    fontSize: 13,
  },
}));

export default function AddComment({ post }) {
  const classes = useStyles();
  const { register, handleSubmit, reset } = useForm();
  const [updateCommentPost, setUpdateCommentPost] = useRecoilState(PostsRecoil);
  const [viewMoreComment, setViewMoreComment] = useState(5);
  const { avatar } = useRecoilValue(isMeRecoil);

  const postComment = async (e) => {
    if (e.comment.trim()) {
      const { data } = await axios.post(
        `https://lite-friend-server.onrender.com/api/post/${post._id}/comment/`,
        e
      );
      reset();
      //update comment when in home page
      const postIndex = updateCommentPost.findIndex(
        (comment) => comment._id === post._id
      );
      const newComment = [...updateCommentPost];
      newComment.splice(postIndex, 1, data);
      setUpdateCommentPost(newComment);
    }
  };
  return (
    <div>
      {/* add comment */}
      <form className={classes.form} onSubmit={handleSubmit(postComment)}>
        <Avatar alt="avatar" src={avatar} />
        <TextField
          className={classes.form_input}
          placeholder="Write a comment..."
          variant="outlined"
          type="text"
          inputRef={register({ required: true })}
          name="comment"
          multiline
          rowsMax={3}
          size="small"
          autoFocus={true}
          required={true}
        />
        <Button type="submit" className={classes.form_button}>
          post
        </Button>
      </form>
      {/* show comments */}
      {post.comments.slice(0, viewMoreComment).map((comment) => (
        <div className={classes.showComment} key={comment._id}>
          <Avatar alt="avatar" src={comment.user.avatar} />
          <div>
            <h5 className={classes.showComment__name}>{comment.user.name}</h5>
            <p className={classes.showComment__text}>{comment.text}</p>
            <div>
              <Link underline="none" className={classes.showComment__reply}>
                {moment(comment.createdAt).fromNow()}
              </Link>
              <Link underline="none" className={classes.showComment__reply}>
                Like
              </Link>
              <Link underline="none" className={classes.showComment__reply}>
                Reply
              </Link>
              <Link underline="none" className={classes.showComment__reply}>
                More
              </Link>
            </div>
          </div>
        </div>
      ))}
      {post.comments.length > viewMoreComment ? (
        <div
          className={classes.showComment_viewMore}
          onClick={() => {
            setViewMoreComment(viewMoreComment + 5);
          }}
        >
          View{" "}
          {post.comments.length > 5
            ? post.comments.length - viewMoreComment
            : ""}{" "}
          more comments
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
