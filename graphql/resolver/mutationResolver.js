const userModels = require('../../model/users');
const chatRoom = require('../../model/chatRoom');
const { pubsub } = require('../helper');

module.exports = {
    RootMutation: {
        createUser: async(parent, args, ctx, info) => {
            try {
                console.log('user create===============', args);
                let query = { 'username': args.newUser.username };
                const createUserDetails = await userModels.findOneAndUpdate(query, args.newUser, { upsert: true, new: true });
                console.log('user create===============', createUserDetails);
                pubsub.publish('userTopic', {
                    user: createUserDetails
                });
                return createUserDetails;
            } catch (error) {
                return error;
            }
        },
        deleteUser: async(parent, args, ctx, info) => {
            let responseMSG = {};
            try {
                let query = { 'username': args.username };
                const createUserDetails = await userModels.findOneAndDelete(query);
                console.log('createUserDetails--------------------', createUserDetails);
                if (createUserDetails == null) {
                    responseMSG.response = "No User found for this opertaion";
                    return responseMSG;
                } else {
                    responseMSG.response = "Success";
                    return responseMSG;
                }

            } catch (error) {
                responseMSG.response = "Fail";
                return responseMSG;
            }
        },
        createRoom: async(parent, {name}, ctx, info) => {
            try{
                const room = new chatRoom({
                    name: name
                });
                const result= await room.save();
                return result;
            }
            catch(err)
            {
                throw err;
            }
        },
        sendMessage: async(parent, {roomId,msg}, ctx, info) => {
            try{
                const room = await chatRoom.findById(roomId);
                room.chat.push(msg);
                await room.save();
                pubsub.publish('newMessage',{
                    newMessage: msg,
                    chatRoom: roomId
                });
                return 'Success';
            }
            catch(err)
            {
                return err;
            }
        }
    }
}