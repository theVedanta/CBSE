const socket = io("/");
const newPeer = new Peer(userIDf, {
  host: "/",
  port: "5001",
});
const peers = {};

newPeer.on("open", (id) => {
  socket.emit("join", roomID, id);
});

// video
const grid = document.querySelector(".video-grid");
const userVideo = document.createElement("video");
const shareVideo = document.querySelector(".share video");
userVideo.muted = true;

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  grid.append(video);
}

async function videoSetup() {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  addVideoStream(userVideo, stream);

  socket.on("new-user", (userID) => {
    connectToNewUser(userID, stream);
  });

  newPeer.on("call", (call) => {
    call.answer(stream);

    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });

  //  ---------------------------------------------------------------- (stop audio and video)
  for (let track of stream.getTracks()) {
    if (track.kind === "audio") {
      track.stop();
    }
  }
}
videoSetup();

function connectToNewUser(userID, stream) {
  const call = newPeer.call(userID, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userID] = call;
}

// disconnected
socket.on("disconnected", (userID) => {
  if (peers[userID]) peers[userID].close();
});

// ---------------------------------------------------------------- Screen share click
document.querySelector(".share-btn").addEventListener("click", async () => {
  const screen = await navigator.mediaDevices.getDisplayMedia();
  addVideoStream(shareVideo, screen);
});
