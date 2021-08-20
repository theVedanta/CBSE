const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.use("/auth", checkNotAuthenticated, require("./auth"));
router.use("/class", checkAuthenticated, require("./class"));
router.use("/create-student", checkAuthenticated, require("./stud-create"));
router.use("/create-meet", checkAuthenticated, require("./create-meet"));
router.use("/", checkAuthenticated, (req, res) => {
  res.render("teachers/dash");
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
