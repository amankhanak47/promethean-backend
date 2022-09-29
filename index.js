const connectToMongo = require("./database");
const express = require("express");

var cors = require("cors");

require("dotenv/config");


const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("promethean backened updated with mongoose 7");
});

app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

app.use("/auth", require("./routes/auth.js"));
app.use("/verify", require("./routes/sendmail.js"));
app.use("/add", require("./routes/addevent.js"));
app.use("/create", require("./routes/CreateEvents.js"));
connectToMongo();
app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
