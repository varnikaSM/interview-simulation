import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dummyHome.css"; // ✅ Ensure you create this file for styling

const DummyHome = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the AI Interview Simulation</h1>
      <p>Select your role to continue:</p>

      <div className="button-group">
        <button onClick={() => navigate("/candidate-dashboard")} className="candidate-btn">
          👤 Candidate Dashboard
        </button>
        <button onClick={() => navigate("/interviewer-dashboard")} className="interviewer-btn">
          🏢 Interviewer Dashboard
        </button>
      </div>
    </div>
  );
};

export default DummyHome;
    