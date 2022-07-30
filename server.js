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
const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGODBURL, { useNewUrlParser: true })
  .then(() => server.listen({ port: PORT }))
  .then((res) => console.log(`Server running at ${res.url}`));
