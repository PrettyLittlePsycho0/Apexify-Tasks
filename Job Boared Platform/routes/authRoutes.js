const express = require("express");
const { registerUser, loginUser, deleteUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", protect, deleteUser);

module.exports = router;
