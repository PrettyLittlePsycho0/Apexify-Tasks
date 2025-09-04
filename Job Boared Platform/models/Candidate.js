const mongoose = require("mongoose");
const user = require("../models/UserAuth");

const candidateSchema = new mongoose.Schema({
    bio: { type: String },
    skills: [{ type: String }],
    experience: { type: String }
}, { timestamps: true });

module.exports = user.discriminator("Candidate", candidateSchema);
