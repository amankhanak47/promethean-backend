const mongoose = require("mongoose");
const { Schema } = mongoose;

const orgemails = new Schema({
    email: {
        type:String
    }
});

module.exports = mongoose.model("allorgemails", orgemails);
