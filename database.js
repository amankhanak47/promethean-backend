const mongoose = require("mongoose");
const mongouri =
  "apikey";
  // "mongodb://localhost:27017"

const connectToMongo = () => {
  mongoose.connect(mongouri, () => {
    console.log("connected to mongo");
  });
};
module.exports = connectToMongo;
