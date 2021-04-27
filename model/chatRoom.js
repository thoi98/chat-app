const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* defining chatRoom Schema */
const chatRoom = new Schema({
    name: {
        type: String,
        required: true,
    },
    chat: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model("chat_room", chatRoom);
