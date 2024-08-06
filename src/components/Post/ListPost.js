import React, { useEffect } from "react";
import axios from "axios";
import AddPost from "./AddPost";
import Post from "./Post";
import Story from "./Story";
import { useRecoilState } from "recoil";
import { PostsRecoil } from "../Data/data";

export default function ListPost() {
  const [posts, setPosts] = useRecoilState(PostsRecoil);
  useEffect(() => {
    let isSubscribed = true;
    async function getPost() {
      try {
        const { data } = await axios.get(
          "https://lite-friend-server.onrender.com/api/post"
        );
        if (isSubscribed) setPosts(data);
      } catch (error) {
        console.error(error);
      }
    }
    getPost();
    return () => {
      setPosts([]);
      isSubscribed = false;
    };
  }, [setPosts]);

  return (
    <div style={{ backgroundColor: " #f0f2f5" }}>
      <AddPost />
      <Story />
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
