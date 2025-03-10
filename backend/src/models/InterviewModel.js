import mongoose from "mongoose";

const getInterviewModel = (interviewId) => {
    const collectionName = `interview_${interviewId}`;

    const interviewSchema = new mongoose.Schema({
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        interviewId: { type: String, required: true },
        questionId: { type: String, required: true },
        technicalAccuracy: { type: Number, required: true, min: 1, max: 10 },
        codeQuality: { type: Number, min: 1, max: 10, default: null }, // Optional
        problemSolving: { type: Number, required: true, min: 1, max: 10 },
        communication: { type: Number, required: true, min: 1, max: 10 },
        adaptability: { type: Number, required: true, min: 1, max: 10 },
    }, { timestamps: true });

    return mongoose.models[collectionName] || mongoose.model(collectionName, interviewSchema, collectionName);
};

export default getInterviewModel;
