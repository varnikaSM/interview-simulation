import React from "react";
import CandidateDashboard from "./pages/CandidateDashboard"; // ✅ Import your dashboard
/*import "./styles/global.css"; // ✅ Optional global styles*/

const App = () => {
  return (
    <div className="app-container">
      <CandidateDashboard /> {/* ✅ Load the dashboard directly */}
    </div>
  );
};

export default App;
