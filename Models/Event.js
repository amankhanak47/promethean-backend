const mongoose = require("mongoose");
const { Schema } = mongoose;

const Events = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  event_id: {
    type: String,
  },
  user_name: {
    type: String,
  },
  user_email: {
    type: String,
  },
  user_phno: {
    type: String,
  },
   img:
    {
        type:String
    },
  trans_id: {
    type: String,
  },
});

module.exports = mongoose.model("userevents", Events);
