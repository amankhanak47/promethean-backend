const mongoose = require("mongoose");
const { Schema } = mongoose;

const CordinatorSchema = new Schema({
  name: {
    type: String,
  },
  phno: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  otp: {
    type:String,
    },
    eid: {
      type:String
  },
  branch: {
      type:String
    }
});

module.exports = mongoose.model("cordinator", CordinatorSchema);
