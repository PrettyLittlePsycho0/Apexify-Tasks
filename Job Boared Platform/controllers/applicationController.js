const Application = require("../models/application");
const JobListing = require("../models/JobListing");

// Candidate applies to a job
const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const candidateId = req.user._id;

    // Prevent employers from applying
    if (req.user.__t === "Employer") {
      return res.status(403).json({ message: "Employers cannot apply to jobs" });
    }

    const job = await JobListing.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const existingApp = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const newApp = new Application({
      job: jobId,
      candidate: candidateId,
      employer: job.employer,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Candidate views their own applications
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user._id }).populate("job");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employer views applications for a job
const getApplicationsForMyJobs = async (req, res) => {
    if (req.user.__t !== "Employer") {
        return res.status(403).json({ message: "The request was sent by a candidate" });
    }
    try {
        const apps = await Application.find({ job: req.params.jobId }).populate(["job", "candidate"]);
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

// Employer updates application status
const updateApplicationStatus = async (req, res) => {
  if (req.user.__t !== "Employer") {
    return res.status(403).json({ message: "Only employers can update applications" });
  }

  const appId = req.params.appId;

  try {
    const app = await Application.findById(appId);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!app.employer.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      appId,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForMyJobs,
  updateApplicationStatus,
};
