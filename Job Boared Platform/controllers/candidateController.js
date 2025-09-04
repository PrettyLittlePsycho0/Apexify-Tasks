const Candidate = require("../models/Candidate");

// Get candidate profile
const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update candidate profile
const updateCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const { bio, skills, experience, overrideSkills } = req.body;
    const update = {};

    // Normal fields
    if (bio) update.bio = bio;
    if (experience) update.experience = experience;

    // Skills: append or override
    if (skills) {
      if (overrideSkills) {
        update.skills = skills;
      } else {
        update.$addToSet = { skills: { $each: skills } };
      }
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true }
    );

    res.json(updatedCandidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCandidateProfile,
  updateCandidateProfile,
};
