const mongoose = require("mongoose");

const guestbookSchema = new mongoose.Schema({
    id: Number,
    name: String,
    avatar: String,
    date: String,
    message: String
});

const Guestbook = mongoose.model("Guestbook", guestbookSchema);

module.exports = Guestbook;

