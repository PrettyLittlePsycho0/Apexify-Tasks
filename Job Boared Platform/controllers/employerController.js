const Employer = require("../models/Employer");

// Get employer profile
const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id);
    if (!employer) {
      return res.status(404).json({ message: "Employer profile not found" });
    }
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update employer profile
const updateEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user._id);
    if (!employer) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    const { bio, skills, experience } = req.body;
    const update = {};

    if (bio) update.bio = bio;
    if (skills) update.skills = skills;
    if (experience) update.experience = experience;

    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true }
    );

    res.json(updatedEmployer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmployerProfile,
  updateEmployerProfile,
};
