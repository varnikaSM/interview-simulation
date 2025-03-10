import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  candidateId: { type: Number, required: true },  // ✅ Ensure it's a NUMBER
  skills: [String],
  projects: [String],
  personalInterests: [String],
  organizations: [String]
});

export default mongoose.model("Resume", resumeSchema, "resumes");
