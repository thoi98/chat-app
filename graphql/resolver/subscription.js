const { pubsub } = require("../helper");
const { withFilter } = require("graphql-yoga");

module.exports = {
	Subscription: {
		user: {
			subscribe(parent, args, ctx, info) {
				return pubsub.asyncIterator("userTopic"); //Topic
			},
		},
		newMessage: {
			subscribe: withFilter(
				() => pubsub.asyncIterator("newMessage"),
				(payload, variables) => {
					console.log(payload.query, variables, "HALO");
					return payload.chatRoom === variables.chatRoom;
				}
			),
		},
	},
};
