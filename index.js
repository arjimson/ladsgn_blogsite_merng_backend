const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const Post = require('./models/Post');

const config = require('./config/database');
//const resolvers = require('./graphql/resolvers/post');
const typeDefs = require('./graphql/typeDefs');

const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub})
});

const  port = 5000;

mongoose.connect(config.database, { useNewUrlParser : true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({port})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    });