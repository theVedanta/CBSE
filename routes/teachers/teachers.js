const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.use("/auth", checkNotAuthenticated, require("./auth"));
router.get("/auth/logout", checkAuthenticated, (req, res) => {
  res.clearCookie("auth-token").redirect("/");
});

// MIDDLEWARE
function checkAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    res.redirect("/teacher/auth/login");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect("/teacher/auth/login");
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
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
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
