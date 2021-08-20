const express = require("express");
const router = express.Router();
const Student = require("../../models/student");
const Class = require("../../models/class");
const Teacher = require("../../models/teacher");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.user.id });
  const classes = await Class.find({ school: teacher.school });
  res.render("teachers/create-stud", { classes: classes });
});
router.post("/", async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.user.id });

  let body = req.body;

  let password = await bcrypt.hash(body.password, 10);

  let student = new Student({
    name: body.name,
    email: body.email,
    password: password,
    school: teacher.school,
    class: body.class,
  });

  try {
    await student.save();
    res.redirect("/teacher");
  } catch (err) {
    console.log(err);
    res.redirect("/err");
  }
});

module.exports = router;
