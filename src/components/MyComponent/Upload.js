import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from "recoil"
import axios from "axios";
import { useForm } from "react-hook-form";
import MultiImageInput from "react-multiple-image-input";

import { ArrowBack } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles";
import { TextField, } from "@material-ui/core"

import { uploadImage } from "../Data/api"
import { isMeRecoil, } from "../Data/data"
const useStyles = makeStyles((theme) => ({
    uploadStory: {
        margin: 5,
    },
    uploadStory_button: {
        width: "100%",
        backgroundColor: " #4080ff",
        border: "none",
        borderRadius: 5,
        height: 40,
        marginTop: "10",
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

}));


export function UpdateCoverAvatar({ closeUpdateCoverAvatar, change }) {
    const { handleSubmit, reset } = useForm();
    const classes = useStyles();
    const [images, setImages] = useState({});
    const setUser = useSetRecoilState(isMeRecoil);
    const onSubmit = async (info) => {
        const file = Object.values(images);
        if (file.length !== 0) {
            const imgUrl = await uploadImage(file)
            if (change === "cover") {
                const { data } = await axios.post("https://lite-friend.herokuapp.com/api/user/changeCover", { cover: imgUrl[0] });
                setUser(data);
            } else {
                const { data } = await axios.post("https://lite-friend.herokuapp.com/api/user/changeCover", { avatar: imgUrl[0] });
                setUser(data);
            }

            closeUpdateCoverAvatar();
            setImages({});
        }
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.uploadStory}>
            <div className={classes.uploadStory_header}>
                <div onClick={() => closeUpdateCoverAvatar()} className={classes.uploadStory_goback}>
                    {" "}
                    <ArrowBack />
                Go Back
              </div>
                <input
                    type="submit"
                    className={classes.uploadStory_addStory}
                    value="Update"
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
                value="Update"
            />
        </form>
    )
}



export function UpdateInfo({ closeUpdateCoverAvatar }) {

    const { register, handleSubmit, reset } = useForm();
    const [user, setUser] = useRecoilState(isMeRecoil);
    const classes = useStyles();
    const { userInfo } = user
    const onSubmit = async (infoUpdate) => {
        const { data } = await axios.post("https://lite-friend.herokuapp.com/api/user/changeCover", { userInfo: infoUpdate });
        setUser(data);
        closeUpdateCoverAvatar();
        reset()
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.uploadStory}>
            <div className={classes.uploadStory_header}>
                <div onClick={() => closeUpdateCoverAvatar()} className={classes.uploadStory_goback}>
                    {" "}
                    <ArrowBack />
                Go Back
              </div>
                <input
                    type="submit"
                    className={classes.uploadStory_addStory}
                    value="Update"
                />
            </div>
            <h3>Your Name : {user.name}</h3>
            <TextField
                label="Studied at"
                name="studiedAt"
                defaultValue={userInfo.studiedAt === "undefined" ? "" : userInfo.studiedAt}
                type="text"
                fullWidth={true}
                inputRef={register}
            />
            <TextField
                label="Live In"
                name="liveIn"
                defaultValue={userInfo.liveIn === "undefined" ? "" : userInfo.liveIn}
                type="text"
                fullWidth={true}
                inputRef={register} />
            <TextField
                label="Form"
                name="from"
                defaultValue={userInfo.form === "undefined" ? "" : userInfo.from}
                type="text"
                fullWidth={true}
                inputRef={register} />
            <TextField
                label="Age"
                name="age"
                type="number"
                defaultValue={userInfo.age === "undefined" ? "" : userInfo.age}
                size="small"
                fullWidth={true}
                inputRef={register} />
            <input
                type="submit"
                className={classes.uploadStory_button}
                value="Update"
            />
        </form>


    )
}
