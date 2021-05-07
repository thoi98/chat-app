const userModels = require("../../model/users");
const chatRoom = require("../../model/chatRoom");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

module.exports = {
	RootQuery: {
		userList: async (_, __, { req }) => {
			try {
				if (!req.isAuth) {
					throw new Error("Not logged in.");
				}
				const getUser = await userModels.find();
				return getUser;
			} catch (error) {
				return error;
			}
		},
		AllRooms: async (_, { cursor = null, limit = 2 }, { req }) => {
			try {
				if (cursor != null) {
					let result = await chatRoom
						.find({ _id: { $lt: cursor } })
						.limit(limit)
						.sort({ _id: -1 });
					return result;
				} else {
					console.log("No cursor");
					let result = await chatRoom
						.find()
						.limit(limit)
						.sort({ _id: -1 });
					return result;
				}
			} catch (err) {
				throw err;
			}
		},
		getChat: async (_,{ roomId, cursor = null, psize = 3, old = true }) => {
			try {
				if (cursor == null) {
					console.log("get chat called");
					let result = await chatRoom.aggregate([
						{ $match: { _id: mongoose.Types.ObjectId(roomId) } },
						{
							$project: {
								count: { $size: "$chat" },
								chat: { $slice: ["$chat", -psize] },
							},
						},
					]);
					result[0].first = result[0].count - 1;
					result[0].last = result[0].count - psize;
					result[0].roomId = roomId;
					//console.log(result[0]);
					return result[0];
				} else {
					let pos, page_size;
					if (old) {
						pos = 0 > cursor - psize ? 0 : cursor - psize;
						page_size = cursor - pos;
					} else {
						pos = cursor + 1;
						page_size = psize;
					}
					if(pos<0 || page_size<=0)
					{
						throw new Error("no more messages");
					}
					let result = await chatRoom.aggregate([
						{ $match: { _id: mongoose.Types.ObjectId(roomId) } },
						{
							$project: {
								count: { $size: "$chat" },
								chat: { $slice: ["$chat", pos, page_size] },
							},
						},
					]);
					old
						? (result[0].last = pos)
						: (result[0].first =
								cursor + psize < result[0].count - 1
									? cursor + psize
									: result[0].count - 1);
					result[0].roomId = roomId;
					console.log(result[0], "Cursor:", cursor);
					return result[0];
				}
			} catch (err) {
				throw err;
			}
		},
		login: async (_, { email, password }) => {
			try {
				const existingUser = await userModels.findOne({ email: email });
				if (!existingUser) {
					throw new Error("The user does not exist");
				}
				const isEqual = await bcrypt.compare(
					password,
					existingUser.password
				);
				if (!isEqual) {
					throw new Error("The password is incorrect");
				}
				const token = jwt.sign(
					{ userId: existingUser.id, email: existingUser.email },
					process.env.SECRET_KEY,
					{
						expiresIn: "15m",
					}
				);
				return {
					userId: existingUser.id,
					token: token,
					tokenExpiration: 15,
				};
			} catch (err) {
				throw err;
			}
		},
		hey: async ()=>{
			return "jude";
		},
	},
};
