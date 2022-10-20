const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");
const { MONGODBURL } = require("./appconfig");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const {PubSub} = require("graphql-subscriptions")
 const pubsub =  new PubSub()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req,pubsub }),
});
const PORT = process.env.PORT || 5000;
server.listen({ port: PORT });
mongoose
  .connect(MONGODBURL, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongodb"))
  .then((res) => console.log(`Server running at ${PORT}`));