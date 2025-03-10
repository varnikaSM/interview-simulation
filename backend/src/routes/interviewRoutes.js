import express from "express";
import getInterviewModel from "../models/InterviewModel.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Start a New Interview (Creates a New Collection)
router.post("/start", protect, async (req, res) => {
    try {
        const { candidateId, interviewId } = req.body;

        if (!candidateId || !interviewId) {
            return res.status(400).json({ error: "Candidate ID and Interview ID are required" });
        }

        // Check if the collection already exists
        const Interview = getInterviewModel(interviewId);

        res.status(201).json({ message: "New interview session started", interviewId });

    } catch (error) {
        res.status(500).json({ error: "Failed to start interview", details: error.message });
    }
});

// ✅ Submit Question Scores for an Interview
router.post("/submit", protect, async (req, res) => {
    try {
        const { candidateId, interviewId, questionId, technicalAccuracy, codeQuality, problemSolving, communication, adaptability } = req.body;

        if (!candidateId || !interviewId || !questionId || !technicalAccuracy || !problemSolving || !communication || !adaptability) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const Interview = getInterviewModel(interviewId);

        const newQuestion = new Interview({
            candidateId,
            interviewId,
            questionId,
            technicalAccuracy,
            codeQuality: codeQuality || null,
            problemSolving,
            communication,
            adaptability,
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json({ message: "Question evaluation submitted", data: savedQuestion });

    } catch (error) {
        res.status(500).json({ error: "Failed to submit question evaluation", details: error.message });
    }
});

router.put("/update/:interviewId", protect, async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { candidateId, questionId, technicalAccuracy, codeQuality, problemSolving, communication, adaptability } = req.body;

        if (!candidateId || !questionId || !technicalAccuracy || !problemSolving || !communication || !adaptability) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const Interview = getInterviewModel(interviewId);
        const updatedQuestion = await Interview.findOneAndUpdate(
            { questionId: questionId },
            { technicalAccuracy, codeQuality, problemSolving, communication, adaptability },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question updated successfully", data: updatedQuestion });

    } catch (error) {
        res.status(500).json({ error: "Failed to update question", details: error.message });
    }
});

router.get("/:interviewId", protect, async (req, res) => {
    try {
        const { interviewId } = req.params;

        const Interview = getInterviewModel(interviewId);

        const allQuestions = await Interview.find();

        if (!allQuestions.length) {
            return res.status(404).json({ message: "No questions found for this interview" });
        }

        res.json(allQuestions);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch interview data", details: error.message });
    }
});

export default router;
