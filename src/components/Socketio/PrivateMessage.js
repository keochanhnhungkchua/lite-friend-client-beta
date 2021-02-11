import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilValue } from "recoil";
import MultiImageInput from "react-multiple-image-input";
import moment from "moment"
import {
  Paper,
  TextField,
  Tooltip,
  Avatar,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { PhotoCamera, Send, ArrowBack } from "@material-ui/icons/";
import { isMeRecoil } from "../Data/data";
import { joinRoom, leaveRoom, privateMessageSocketio, socket } from "../Data/socketio";
import { uploadImage } from "../Data/api"


const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: " #303f9f",
    color: "white",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    position: "fixed",
    width: "100%",
    fontWeight: "bold",
    zIndex: 1
  },
  userOnline: {
    color: "greenyellow",
    fontSize: "x-large"
  },
  listChat: {
    padding: "40px 0px",
  },
  isMe: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingLeft: 60,
  },
  reciverAvatar: {
    marginRight: 5,
  },
  textReciver: {
    padding: "0 5px",
    color: "black",
    backgroundColor: "#f1f0f0",
    borderRadius: 5,
    minWidth: 150,
    wordBreak: "break-all",
  },
  textIsMe: {
    padding: "0 15px",
    color: "white",
    backgroundColor: "#0084ff",
    borderRadius: 5,
    minWidth: 150,
    wordBreak: "break-all",
  },
  imgReciver: {
    width: "45%",
    paddingLeft: 20,
    marginTop: 5,
    borderRadius: 5,
    transitionDelay: '0.5s',
    "&:hover": {
      width: "90%",
    },
  },
  imgIsMe: {
    width: "45%",
    float: "right",
    paddingRight: 20,
    marginTop: 5,
    borderRadius: 5,
    "&:hover": {
      width: "90%",
    },
  },
  input: {
    flexGrow: 1,
    border: "solid 1px #e5e6e8",
    borderTopColor: "#888",
    borderRadius: 5,
    outline: "none",
  },
  form: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    borderTop: "solid 1px #ebedf0",
    backgroundColor: "#d7dbe07a",
    position: "fixed",
    width: "100%",
    bottom: -10,
  },
  button: {
    width: 48,
    minWidth: 48,
    color: "#999",
  },

  //upload image
  dialog: {
    margin: 0,
    width: "100%",
    height: "inherit",
  },
  formUploadImg: {
    margin: 5,
  },

  formUploadImgTextarea: {
    width: "100%",
    borderColor: "#aaa",
  },

  formUploadImgButoon: {
    width: "100%",
    backgroundColor: " #4080ff",
    border: "none",
    borderRadius: 5,
    height: 40,
    color: "white",
    fontWeight: "bold",
  },

  formUploadImgHeader: {
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

  formUploadImgSumit: {
    border: "none",
    borderLeft: "solid",
    background: "none",
    color: "white",
    fontWeight: "bold",
    paddingLeft: 5,
  },

  formUploadImgGoback: {
    display: "flex",
    alignItems: "center",
  },

}));

export default function PrivateMessage({ roomId, handleClosePrivateMassge, userOnline }) {
  const { register, handleSubmit, reset } = useForm();
  const classes = useStyles();
  const isMe = useRecoilValue(isMeRecoil);
  const [userRecive, setUserRecive] = useState("");
  const [massage, setMassage] = useState([]);
  const messagesEndRef = useRef(null);

  const [openLightTooltip, setOpenLightTooltip] = useState(false);
  const handleTooltipClose = () => {
    setOpenLightTooltip(false);
  };
  const handleTooltipOpen = (index) => {

    setOpenLightTooltip(index);
    console.log(index)
  };
  //upload image
  const [images, setImages] = useState({});
  const [open, setOpen] = useState(false);
  const handleClickOpenUploadImage = () => {
    setOpen(true);
  };
  const handleClickCloseUploadImage = () => {
    setOpen(false);
  };
  const onSubmit = async (e) => {
    setOpen(false);
    const file = Object.values(images);
    var data = {}
    if (file.length > 0 && e.text.trim().length > 0) {
      const imgUrl = await uploadImage(file);

      data = {
        text: e.text,
        imgUrl: imgUrl[0],
        roomId: roomId,
        createBy: isMe,
      };
    } else if (file.length > 0) {
      const imgUrl = await uploadImage(file);

      data = {
        imgUrl: imgUrl[0],
        roomId: roomId,
        createBy: isMe,
      };
    } else if (e.text.trim().length > 0) {
      data = {
        text: e.text,
        roomId: roomId,
        createBy: isMe,
      };
    } else {
      return
    }
    privateMessageSocketio(data);
    reset();
    setImages({});
  };

  useEffect(() => {
    joinRoom(roomId);
    async function getChat() {
      try {
        const { data } = await axios.get(`https://lite-friend.herokuapp.com/api/chat/room/${roomId}`);
        let userRecive = data.users.filter((user) => user._id !== isMe._id);
        setUserRecive(userRecive[0]);
        setMassage(data.chats);
      } catch (error) {
        console.error(error);
      }
    }
    getChat();
  }, [isMe._id, roomId]);//fix error of react hook : React Hook useEffect has a missing dependency...

  useEffect(() => {
    socket.on("privateMessageSocketio", (newMassage) => {
      setMassage((prev) => [...prev, newMassage]);
    });
    return () => {
      socket.off("privateMessageSocketio");
    };
  }, [])

  //auto scrollIntoView
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  });
  console.log(massage)
  return (
    <div>
      <Paper elevation={0}>
        <div
          className={classes.header}
          onClick={() => {
            handleClosePrivateMassge();
            leaveRoom(roomId);
          }}>
          <ArrowBack />
          <div className={
            userOnline.findIndex((id) =>
              userRecive._id === id) >= 0 ?
              classes.userOnline : ""}>
            {userRecive.name}</div>
          <div></div>
        </div>
        <List className={classes.listChat}>
          {massage.map(({ text, createBy, imgUrl, createdAt, _id }, index) => (
            <React.Fragment key={_id} >
              <ListItem
                className={createBy._id !== isMe._id ? "" : classes.isMe}
                button
              >
                {createBy._id !== isMe._id ? (
                  <Avatar
                    className={classes.reciverAvatar}
                    alt="reciver avatar"
                    src={createBy.avatar}
                  />
                ) : (" ")}
                <Paper
                  className={
                    createBy._id !== isMe._id ? classes.textReciver : classes.textIsMe
                  }
                >

                  <Tooltip
                    placement="left"
                    onClose={handleTooltipClose}
                    open={openLightTooltip === index ? true : false}
                    title={moment(createdAt).fromNow()}

                  >
                    <ListItemText onClick={() => handleTooltipOpen(index)}>{text}</ListItemText>
                  </Tooltip>

                </Paper>
              </ListItem>
              {imgUrl ? (
                <img
                  alt="imgUrl"
                  src={imgUrl}
                  className={
                    createBy._id !== isMe._id
                      ? classes.imgReciver
                      : classes.imgIsMe
                  }
                />
              ) : (
                  ""
                )}

            </React.Fragment>

          ))}
          <div ref={messagesEndRef} />
        </List>
        <form className={classes.form}
          onSubmit={handleSubmit(onSubmit)} >
          <label htmlFor="demo">
            <PhotoCamera
              className={classes.button}
              onClick={handleClickOpenUploadImage}
            />
          </label>
          <TextField
            className={classes.input}
            type="text"
            name="text"
            placeholder="Write a message..."
            inputRef={register({ required: true })}
            size="small"
            required={true}
          />

          <Button type="submit" className={classes.button}>
            <Send />
          </Button>
        </form>
      </Paper>
      <Dialog
        classes={{ paper: classes.dialog }}
        onClose={handleClickCloseUploadImage}
        aria-labelledby="form upload image"
        open={open}
        fullScreen={true}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formUploadImg}>
          <div className={classes.formUploadImgHeader}>
            <div
              onClick={handleClickCloseUploadImage}
              className={classes.formUploadImgGoback}
            >
              {" "}
              <ArrowBack />
              Go Back
            </div>
            <input type="submit" className={classes.formUploadImgSumit} value="Send" />
          </div>
          <textarea
            type="textArea"
            name="text"
            placeholder="what's on your mind ?"
            className={classes.formUploadImgTextarea}
            rows="4"
            ref={register({ required: false })}
          />
          <MultiImageInput
            images={images}
            setImages={setImages}
            max={1}
            allowCrop={false}
            theme="light"
          />
          <input type="submit" className={classes.formUploadImgButoon} value="Send" />
        </form>
      </Dialog>
    </div>
  );
}
