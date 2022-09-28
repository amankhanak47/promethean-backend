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

// Student Signup
router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name"),
    body("password"),
    // body("year"),
    body("phno"),
    body("college"),
    body("branch"),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let student = await StudentCollection.findOne({ email: req.body.email });
      if (student) {
        return res.status(400).json({
          sucess: sucess,
          errors: "sorry a user with this email already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      const otp = Math.floor(Math.random() * 1000000);

      //create ney user
      student = await StudentCollection.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
        college: req.body.college,
        phno: req.body.phno,
        // year: req.body.year,
        branch: req.body.branch,
        otp: otp,
      });

      const data = {
        user: {
          id: student.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//uthenticate a user "./api/auth/login"
//ROUte 2
router.post(
  "/login",
  [
    // body('name', 'Enter a valid name').isLength({min:5}),
    body("password", "password cannot be blank").exists(),

    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let student = await StudentCollection.findOne({ email });
      if (!student) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "eamil id is not registered" });
      }
      const passcompare = await bcrypt.compare(password, student.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "incorrect password" });
      }
      const data = {
        user: {
          id: student.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

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
    console.log(error)
    res.status(401).send({ error: "dont know" });
  }
};

router.post("/getstudent", fetchstudent, async (req, res) => {
  try {
    let studentId = req.student.id;
  

    const student = await StudentCollection.findById(studentId).select(
      "-password"
    );
    res.send(student);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});

router.post(
  "/addevent",
  [
    body(
      "event_id",
      "user_name",
      "user_email",
      "user_phno",
      "trans_id","img"
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
        trans_id,img
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({sucess:false, error: errors.array() });
      }

         var mailOptions = {
        from: "promethean2k22@bvrit.ac.in",
        to: "20211a05j2@bvrit.ac.in",
           subject: "img",
          html: `Embedded image: <img src=${img}/>`,
    attachments: [{
        filename: 'image.png',
        URL: img,
        cid: 'unique@kreata.ee' //same cid value as in the html img src
    }]
      };
      let sucess;
       var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "promethean2k22@bvrit.ac.in",
          pass: "bvrit@2K22",
        },
      });

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          (sucess = true),
            res
              .status(500)
              .json({ sucess: true, msg: "email sended sucessfully" });
          console.log("jh");
        }
      });



      const event = await new EventCollection({
        user: req.student.id,
        event_id:event_id,
       
        user_name:user_name,
        user_email:user_email,
        user_phno,
       trans_id
      });
console.log(event)
      const save_event = await event.save();

      res.json({ sucess: true, error: save_event });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ sucess: false, error: "some  error occured" });
    }
  }
);

router.get("/fetchallevents", fetchstudent, async (req, res) => {
  try {
    const event = await EventCollection.find({ user: req.student.id }).select("-img");
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

router.post("/fetchalleventswithid", body(
      "event_id"), async (req, res) => {
  try {
    const event = await EventCollection.find({ event_id: req.body.event_id }).select("-img");
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});



/// cordinator
router.post(
  "/cosignup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name"),
    body("password"),
    body("phno"),
    body("eid"),
    body("branch")
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess: sucess, errors: errors.array() });
    }

    //check email already exist or not
    try {
      let cordinator = await CordinatorCollection.findOne({ email: req.body.email });
      if (cordinator) {
        return res.status(400).json({
          sucess: sucess,
          error: "sorry a user with this email already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secpass = await bcrypt.hash(req.body.password, salt);
      const otp = Math.floor(Math.random() * 1000000);

      //create ney user
      cordinator = await CordinatorCollection.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
        phno: req.body.phno,
        otp: otp,
        eid:req.body.eid
      });

      const data = {
        user: {
          id: cordinator.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(cordinator)
      sucess = true;
      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//uthenticate a user "./api/auth/login"
//ROUte 2
router.post(
  "/cologin",
  [
    // body('name', 'Enter a valid name').isLength({min:5}),
    body("password", "password cannot be blank").exists(),

    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    let sucess = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let cordinator = await CordinatorCollection.findOne({ email });
      if (!cordinator) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "eamil id is not registered" });
      }
      const passcompare = await bcrypt.compare(password, cordinator.password);
      if (!passcompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess, errors: "incorrect password" });
      }
      const data = {
        user: {
          id: cordinator.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)
      sucess = true;

      res.json({ sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

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

router.post("/getcordinator", fetchcordinator, async (req, res) => {
  try {
    let cordinatorId = req.cordinator.id;
  

    const cordinator = await CordinatorCollection.findById(cordinatorId).select(
      "-password"
    );
    res.send(cordinator);
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error occured");
  }
});



module.exports = router;
