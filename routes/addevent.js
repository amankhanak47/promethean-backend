const express = require("express");
const StudentCollection = require("../Models/Students");
const EventCollection = require("../Models/Event");
const CordinatorCollection = require("../Models/Cordinator");
const cloudinary = require("./cloudinary");
const upload = require("./multer");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";
require("dotenv/config");

const fetchstudent = (req, res, next) => {
  //get student from the jwt token and add to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.student = data.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "dont know" });
  }
};

router.post(
  "/event",
  upload.single("image"),
  [
    body(
      "event_id",
      "user_name",
      "user_email",
      "user_phno",
      "event_name",
      "event_time",
      "event_date",
      "event_poster",
      "team"
    ),
  ],
  fetchstudent,
  async (req, res) => {
    try {
      const {
        event_id,
        user_name,
        user_email,
        user_phno,
        event_name,
        event_time,
        event_date,
        event_poster,team
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      // let regevent = await EventCollection.find({ $and: [{ email: user_email, event_id: event_id }] })
      // if (regevent!="") {
      //   console.log(regevent)
      //    return res.status(400).json({
      //     sucess: false,
      //     error: "sorry You have already registered with this email",
      //   });
      // }
      const result = await cloudinary.uploader.upload(req.file.path);
      const event = new EventCollection({
        user: req.student.id,
        event_id: event_id,
        img: result.secure_url,
        user_name: user_name,
        user_email: user_email,
        user_phno,
        event_name,
        event_time,
        event_date,
        event_poster,
        team
      });
      console.log(event);
      const save_event = await event.save();

      res.json({ sucess: true, error: save_event });
      console.log("first");
    } catch (error) {
      console.error(error);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

router.post(
  "/get_student_img",
  [body("event_id", "user_email")],
  async (req, res) => {
    try {
      const { event_id, user_email } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      let img = await EventCollection.find({
        user_email: user_email,
        event_id: event_id,
      });
      console.log(img,"sdf");
      res.json(img);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

module.exports = router;
