const userResolvers = require("./user");
const vehicleResolvers = require("./vehicleResolver");
module.exports = {
  Query: {
    // user query resolvers
    ...userResolvers.Query,

    // vehicle query resolvers
    ...vehicleResolvers.Query,
  },

  Mutation: {
    // user mutation resolvers
    ...userResolvers.Mutation,

    // vehicle mutation resolvers
    ...vehicleResolvers.Mutation,
  },
};
