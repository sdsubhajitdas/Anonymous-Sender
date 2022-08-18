const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 6, max: 256 },
  email: { type: String, required: true, min: 6, max: 350 },
  password: { type: String, required: true, min: 6, max: 1024 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
