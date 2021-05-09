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

userDetails.index({email:1});

module.exports = mongoose.model("users", userDetails);
