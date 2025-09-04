const mongoose = require("mongoose");
const user = require("../models/UserAuth");

const employerSchema = new mongoose.Schema({
  companyName: { type: String },
  website: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = user.discriminator("Employer", employerSchema);
