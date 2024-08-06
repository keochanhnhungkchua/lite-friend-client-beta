import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Avatar,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  search: {
    // padding: "0px 20px"
  },
  search_list: {
    borderBottom: "solid 1px #aaaaaa1f",
  },
  search_list_button: {
    backgroundColor: "#ebedf0",
    marginRight: 10,
    "&:hover": { backgroundColor: "#b0a1a152" },
  },
  //form search
  input: {
    flexGrow: 1,
    border: "solid 1px #e5e6e8",
    backgroundColor: "#cccccc2e",
    borderRadius: 20,
    outline: "none",
  },
  form: {
    display: "flex",
    padding: 10,
    borderBottom: "solid 1px #aaaaaa96",
  },
  button: {
    minWidth: 60,
    color: "#555",
  },
  //other
  findEmpty: {
    padding: 20,
  },
}));

export default function Search() {
  const { register, handleSubmit, reset } = useForm();
  const classes = useStyles();
  const [search, setSearch] = useState([]);
  const [result, setResult] = useState(true);
  const onSubmit = async (e) => {
    try {
      const { data } = await axios.post(
        "https://lite-friend-server.onrender.com/api/user/search",
        e
      );

      if (data.success) {
        setResult(true);
        setSearch(data.user);
      } else {
        setResult(false);
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <List dense className={classes.search}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={classes.input}
          type="textarea"
          name="search"
          placeholder="Search..."
          ref={register({ required: true })}
        />

        <Button type="submit" className={classes.button}>
          Search
        </Button>
      </form>

      {result ? (
        search.map((people) => {
          return (
            <Link
              to={`/profile/${people._id}`}
              key={people._id}
              style={{ textDecoration: "none" }}
            >
              <ListItem button className={classes.search_list}>
                <ListItemAvatar>
                  <Avatar alt="avatar" src={people.avatar} />
                </ListItemAvatar>
                <ListItemText primary={people.name} />
              </ListItem>
            </Link>
          );
        })
      ) : (
        <div className={classes.findEmpty}>
          <h3>We didn't find any results</h3>
          Make sure everything is spelled correctly or try different keywords.
        </div>
      )}
    </List>
  );
}
