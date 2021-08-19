const socket = io("/");
const newPeer = new Peer(undefined, {
  host: "/",
  port: "5001",
});

socket.emit("join", roomID, 10);

socket.on("new-user", (userID) => {
  console.log("New User ", userID);
});
