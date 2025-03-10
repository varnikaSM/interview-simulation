import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  protect from "../middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();

// Generate JWT Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
router.get("/candidates", async (req, res) => {
    try {
        const candidates = await User.find({ type: "candidate" })
            .select("candidateId name email type");  // ✅ Ensure candidateId is included
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});
router.get("/profile", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
// @route    POST /api/users/register
router.post("/register", async (req, res) => {
    const { name, email, password, type } = req.body;

    try {
        let userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            type
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                candidateId: user.candidateId,
                name: user.name,
                email: user.email,
                type: user.type
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
// ✅ API to Update Candidate Details
router.put("/update/:candidateId", async (req, res) => {
    try {
        const { dateOfBirth, address, gender } = req.body;

        const candidate = await User.findOneAndUpdate(
            { candidateId: req.params.candidateId },
            { dateOfBirth, address, gender },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.json({ message: "Profile updated successfully", candidate });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ API to Fetch Candidate Details
router.get("/:candidateId", async (req, res) => {
    try {
        const candidate = await User.findOne({ candidateId: req.params.candidateId })
            .select("candidateId name email type dateOfBirth address gender");

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route    POST /api/users/login (No Bcrypt)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("🔹 Stored Password:", user.password);
    console.log("🔹 Entered Password:", password);

    if (user.password === password) {  // ✅ Direct comparison, no bcrypt
      console.log("✅ Password Matched!");
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        token: generateToken(user._id, user.type),
      });
    } else {
      console.log("❌ Password Does Not Match!");
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
