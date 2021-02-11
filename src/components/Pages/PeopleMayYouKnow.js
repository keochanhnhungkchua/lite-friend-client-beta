import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  peopleMayYouKnow: {
    padding: "0px 20px"
  },
  peopleMayYouKnow_list: {
    borderBottom: "solid 1px #aaaaaa1f"
  },
  peopleMayYouKnow_list_button: {
    backgroundColor: "#ebedf0",
    marginRight: 10,
    "&:hover": { backgroundColor: "#b0a1a152" }
  }
}));

export default function PeopleMayYouKnow() {
  const classes = useStyles();
  const [peopleMayYouKnow, setPeopleMayYouKnow] = useState([]);
  useEffect(() => {
    let isSubscribed = true
    async function getUser() {
      try {
        const { data } = await axios.get("https://lite-friend.herokuapp.com/api/user/");
        if (isSubscribed) setPeopleMayYouKnow(data);

      } catch (error) {
        console.error(error);
      }
    }
    getUser();
    return () => isSubscribed = false
  }, []);
  const addFriend = async (id) => {
    try {
      const { data } = await axios.get(`https://lite-friend.herokuapp.com/api/user/addFriend/${id}/`);
      if (data.success) {
        const newData = peopleMayYouKnow.filter((people) => people._id !== id)
        setPeopleMayYouKnow(newData);
      }

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <List dense className={classes.peopleMayYouKnow}>
      <h3>People May You Know :</h3>
      {peopleMayYouKnow.map((people) => {
        return (

          <ListItem key={people._id} button className={classes.peopleMayYouKnow_list}>
            <Link to={`/profile/${people._id}`} key={people._id} >
              <ListItemAvatar>
                <Avatar
                  alt="avatar"
                  src={people.avatar}
                />
              </ListItemAvatar>
            </Link>
            <ListItemText primary={people.name} />

            <ListItemSecondaryAction>
              <Button
                onClick={() => addFriend(people._id)}
                className={classes.peopleMayYouKnow_list_button}>
                Add Friend
              </Button>
              <Button className={classes.peopleMayYouKnow_list_button}>
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
