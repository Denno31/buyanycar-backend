const userResolvers = require("./user");
const vehicleResolvers = require("./vehicleResolver");
const countyResolvers = require("./countyResolver");
const messageResolvers = require('./messageResolver')
module.exports = {
  Query: {
    // user query resolvers
    ...userResolvers.Query,

    // vehicle query resolvers
    ...vehicleResolvers.Query,
    //county
    ...countyResolvers.Query,
    //messages
    ...messageResolvers.Query
  },

  Mutation: {
    // user mutation resolvers
    ...userResolvers.Mutation,

    // vehicle mutation resolvers
    ...vehicleResolvers.Mutation,
    ...countyResolvers.Mutation,

    //message mutations
    ...messageResolvers.Mutation
  },
  Subscription: {
    ...messageResolvers.Subscription
  }
};
