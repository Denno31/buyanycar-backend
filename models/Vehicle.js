const { model, Schema } = require("mongoose");

const vehicleSchema = new Schema(
  {
    price: { type: Number, required: true },
    transmission: { type: String, required: true },
    vehicleImageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    area:{type:String, required:true,default:""},
    make: { type: String, required: true },
    color: { type: String, required: true },
    condition: { type: String, required: true }, //brand new, foreign used, Kenyan Used
    model: { type: String, required: true },
    mileage: { type: Number, required: true },
    vinChassisNumber: { type: String },
    registered: { type: Boolean, required: true },
    description: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    negotiable: { type: Boolean, default: false },
    manufactureYear: { type: Number, required: true },
    bodyType: { type: String, required: true },
    fuel: { type: String, required: true },
    engineSize: { type: Number, required: true },
    vehicleOwner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Vehicle", vehicleSchema);
