import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // ✅ Temporary folder for uploaded files

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file || !req.body.candidateId) {
            return res.status(400).json({ error: "File and candidateId are required" });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path), req.file.originalname);
        formData.append("candidateId", req.body.candidateId);  // ✅ Send candidateId

        const flaskResponse = await axios.post("http://127.0.0.1:5000/upload", formData, {
            headers: { ...formData.getHeaders() }
        });

        fs.unlinkSync(req.file.path); // Delete temp file after sending

        return res.json(flaskResponse.data);

    } catch (error) {
        return res.status(500).json({ error: "Failed to process resume" });
    }
});

export default router;
