import io from "socket.io-client";
const token = localStorage.getItem("lite-friend")
  ? localStorage.getItem("lite-friend")
  : false;
export const socket = io("https://lite-friend-server.onrender.com", {
  query: "token=" + token,
});

/**CHAT**/
//start the connection
export function startIOConnection() {
  socket.connect();
}

export const joinRoom = (roomId) => {
  socket.emit("joinRoom", roomId);
};
export const leaveRoom = (roomId) => {
  socket.emit("leaveRoom", roomId);
};
export const privateMessageSocketio = (data) => {
  socket.emit("privateMessageSocketio", data);
};

export const getOnlineUsers = () => {
  socket.on("Server-send-user-online", (data) => data);
};
