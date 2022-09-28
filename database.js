const mongoose=require("mongoose");
const mongouri="mongodb+srv://bvrit-portal:AQPZMWO4tQAvMe9L@cluster0.dmnsn.mongodb.net/promethean?retryWrites=true&w=majority"


const connectToMongo=()=>{
    mongoose.connect(  mongouri,
    { useNewUrlParser: true, useUnifiedTopology: true },()=>{
        console.log("connected to mongo")
    })
}
module.exports = connectToMongo;


