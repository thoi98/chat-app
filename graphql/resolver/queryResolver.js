const userModels = require("../../model/users");
const chatRoom = require("../../model/chatRoom");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
        AllRooms: async () => {
            try {
                const result = await chatRoom.find();
                return result;
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
                        expiresIn: "15s",
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
    },
};
