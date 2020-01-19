const { ApolloServer, PubSub } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub}),
});

const port = 5000;
const app = express();
app.use('/assets/post', express.static(path.join(__dirname, './images')));
server.applyMiddleware({ app });

mongoose.connect(config.database, { useNewUrlParser : true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        console.log(`Server running at port ${port}`);
        return app.listen({port})
    })