const express = require("express");
const router = express.Router();
const Meet = require("../../models/meet");
const Class = require("../../models/class");
const Teacher = require("../../models/teacher");

router.get("/", async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.user.id });
  const classes = await Class.find({ school: teacher.school });
  res.render("teachers/create-meet", { classes: classes });
});
router.post("/", async (req, res) => {
  const body = req.body;

  const meet = new Meet({
    name: body.name,
    class: body.class,
    time: body.time,
    subject: body.subject,
    studentsPresent: [],
  });

  try {
    await meet.save();
    res.redirect("/teacher");
  } catch (err) {
    res.redirect("/err");
  }
});

module.exports = router;
