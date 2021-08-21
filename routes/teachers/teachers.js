const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Class = require("../../models/class");
const Meet = require("../../models/meet");
const Student = require("../../models/student");
const Teacher = require("../../models/teacher");

router.use("/auth", checkNotAuthenticated, require("./auth"));
router.use("/class", checkAuthenticated, require("./class"));
router.use("/create-student", checkAuthenticated, require("./stud-create"));
router.use("/create-meet", checkAuthenticated, require("./create-meet"));
router.use("/", checkAuthenticated, async (req, res) => {
  const teech = await Teacher.findById(req.user.id);
  const classes = await Class.find({ school: teech.school });
  const students = await Student.find({ school: teech.school });
  const meets = await Meet.find();

  res.render("teachers/dash", { classes, students, meets });
});

// MIDDLEWARE
function checkAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    res.redirect("/teacher/auth");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/teacher/auth");
      } else {
        req.user = user;
        next();
      }
    });
  }
}
function checkNotAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        next();
      } else {
        res.redirect("/");
        req.user = user;
      }
    });
  }
}

module.exports = router;
