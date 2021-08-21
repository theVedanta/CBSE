const express = require("express");
const router = express.Router();
const Class = require("../../models/class");
const Teacher = require("../../models/teacher");

router.get("/create", (req, res) => {
  res.render("teachers/create-class");
});
router.post("/create", async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.user.id });

  const newClass = new Class({
    name: req.body.name,
    description: req.body.description,
    school: teacher.school,
  });

  try {
    await newClass.save();
    res.redirect("/teacher");
  } catch (err) {
    console.log(err);
    res.redirect("/err");
  }
});

module.exports = router;
