import express from "express";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Fetch Candidates Who Uploaded Resumes
router.get("/candidates-with-resumes", async (req, res) => {
  try {
    // Step 1: Fetch resumes
    const resumes = await Resume.find().lean();

    if (!resumes.length) {
      return res.status(404).json({ message: "No candidates with resumes found" });
    }

    // Step 2: Extract candidateIds and ensure they are numbers
    const candidateIds = resumes.map((resume) => Number(resume.candidateId));

    // Step 3: Fetch users with matching candidateId
    const users = await User.find({ candidateId: { $in: candidateIds } }).lean();

    // Step 4: Merge user and resume data
    const candidatesWithResumes = resumes.map((resume) => {
      const user = users.find((u) => u.candidateId == resume.candidateId) || null;

      return {
        candidateId: resume.candidateId,
        name: user ? user.name : "Not Found", // ✅ Show correct name
        email: user ? user.email : "Not Found", // ✅ Show correct email
        skills: resume.skills || [],
        projects: resume.projects || [],
        personalInterests: resume.personalInterests || [],
        organizations: resume.organizations || [],
      };
    });

    res.json(candidatesWithResumes);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
