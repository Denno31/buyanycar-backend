const mongoose = require("mongoose");

const vehicleModelSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VehicleModel", vehicleModelSchema);
