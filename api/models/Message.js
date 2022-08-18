const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sender: { type: String, required: false },
  message: { type: String, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
