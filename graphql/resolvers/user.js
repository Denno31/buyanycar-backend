const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
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
  },
};

module.exports = resolvers;
