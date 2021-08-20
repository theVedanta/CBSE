const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Meet = require("../../models/meet");
const Student = require("../../models/student");

router.use("/auth", checkNotAuthenticated, require("./auth"));
router.get("/meets", checkAuthenticated, async (req, res) => {
  const student = await Student.findById(req.user.id);
  const meets = await Meet.find({ class: student.class });

  res.render("students/meets", { meets: meets });
});

// MIDDLEWARE
function checkAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    res.redirect("/student/auth");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/student/auth");
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
