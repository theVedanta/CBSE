require("dotenv").config();
const express = require("express");
const router = express.Router();
const Student = require("../../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.render("students/auth", { message: false });
});

// LOGIN
router.post("/login", async (req, res) => {
  let body = req.body;
  const userFound = await Student.findOne({ email: body.email });

  if (!userFound) {
    res.render("students/auth", { message: "No User found" });
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
        .redirect("/");
    } else {
      res.render("students/auth", { message: "Incorrect Password" });
    }
  }
});

module.exports = router;
