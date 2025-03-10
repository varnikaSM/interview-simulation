import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/interviewerDashboard.css"; // ✅ Ensure this file exists for styling

const JWT_TOKEN = ""; // Replace with valid token

const InterviewerDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ✅ Fetch Candidates with Resumes on Page Load
  useEffect(() => {
    const fetchCandidatesWithResumes = async () => {
      try {
        const headers = { Authorization: `Bearer ${JWT_TOKEN}` };

        // ✅ Fetch only candidates who have uploaded resumes
        const res = await axios.get("http://127.0.0.1:5000/api/interviewers/candidates-with-resumes", { headers });
        setCandidates(res.data);
      } catch (error) {
        console.error("❌ Error fetching candidates with resumes:", error.response ? error.response.data : error.message);
      }
    };

    fetchCandidatesWithResumes();
  }, []);

  // ✅ Fetch Candidate Details when clicked
  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="dashboard-container">
      <h1>Interviewer Dashboard</h1>

      {/* Candidate List Section */}
      <section className="candidate-list">
        <h2>Candidates Who Uploaded Resumes</h2>
        <ul>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <li key={candidate.candidateId} onClick={() => handleCandidateClick(candidate)}>
                {candidate.name} ({candidate.email})
              </li>
            ))
          ) : (
            <p>No candidates with resumes found.</p>
          )}
        </ul>
      </section>

      {/* Candidate Details Section */}
      {selectedCandidate && (
        <section className="candidate-details">
          <h2>Candidate Details</h2>
          <p><strong>Name:</strong> {selectedCandidate.name}</p>
          <p><strong>Email:</strong> {selectedCandidate.email}</p>
          <p><strong>Candidate ID:</strong> {selectedCandidate.candidateId}</p>

          {/* Resume Details */}
          <h3>Resume Information</h3>
          <p><strong>Skills:</strong> {selectedCandidate.skills.length > 0 ? selectedCandidate.skills.join(", ") : "N/A"}</p>
          <p><strong>Projects:</strong> {selectedCandidate.projects.length > 0 ? selectedCandidate.projects.join(", ") : "N/A"}</p>
          <p><strong>Personal Interests:</strong> {selectedCandidate.personalInterests.length > 0 ? selectedCandidate.personalInterests.join(", ") : "N/A"}</p>
          <p><strong>Organizations:</strong> {selectedCandidate.organizations.length > 0 ? selectedCandidate.organizations.join(", ") : "N/A"}</p>
        </section>
      )}
    </div>
  );
};

export default InterviewerDashboard;
