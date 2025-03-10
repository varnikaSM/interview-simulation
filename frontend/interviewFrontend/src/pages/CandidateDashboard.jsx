    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import "../styles/candidateDashboard.css";

    const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2U3OGU0MjFkMDM4NWFmNDYwYmMwZiIsInR5cGUiOiJjYW5kaWRhdGUiLCJpYXQiOjE3NDE1ODk1NDksImV4cCI6MTc0NDE4MTU0OX0.h1x0Uw8y4vY-POdJBjx9UV0Xl6YG5by5vzA29vRcFcc"
    
    const CandidateDashboard = () => {
    const [resume, setResume] = useState(null);
    const [profile, setProfile] = useState({});
    const [interviews, setInterviews] = useState([]);

    // ✅ Fetch Candidate Profile & Past Interviews on Page Load
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const headers = { Authorization: `Bearer ${JWT_TOKEN}` };

            // Fetch profile
            const profileRes = await axios.get("http://127.0.0.1:5000/api/users/profile", { headers });
            setProfile(profileRes.data);

            // Fetch past interviews
            console.log(profileRes.data.candidateId)
            const interviewRes = await axios.get(`http://127.0.0.1:5000/api/users/${profileRes.data.candidateId}`, { headers });
            setInterviews(interviewRes.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
        };

        fetchProfile();
    }, []);

    const handleResumeUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        console.log("🔍 Checking profile data before upload:", profile); // Debugging
    
        if (!profile.candidateId) {
            console.error("❌ Candidate ID is missing!", profile);
            alert("Error: Candidate ID not found. Try refreshing.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("candidateId", profile.candidateId);
    
        try {
            const headers = { Authorization: `Bearer ${JWT_TOKEN}`, "Content-Type": "multipart/form-data" };
    
            const response = await axios.post("http://127.0.0.1:5001/upload", formData, { headers });
            alert("✅ Resume uploaded successfully!");
            setResume(file);
        } catch (error) {
            console.error("❌ Resume upload failed:", error.response ? error.response.data : error.message);
            alert("Error uploading resume. Check the console for details.");
        }
    };
       
    return (
        <div className="dashboard-container">
        <h1>Candidate Dashboard</h1>

        {/* Profile Overview */}
        <section className="profile-overview">
            <h2>Profile Overview</h2>
            <p><strong>Name:</strong> {profile.name || "Loading..."}</p>
            <p><strong>Email:</strong> {profile.email || "Loading..."}</p>
            <p><strong>Resume:</strong> {resume ? `Uploaded ✅ (${resume.name})` : "Not Uploaded ❌"}</p>

            {/* Resume Upload Input */}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="resume-upload" />

            <p><strong>Past Interviews:</strong> {interviews.length} Sessions</p>
            <p><strong>Average Score:</strong> {interviews.length > 0 ? 
            `${(interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length).toFixed(2)}%` 
            : "N/A"}
            </p>
        </section>

        {/* Interview Sessions */}
        <section className="interview-sessions">
            <h2>Interview Sessions</h2>
            <ul>
            {interviews.length > 0 ? (
                interviews.map((interview, index) => (
                <li key={index}>
                    {interview.date} - {interview.role} (Score: {interview.score}%)
                </li>
                ))
            ) : (
                <li>No interviews yet</li>
            )}
            </ul>
        </section>

        {/* Performance Analytics */}
        <section className="performance-analytics">
            <h2>Performance Analytics</h2>
            <p>AI-based feedback on past interviews</p>
            <p>Areas of Improvement: {profile.improvementAreas || "N/A"}</p>
        </section>
        </div>
    );
    };

    export default CandidateDashboard;
