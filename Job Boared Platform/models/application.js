const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobListing",
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending"
  },
  resume: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
