const express = require("express");
const { getCandidateProfile, updateCandidateProfile } = require("../controllers/candidateController");
const { protect } = require("../middleware/authMiddleware");
const { getMyApplications, applyToJob } = require("../controllers/applicationController");
const upload = require("../middleware/upload");
const { searchJobs } = require("../controllers/jobController");

const router = express.Router();

// Candidate routes (Candidate only)
router.get("/profile", protect, getCandidateProfile);
router.put("/update", protect, updateCandidateProfile);
router.get("/myapps", protect, getMyApplications);
router.post("/apply/:jobId", protect, upload.single("resume"), applyToJob);
router.get("/jobs/search", protect, searchJobs);

module.exports = router;