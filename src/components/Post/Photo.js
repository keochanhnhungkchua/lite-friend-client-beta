import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar, Dialog } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { PostsRecoil } from "../Data/data";

const useStyles = makeStyles((theme) => ({
  viewPhoto: {
    margin: 0,
    width: "100%",
    backgroundColor: "#f0f2f5",
  },
  viewPhoto_goback: {
    fontWeight: "bold",
    display: "flex",
  },
  //show list photos
  gridList: {
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    paddingTop: 60,
    textAlign: "center",
  },
  MuiGridListTileBarTitle: {
    fontSize: "3rem",
    lineHeight: 50,
  },

}));

export default function Photos({ post }) {
  const classes = useStyles();
  const [images, setimages] = useState([]);
  const data = useRecoilValue(PostsRecoil);
  const [open, setOpen] = useState(false);

  const handStory = () => {
    setOpen(false);
  };
  const viewPhotos = (id) => {
    setimages([]);
    const converImgUrl = [];
    const { imgUrl } = data.find((item) => item._id === id);
    imgUrl.map((i) => {
      const m = { original: i };
      return converImgUrl.push(m);
    });
    setimages(converImgUrl);
    setOpen(true);
  };
  const id = post._id;
  return (
    <div>
      {/* view photo */}
      <Dialog classes={{ paper: classes.viewPhoto }}
        onClose={handStory} open={open}>
        <div onClick={handStory}
          className={classes.viewPhoto_goback}>
          <ArrowBackIcon /> Go Back
        </div>
        <ImageGallery
          showFullscreenButton={false}
          showPlayButton={false}
          showBullets={true}
          showIndex={true}
          showThumbnails={false}
          items={images}
        />
      </Dialog>
      {/* show list photos */}
      <GridList
        spacing={1}
        className={classes.gridList}
        onClick={() => viewPhotos(id)}
        key={id}
      >
        {post.imgUrl.map((photo, index) => {
          if (index < 3) {
            var featured = [];
            switch (post.imgUrl.length) {
              case 1:
                featured = [1];
                break;
              case 2:
                featured = [0, 0];
                break;
              default:
                featured = [1, 0, 0];
            }
            if (index < 2) {
              return (
                <GridListTile
                  key={index}
                  cols={featured[index] ? 2 : 1}
                  rows={featured[index] ? 2 : 1}
                >
                  <img src={photo} alt={index} />
                </GridListTile>
              );
            } else {
              return (
                <GridListTile
                  key={index}
                  cols={featured[index] ? 2 : 1}
                  rows={featured[index] ? 2 : 1}
                >
                  <img src={photo} alt={index} />
                  <GridListTileBar
                    title={
                      post.imgUrl.length === 3
                        ? " "
                        : "+" + (post.imgUrl.length - 3)
                    }
                    titlePosition="top"
                    actionPosition="left"
                    className={classes.titleBar}
                    classes={{ title: classes.MuiGridListTileBarTitle }}
                  />
                </GridListTile>
              );
            }
          } else {
            return null
            // fix error https://stackoverflow.com/questions/45014094/how-do-i-fix-expected-to-return-a-value-at-the-end-of-arrow-function-warning
          }
        })}
      </GridList>
    </div>
  );
}
