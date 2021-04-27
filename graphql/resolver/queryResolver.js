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
        AllRooms: async (_,{cursor=null,limit=2}) => {
            try {
                if(cursor!=null)
                {
                    let result = await chatRoom.find({'_id':{'$lt':cursor}}).limit(limit).sort({'_id':-1});
                    return result;
                }
                else
                {
                    console.log("No cursor");
                    let result = await chatRoom.find().limit(limit);
                    return result;
                }
            } catch (err) {
                throw err;
            }
        },
        getChat: async (_,{roomId}) => {
            try{
                console.log(roomId);
                let size = await chatRoom.aggregate([{$match:{_id:mongoose.Types.ObjectId(roomId)}},{$project:{chat:{$size:'$chat'}}}]);
                console.log('get chat called');
                console.log(size);
                //const result = await chatRoom.find({'_id':roomId},{'chat':});
                throw new Error("get chat ERROR");
            }
            catch(err)
            {
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
