const mongoose = require("mongoose");

const subCountySchema = new mongoose.Schema(
  {
    name: { type: "string", required: true },
    subCounty: { type: "string", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCounty", subCountySchema);
