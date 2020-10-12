const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphQL/resolver/index");
const { GraphQLServer } = require("graphql-yoga");
const authware = require("./middleware/authware");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authware);

mongoose
    .connect(
        "mongodb+srv://" +
            "thoi" +
            ":" +
            "WzXUcOdHt6D8rRFE" +
            "@node-rest-shop.etpxr.mongodb.net/" +
            "graphql-subscription-test" +
            "?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("\x1b[35m", " Database is connected..."))
    .catch((err) => console.error(err));

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});
server.start(() => {
    console.log("GraphQL Listening on port 4000");
});
