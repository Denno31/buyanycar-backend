const userResolvers = require("./user");
const vehicleResolvers = require("./vehicleResolver");
const countyResolvers = require("./countyResolver");
module.exports = {
  Query: {
    // user query resolvers
    ...userResolvers.Query,

    // vehicle query resolvers
    ...vehicleResolvers.Query,
    //county
    ...countyResolvers.Query,
  },

  Mutation: {
    // user mutation resolvers
    ...userResolvers.Mutation,

    // vehicle mutation resolvers
    ...vehicleResolvers.Mutation,
    ...countyResolvers.Mutation,
  },
};
