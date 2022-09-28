const express = require("express");
const StudentCollection = require("../Models/Students");
const EventCollection = require("../Models/Event");
const CordinatorCollection = require("../Models/Cordinator");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";
var nodemailer = require("nodemailer");
var fs = require("fs");
var path = require("path");
require("dotenv/config");

var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null,Date.now()+ file.originalname);
  },
});

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

var upload = multer({ storage: storage });
router.post(
  "/event",
  upload.single("image"),
  [body("event_id", "user_name", "user_email", "user_phno", "trans_id")],
  fetchstudent,
  async (req, res) => {
    try {
      const { event_id, user_name, user_email, user_phno, trans_id} =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      const event = await new EventCollection({
        user: req.student.id,
        event_id: event_id,
        img:req.file.filename,
        user_name: user_name,
        user_email: user_email,
        user_phno,
        trans_id,
      });
      console.log(event);
      const save_event = await event.save();

      res.json({ sucess: true, error: save_event });
      console.log("first")
    } catch (error) {
      console.error(error.message);
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
      console.log(img);
      res.json(img);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);



module.exports = router;
