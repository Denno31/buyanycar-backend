const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const checkAuth = require("../../utils/checkAuth");
const {
  validateRegisterInputs,
  validateLoginInput,
} = require("../../utils/validators");
const { JWT_SECRET } = require("../../appconfig");

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

const resolvers = {
  Query: {
    sayHi() {
      return "hi";
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);
      const user = await User.findOne({ email: email });
      if (!valid) {
        throw UserInputError("Errors", { errors });
      }
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);
      console.log(token);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      parent,
      {
        registerInput: {
          firstName,
          lastName,
          email,
          password,
          tos,
          phoneNumber,
        },
      }
    ) {
      // TODO: validate user data
      const { errors, valid } = validateRegisterInputs(
        firstName,
        email,
        password,
        tos
      );

      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }
      // TODO: make sure doesn't exist
      const user = await User.findOne({ email: email });
      if (user) {
        throw new UserInputError("Email is already registered", {
          errors: {
            email: "This email already exists",
          },
        });
      }
      // TODO harsh password and create an auth token

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password,
        firstName,
        lastName,
        tos,
        phoneNumber,
      });
      const result = await newUser.save();

      const token = generateToken(result);
      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
    async postFavoriteVehicle(_, { vehicleId }, context) {
      const user = checkAuth(context);
      try {
        const result = await User.findOne({ _id: user.id });

        const favoriteVehicleExists = result.favoriteVehicles.find(
          (v_id) => vehicleId.toString() === v_id.toString()
        );
        if (favoriteVehicleExists) {
          result.favoriteVehicles = result.favoriteVehicles.filter(
            (v_id) => v_id.toString() !== vehicleId.toString()
          );
        } else {
          result.favoriteVehicles.push(vehicleId);
        }
        const savedUpdate = await result.save();
        return savedUpdate;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = resolvers;
