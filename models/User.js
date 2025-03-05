const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    resetToken: String,
    resetTokenExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);