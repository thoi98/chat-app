const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphQL/resolver/index");
const { GraphQLServer } = require("graphql-yoga");
const authware = require("./middleware/authware");

const { pubsub } = require("./graphql/helper");

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
			useCreateIndex:true,
		}
	)
	.then(
		() => console.log("\x1b[32m", "\tDatabase is connected...", "\x1b[0m"),
		() => console.log("\x1b[31m", "\tCould'nt connect to database", "\x1b[0m")
	)
	.catch((err) => console.error(err));

const server = new GraphQLServer({
	typeDefs,
	resolvers,
	context: ({ request, response, connection }) => {
		if (connection) {
			connection.variables = { user: "Admin" };
			connection.context = "Admin";
		}
		return { req: request, res: response };
	},
});

server.express.use(authware);
server.express.use(bodyParser.json());
server.express.use(bodyParser.urlencoded({ extended: false }));

const prt = process.env.PORT || 4000;

const options = {
	subscriptions: {
		onConnect: async (connectionParams, ws, context) => {
			console.log("CONNECTED");
		},
		onDisconnect: () => {
			console.log("DISCONNECTED");
		},
	},
	port: prt,
};

server.start(options, ({ port }) => {
	console.log(`GraphQL Listening on port ${port}`);
});
