const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    loginAttempts: { type: Number },
    is_active: { type: Boolean, default: true },
    tos: { type: Boolean, required: true },
    phoneNumber: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = model("User", userSchema);
