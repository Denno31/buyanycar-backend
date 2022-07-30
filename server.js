const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");
const { MONGODBURL } = require("./appconfig");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
mongoose
  .connect(MONGODBURL, { useNewUrlParser: true })
  .then(() => server.listen({ port: 5000 }))
  .then((res) => console.log(`Server running at ${res.url}`));
