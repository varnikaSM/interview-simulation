import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js"; // ✅ Resume Upload API
import cors from "cors"; // ✅ Allow frontend requests

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // ✅ Enable CORS for frontend requests
app.use(express.json()); // ✅ Parse JSON bodies

// ✅ Register API routes
app.use("/api/users", userRoutes);   // ✅ Candidate User API (Updated)
app.use("/api/resumes", resumeRoutes); // ✅ Resume Upload API

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
