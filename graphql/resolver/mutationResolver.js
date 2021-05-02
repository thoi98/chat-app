const userModels = require("../../model/users");
const chatRoom = require("../../model/chatRoom");
const { pubsub } = require("../helper");
const bcrypt = require("bcryptjs");

module.exports = {
    RootMutation: {
        createUser: async (parent, args, ctx, info) => {
            try {
                const existingUser = await userModels.findOne({
                    email: args.newUser.email,
                });
                if (existingUser) {
                    throw new Error(
                        "This email is already registered to an existing user."
                    );
                }
                const hashedPassword = await bcrypt.hash(
                    args.newUser.password,
                    12
                );
                const User = new userModels({
                    username: args.newUser.username,
                    email: args.newUser.email,
                    password: hashedPassword,
                });
                const result = await User.save();
                return result;
            } catch (error) {
                return error;
            }
        },
        createRoom: async (parent, { name }, ctx, info) => {
            try {
                const room = new chatRoom({
                    name: name,
                });
                const result = await room.save();
                return result;
            } catch (err) {
                throw err;
            }
        },
        sendMessage: async (parent, { roomId, msg }, ctx, info) => {
            try {
                const room = await chatRoom.findById(roomId);
                room.chat.push(msg);
                await room.save();
                pubsub.publish("newMessage", {
                    newMessage: msg,
                    chatRoom: roomId,
                });
                return "Success";
            } catch (err) {
                return err;
            }
        },
        clearChat: async(_,{roomId}) => {
            try{
                var res;
                await chatRoom.update({_id:roomId},{$pull:{chat:{$ne:0}}}).then(()=>{res = "Chat cleared";},()=>{res = "Chat couldn't be cleared";});
                return res;
            } catch(err){
                return err;
            }
        },
    },
};
