const mongoose = require("mongoose")
const { MONGODBURL } = require("./appconfig");
const PORT = process.env.PORT || 5000;
const connectToDB = ()=>{
    mongoose
  .connect(MONGODBURL, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongodb"))
  .then((res) => console.log(`Server running at ${PORT}`));
}

module.exports = {connectToDB}