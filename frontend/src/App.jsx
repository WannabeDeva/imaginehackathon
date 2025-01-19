import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CropDiagnostics from "./pages/CropDiagnostics";
import DiagnosticsHistory from "./pages/DiagnosticsHistory";
import CommunityForum from "./pages/CommunityForum";
import Analytics from "./pages/Analytics";
import DiagnosticDetails from "./pages/DiagnosticDetails";
// import Consultation from "./pages/Consultation";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for each page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/crop-diagnostics" element={<CropDiagnostics />} />
        <Route path="/history" element={<DiagnosticsHistory />} />
        {/* <Route path="/community-forum" element={<CommunityForum />} />
        <Route path="/analytics" element={<Analytics />} /> */}
        <Route path="/history/:id" element={<DiagnosticDetails />} />
        {/* <Route path="/consultation" element={<Consultation />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
