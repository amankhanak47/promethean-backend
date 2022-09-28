const express = require("express");
const router = express.Router();
const StudentCollection = require("../Models/Students");
const CordinatorCollection = require("../Models/Cordinator");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Student Signup
router.post(
  "/sendotp",
  [body("email", "Enter a valid Email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let student = await StudentCollection.findOne({ email: req.body.email });
      if (!student) {
        return res.status(500).json({
          sucess: false,
          error: "your email id is not registered",
        });
      }

      const otp = Math.floor(Math.random() * 1000000);
      student.otp = otp;
      await student.save();
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "promethean2k22@bvrit.ac.in",
          pass: "bvrit@2K22",
        },
      });

      var mailOptions = {
        from: "promethean2k22@bvrit.ac.in",
        to: req.body.email,
        subject: "Email verification",
        html: `<h3>Your Otp is <h1>${otp}</h1></h3>`,
      };
      let sucess;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          (sucess = true),
            res
              .status(500)
              .json({ sucess: true, msg: "email sended sucessfully" });
          console.log(student.otp);
        }
      });
    } catch (error) {
      sucess = false;
      res.status(500).send({ sucess: sucess, error: "some error occured" });
    }
  }
);

router.post("/checkotp", [body("otp"), body("password")], async (req, res) => {
  const errors = validationResult(req);
  let sucess = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ sucess: sucess, errors: errors.array() });
  }

  //check email already exist or not
  try {
    let student = await StudentCollection.findOne({ otp: req.body.otp });
    if (!student) {
      return res.status(500).json({
        sucess: false,
        error: "Invalid OTP",
      });
    }
    const salt = await bcrypt.genSalt(10);
    secpass = await bcrypt.hash(req.body.password, salt);
    const otp = Math.floor(Math.random() * 1000000);
    student.otp = otp;
    student.password = secpass;
    await student.save();
    res.status(500).json({ sucess: true, msg: "Password sucessfully Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, error: "some error occured" });
  }
});

router.post(
  "/cord_sendotp",
  [body("email", "Enter a valid Email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let cordinator = await CordinatorCollection.findOne({
        email: req.body.email,
      });
      if (!cordinator) {
        return res.status(500).json({
          sucess: false,
          error: "your email id is not registered",
        });
      }

      const otp = Math.floor(Math.random() * 1000000);
      cordinator.otp = otp;
      await cordinator.save();
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "promethean2k22@bvrit.ac.in",
          pass: "bvrit@2K22",
        },
      });

      var mailOptions = {
        from: "promethean2k22@bvrit.ac.in",
        to: req.body.email,
        subject: "Email verification",
        html: `<h3>Your Otp is <h1>${otp}</h1></h3>`,
      };
      let sucess;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          (sucess = true),
            res
              .status(500)
              .json({ sucess: true, msg: "email sended sucessfully" });
          console.log(cordinator.otp);
        }
      });
    } catch (error) {
      sucess = false;
      res.status(500).send({ sucess: sucess, error: "some error occured" });
    }
  }
);

router.post(
  "/cord_checkotp",
  [body("otp"), body("password")],
  async (req, res) => {
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let cordinator = await CordinatorCollection.findOne({
        otp: req.body.otp,
      });
      if (!cordinator) {
        return res.status(500).json({
          sucess: false,
          error: "Invalid OTP",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      const otp = Math.floor(Math.random() * 1000000);
      cordinator.otp = otp;
      cordinator.password = secpass;
      await cordinator.save();
      res
        .status(500)
        .json({ sucess: true, msg: "Password sucessfully Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ sucess: false, error: "some error occured" });
    }
  }
);

module.exports = router;
