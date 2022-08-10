const Joi = require("@hapi/joi");
module.exports.validateRegisterInputs = (firstName, email, password, tos) => {
  const errors = {};
  if (firstName.trim() === "")
    errors.firstName = "First Name must not be empty";
  //if (lastName.trim() === "") errors.lastName = "Last Name must not be empty";
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password === "") errors.password = "password must not be empty";
  if (tos === false) errors.tos = "You must agree to the rules";
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  }
  if (password === "") errors.password = "password must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.vehicleSchema = Joi.object({
  price: Joi.number().required().min(1000),
  transmission: Joi.string().required(),
  vehicleImageUrl: Joi.array().items(Joi.string()).required(),
  location: Joi.string().required(),
  make: Joi.string().required(),
  color: Joi.string().required(),
  condition: Joi.string().required(),
  model: Joi.string().required(),
  mileage: Joi.number().required().min(0),
  manufactureYear: Joi.string(),
  vinChassisNumber: Joi.string(),
  registered: Joi.boolean().required(),
  description: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  negotiable: Joi.boolean(),
  bodyType: Joi.string().required(),
  fuel: Joi.string().required(),
  engineSize: Joi.number().required().min(1),
});

module.exports.validateVehicleInput = (vehicle) => {
  const errors = {};
  if (vehicle.price <= 0 || vehicle.price === null) {
    errors.price = "Price is invalid price";
  }
  if (vehicle.transmission.trim() === "") {
    errors.transmission = "Transmission must not be blank";
  }
  if (vehicle.make.trim() === "") {
    errors.make = "Make must not be blank";
  }
  if (
    !Array.isArray(vehicle.vehicleImageUrl) ||
    vehicle.vehicleImageUrl.length < 6
  ) {
    errors.vehicleImageUrl = "Select atleast six images.";
  }
  if (vehicle.location.trim() === "") {
    errors.location = "location cannot be blank";
  }
  if (vehicle.color.trim() === "") {
    errors.color = "Color must not be blank";
  }
  if (vehicle.condition.trim() === "") {
    errors.condition = "condition cannot be blank";
  }
  if (vehicle.model.trim() === "") {
    errors.model = "model cannot be blank";
  }
  if (vehicle.manufactureYear.trim() === "") {
    errors.manufactureYear = "Year of manufacture cannot be blank";
  }
  if (vehicle.description.trim() === "") {
    errors.description = "description cannot be blank";
  }
  if (vehicle.phoneNumber.trim() === "") {
    errors.phoneNumber = "phone number cannot be blank";
  }
  if (vehicle.bodyType.trim() === "") {
    errors.bodyType = "Body Type cannot be blank";
  }
  if (vehicle.fuel.trim() === "") {
    errors.fuel = "fuel cannot be blank";
  }
  if (vehicle.engineSize === 0) {
    errors.engineSize = "engine size cannot be blank";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
