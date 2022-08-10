const mongoose = require("mongoose");

const countySchema = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model("County", countySchema);
