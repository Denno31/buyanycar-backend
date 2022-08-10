const mongoose = require("mongoose");

const vehicleMakeSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VehicleMake", vehicleMakeSchema);
