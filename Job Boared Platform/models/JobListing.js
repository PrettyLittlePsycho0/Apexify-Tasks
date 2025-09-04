const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  salary: { type: Number },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to employer user
}, { timestamps: true });

module.exports = mongoose.model("JobListing", jobListingSchema);
