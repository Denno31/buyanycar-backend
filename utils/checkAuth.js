const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { JWT_SECRET } = require("../appconfig");

module.exports = (context) => {
  // context = {...headers}

  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ...
    const token = authHeader.split("Bearer ")[1].trim();
    // console.log(token, JWT_SECRET);
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be valid");
  }
  throw new Error("Authorization header must be provided");
};
