import { selector, atom } from "recoil";
const axios = require("axios");
const token = localStorage.getItem("lite-friend");
axios.defaults.baseURL = "https://lite-friend.herokuapp.com/api";

export const isMeRecoilState = selector({
  key: "isMeRecoilState",
  get: async () => {
    const { data } = await axios.get("/user/me");
    return data;
  },
});
export const isMeRecoil = atom({
  key: "isMeRecoil",
  default: isMeRecoilState,
});

const getnotification = selector({
  key: "getnotification",
  get: ({ get }) => {
    if (token)
      return get(isMeRecoilState).notifications
  }
});
export const notificationsRecoil = atom({
  key: "notificationsRecoil",
  default: getnotification,
})

export const PostsRecoil = atom({
  key: "PostsRecoil",
  default: [],
});
export const mm = atom({
  key: "mm",
  default: [],
});