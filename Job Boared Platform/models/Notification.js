const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  salary: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to employer user
}, { timestamps: true });

module.exports = mongoose.model("notifications", Notification);