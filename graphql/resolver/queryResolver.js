const userModels = require('../../model/users');
const chatRoom = require('../../model/chatRoom');

module.exports = {
    RootQuery: {
        userList: async() => {
            try {
                const getUser = await userModels.find();
                return getUser;
            } catch (error) {
                return error;
            }
        },
        AllRooms: async() => {
            try{
                const result = await chatRoom.find();
                return result;
            }
            catch(err)
            {
                throw err;
            }
        }
    }
}