const express = require("express");
const { getEmployerProfile, updateEmployerProfile } = require("../controllers/employerController");
const { protect } = require("../middleware/authMiddleware");
const { getApplicationsForMyJobs, updateApplicationStatus } = require("../controllers/applicationController");
const { postJob, deleteJob, updateJob } = require("../controllers/jobController");

const router = express.Router();

router.get("/profile", protect, getEmployerProfile);
router.put("/profile/update", protect, updateEmployerProfile);
router.get("/apps/:jobId", protect, getApplicationsForMyJobs);
router.patch("/application/update/:appId", protect, updateApplicationStatus);
router.post("/job/post", protect, postJob);
router.delete("/job/delete/:jobId", protect, deleteJob);
router.patch("/job/update/:jobId", protect, updateJob);

module.exports = router;