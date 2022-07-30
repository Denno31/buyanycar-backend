const Joi = require("@hapi/joi");
module.exports.validateRegisterInputs = (
  firstName,

  email,
  password,
  tos
) => {
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
  price: Joi.number().required(),
  transmission: Joi.string().required(),
  vehicleImageUrl: Joi.array().items(Joi.string()).required(),
  location: Joi.string().required(),
  make: Joi.string().required(),
  color: Joi.string().required(),
  condition: Joi.string().required(),
  model: Joi.string().required(),
  mileage: Joi.number().required(),
  manufactureYear: Joi.string(),
  vinChassisNumber: Joi.string().required(),
  registered: Joi.boolean().required(),
  description: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  negotiable: Joi.boolean(),
  bodyType: Joi.string().required(),
  fuel: Joi.string().required(),
  engineSize: Joi.number().required(),
});
