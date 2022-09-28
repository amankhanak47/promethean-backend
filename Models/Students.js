const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
  },
  year: {
    type: String,
  },
  phno: {
    type: String,
  },
  branch: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  college: {
    type: String,
  },
  otp: {
    type:String,
  }
});

module.exports = mongoose.model("student", StudentSchema);
