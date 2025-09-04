const UserAuthModel = require("../models/UserAuth");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");
const Candidate = require("../models/Candidate");
const JobListing = require("../models/JobListing");
const application = require("../models/application");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
const registerUser = async (req, res) => {
  try {
    const exists = await UserAuthModel.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    
    let user;
    if (req.body.role === "Candidate") {
      user = new Candidate(req.body);
    }
    else if (req.body.role === "Employer") {
      user = new Employer(req.body);
    }
    else {
      return res.status(400).json({ error: "Invalid Error" });
    }
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  }
  catch (err) {
    console.error(err);
  }


  
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserAuthModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

// Delete Account
const deleteUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // If body is missing
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await UserAuthModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const result = await UserAuthModel.deleteOne({ email: email });

      if (user.__t === "Employer") {
        await JobListing.deleteMany({ employer: user.id });
        await application.deleteMany({ employer: user.id });
      }

      return res.json({ message: "User deleted", result });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser, deleteUser };
