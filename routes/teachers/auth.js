require("dotenv").config();
const express = require("express");
const router = express.Router();
const Teacher = require("../../models/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.render("teachers/auth", { message: false });
});

// REGISTER
router.post("/register", async (req, res) => {
  let body = req.body;

  let password = await bcrypt.hash(body.password, 10);

  let teacher = new Teacher({
    name: body.name,
    email: body.email,
    password: password,
    school: body.school,
  });

  try {
    await teacher.save();
  } catch (err) {
    res.redirect("/err");
  }

  let gotUser = await Teacher.findOne({ email: body.email });
  let userToSign = {
    id: gotUser._id,
  };

  const accessToken = jwt.sign(userToSign, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res
    .cookie("auth-token", accessToken, { maxAge: 172800000 })
    .redirect("/teacher");
});

// LOGIN
router.post("/login", async (req, res) => {
  let body = req.body;
  const userFound = await Teacher.findOne({ email: body.email });

  if (!userFound) {
    res.render("teachers/auth", { message: "No User found" });
  } else {
    let user = {
      id: userFound._id,
    };
    if (await bcrypt.compare(body.password, userFound.password)) {
      const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res
        .cookie("auth-token", accessToken, { maxAge: 2592000000 })
        .redirect("/teacher");
    } else {
      res.render("teachers/auth", { message: "Incorrect Password" });
    }
  }
});

module.exports = router;
