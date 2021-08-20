require("dotenv").config();
const express = require("express");
const router = express.Router();
// const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const getUserID = require("../middleware/getUserID");

router.get("/", (req, res) => {
    res.send("teachers");
})

router.get("/ebooks", (req, res) => {
    res.send(" teacher ebooks");
})

router.get("/profile", (req, res) => {
    res.send("teacher profile");
})

module.exports = router;