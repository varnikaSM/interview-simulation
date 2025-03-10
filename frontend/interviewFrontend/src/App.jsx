import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import DummyHome from "./pages/DummyHome"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DummyHome />} /> 
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
