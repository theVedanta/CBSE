if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const dbURI = process.env.DB_URL;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const uuid = require("uuid");
const Teacher = require("./models/teacher");

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
app.use("/teacher", require("./routes/teachers/teachers"));
app.use("/student", require("./routes/students/students"));
app.use("/job", (req, res) => {
  res.render("job-offers");
});

app.use("/ebooks", (req, res) => {
  res.render("ebooks");
});

// app.use("/teacher")

app.get("/meet/:room", checkMeetAuth, async (req, res) => {
  const teacher = await Teacher.findById(req.user.id);
  res.render("room", {
    roomID: req.params.room,
    userID: uuid.v4(),
    teech: teacher ? true : false,
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("auth-token").redirect("/");
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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("*", (req, res) => {
  res.render("404");
});

// middleware
function checkMeetAuth(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    res.redirect("/");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/");
      } else {
        req.user = user;
        next();
      }
    });
  }
}
