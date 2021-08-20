if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const dbURI = process.env.DB_URL;
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const uuid = require("uuid");

const authRoute = require("./middleware/authRoute");

// DB CONNECTION
async function connectDB() {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  server.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}
connectDB();

// SETTINGS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// ROUTES
// app.use("/teachers", require("routes/teachers"));
// app.use("/students", require("routes/students"));

app.use("/auth", require("./routes/Auth"));

app.get("/class", (req, res) => {
  res.redirect(`/class/${uuid.v4()}`);
});
app.get("/class/:room", (req, res) => {
  res.render("room", { roomID: req.params.room, userID: uuid.v4() });
});

io.on("connection", (socket) => {
  socket.on("join", (roomID, userID) => {
    socket.join(roomID);
    socket.broadcast.to(roomID).emit("new-user", userID);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomID).emit("disconnected", userID);
    });
  });
});

// ERRORS
app.get("/err", (req, res) => {
  res.json({ Error: "Some error has occurred" });
});
app.get("*", (req, res) => {
  res.render("404");
});
