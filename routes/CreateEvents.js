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
      let event = await AllEventsCollection.findOne({ user: req.cordinator.id });
      if (event) {
         return res
          .status(400)
          .json({ sucess: false, error: "already u have created event" });
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const createevent = new AllEventsCollection({
        user: req.cordinator.id,
        eid:eid+Date.now(),
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

router.post(
  "/geteventwithorg",
fetchcordinator,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess: false, error: errors.array() });
      }
      let orgevents = await AllEventsCollection.find({user:req.cordinator.id});
      console.log(orgevents);
      res.json(orgevents);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

router.put(
  "/updateevent",
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

      const updateevent = {};
      if (event_name) {
        updateevent.event_name=event_name
      }

      if (dept_name) {
        updateevent.dept_name=dept_name
      }

      if (date) {
        updateevent.date=date
      }

      if (time) {
        updateevent.time=time
      }

       if (std_cordinator) {
        updateevent.std_cordinator=std_cordinator
      }

      if (event_desc) {
        updateevent.event_desc=event_desc
      }

      if (fee) {
        updateevent.fee=fee
      }

      if (team) {
        updateevent.team=team
      }

      if (faculty_cordinate) {
        updateevent.faculty_cordinate=faculty_cordinate
      }

      if (faculty_number) {
        updateevent.faculty_number=faculty_number
      }

      if (std_contact) {
        updateevent.std_contact=std_contact
      }

      if (upi) {
        updateevent.upi=upi
      }
      updateevent.event_poster=result.secure_url




      let event = await AllEventsCollection.findByIdAndUpdate(req.body.id,{$set:updateevent});
      
console.log(event)
      res.json({ sucess: true, error: event });
      console.log("event")
    } catch (error) {
      console.error(error);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

module.exports = router;
