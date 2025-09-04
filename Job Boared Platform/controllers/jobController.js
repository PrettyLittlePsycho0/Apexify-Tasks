const JobListing = require("../models/JobListing");

// Post a new job
const postJob = async (req, res) => {
  if (req.user.__t !== "Employer") {
    return res.status(403).json({ message: "Only employers can post jobs" });
  }

  const { title, description, location, salary } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const job = new JobListing({
      title,
      description,
      location,
      salary,
      employer: req.user._id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  if (req.user.__t !== "Employer") {
    return res.status(403).json({ message: "Only employers can delete jobs" });
  }

  try {
    const job = await JobListing.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.employer.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await JobListing.findByIdAndDelete(job._id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  if (req.user.__t !== "Employer") {
    return res.status(403).json({ message: "Only employers can update jobs" });
  }

  try {
    const job = await JobListing.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.employer.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, location, salary } = req.body;
    const update = {};

    if (title) update.title = title;
    if (description) update.description = description;
    if (location) update.location = location;
    if (salary) update.salary = salary;

    const updatedJob = await JobListing.findByIdAndUpdate(
      req.params.jobId,
      update,
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search Jobs
const searchJobs = async (req, res) => {
  try {
    const { q } = req.query; // e.g. /jobs/search?q=react dev
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query string (q) is required" });
    }

    // Case-insensitive, fuzzy-ish regex
    const regex = new RegExp(q, "i"); 

    const jobs = await Job.find({
      $or: [
        { title: regex },
        { description: regex },
        { skills: regex },
        { location: regex }
      ]
    }).limit(50); // limit results for safety

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postJob,
  deleteJob,
  updateJob,
  searchJobs
};
