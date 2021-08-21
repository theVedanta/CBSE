const socket = io("/");
const newPeer = new Peer(userIDf, {
  secure: true,
  host: "peer-for-cbse.herokuapp.com",
  port: "443",
});
const peers = {};

newPeer.on("open", (id) => {
  socket.emit("join", roomID, id);
});

if (teech === "false") {
  document.querySelector(".share-btn").remove();
}

// video
const grid = document.querySelector(".video-grid");
const userVideo = document.createElement("video");
const shareVideo = document.querySelector(".share video");
userVideo.muted = true;

function addVideoStream(video, stream) {
  video.srcObject = stream;
  if (teech === "true") {
    video.classList.add("teech");
  }
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
    console.log("Arrived");
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
  document.querySelector("#mic").addEventListener("click", () => {
    if (document.querySelector("#mic").classList.contains("active")) {
      for (let track of stream.getTracks()) {
        if (track.kind === "audio") {
          track.enabled = false;
        }
      }
    } else {
      for (let track of stream.getTracks()) {
        if (track.kind === "audio") {
          track.enabled = true;
        }
      }
    }

    document.querySelector("#mic").classList.toggle("active");
  });

  document.querySelector("#vid").addEventListener("click", () => {
    if (document.querySelector("#vid").classList.contains("active")) {
      for (let track of stream.getTracks()) {
        if (track.kind === "video") {
          track.enabled = false;
        }
      }
    } else {
      for (let track of stream.getTracks()) {
        if (track.kind === "video") {
          track.enabled = true;
        }
      }
    }

    document.querySelector("#vid").classList.toggle("active");
  });
}
videoSetup();

function connectToNewUser(userID, stream) {
  const call = newPeer.call(userID, stream);
  const video = document.createElement("video");
  console.log("called");
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
if (document.querySelector(".share-btn")) {
  document.querySelector(".share-btn").addEventListener("click", async () => {
    document.querySelector(".teech").classList.remove("teech");
    const screen = await navigator.mediaDevices.getDisplayMedia();
    addVideoStream(shareVideo, screen);
  });
}
