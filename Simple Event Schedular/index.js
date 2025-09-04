// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/eventScheduler");

// Schema & Model
const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const today = new Date();
        const eventDate = new Date(v);
        return eventDate >= new Date(today.toDateString()); // must be today or future
      },
      message: "Date cannot be in the past.",
    },
  },
  description: { type: String },
});

const Event = mongoose.model("Event", eventSchema);

// Routes
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/events", async (req, res) => {
  try {
    const { id, title, date, description } = req.body;

    const newEvent = new Event({ id, title, date, description });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = 6969;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
