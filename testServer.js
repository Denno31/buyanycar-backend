const { ApolloServer } = require('apollo-server-express');
const http = require("http")
const express =require('express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const {useServer}= require('graphql-ws/lib/use/ws')
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const {connectToDB} = require('./db')
const {PubSub} = require("graphql-subscriptions");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const bodyParser= require("body-parser")
const cors = require("cors")
const pubsub =  new PubSub()
async function startApolloServer(typeDefs, resolvers) {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    // Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = http.createServer(app);
// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);
// Set up ApolloServer.
const server = new ApolloServer({
    schema,
    context:({req})=>({req,pubsub}),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
  
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use(cors())
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: '/'
 });

 // Modified server startup
 await new Promise(resolve => app.listen({ port: 5000 }, resolve));
 console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer(typeDefs,resolvers)
connectToDB()