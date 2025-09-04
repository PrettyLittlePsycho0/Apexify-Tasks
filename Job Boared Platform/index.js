const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employer", require("./routes/employerRoutes"));
app.use("/api/candidates",  require("./routes/candidateRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port: " + PORT));
