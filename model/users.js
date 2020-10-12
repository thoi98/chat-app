const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* defining users Schema */
const userDetails = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("user_details", userDetails);
