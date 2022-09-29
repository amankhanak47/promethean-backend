const express = require("express");
const AllEventsCollection = require("../Models/CreateEvent");
const EventCollection = require("../Models/Event");
const CordinatorCollection = require("../Models/Cordinator");
const cloudinary = require("./cloudinary");
const upload = require("./multer");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";
require("dotenv/config");

const fetchcordinator = (req, res, next) => {
  //get student from the jwt token and add to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.cordinator = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "some error occures" });
  }
};

// var upload = multer({ storage: storage });
router.post(
  "/event",
  upload.single("image"),
  [
    body(
      "eid",
      "event_name",
      "dept_name",
      "date",
      "time",
      "event_desc",
      "fee",
      "team",
      "faculty_cordinate",
      "faculty_number",
      "std_cordinator",
      "std_contact",
      "upi",
      "cord_email"
    ),
  ],
  fetchcordinator,
  async (req, res) => {
    try {
      const {
        eid,
        event_name,
        dept_name,
        date,
        time,
        event_desc,
        fee,
        team,
        faculty_cordinate,
        faculty_number,
        std_cordinator,
        std_contact,
        upi,
        cord_email,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const createevent = new AllEventsCollection({
        user: req.cordinator.id,
        eid,
        event_name,
        dept_name,
        date,
        time,
        event_desc,
        fee,
        team,
        faculty_cordinate,
        faculty_number,
        std_cordinator,
        std_contact,
        upi,
        cord_email,
        event_poster: result.secure_url,
      });
      const save_event = await createevent.save();
      console.log(createevent);

      res.json({ sucess: true, error: save_event });
      console.log("hjfjhy");
    } catch (error) {
      console.error(error);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

router.post(
  "/getallevents",

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      let allevents = await AllEventsCollection.find({});
      console.log(allevents);
      res.json(allevents);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

module.exports = router;
