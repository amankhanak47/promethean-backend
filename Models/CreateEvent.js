const mongoose = require("mongoose");
const { Schema } = mongoose;

const CreateEvents = new Schema({
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cordinator",
  },
  eid: {
    type: String,
  },
  event_poster: {
    type: String,
  },
  event_name: {
    type: String,
  },
  dept_name: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  event_desc: {
    type: String,
  },
  fee: {
    type: String,
  },
  team: {
    type: String,
  },
  faculty_cordinate: {
    type: String,
  },
  faculty_number: {
    type: String,
  },
  std_cordinator: {
    type: String,
  },
  std_contact: {
    type: String,
  },
  upi: {
    type: String,
  },
  cord_email: {
    type: String,
  },
});

module.exports = mongoose.model("allevents", CreateEvents);
