import React from "react";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="page-title">Dialysis Dashboard</h1>
      <Dashboard />
    </div>
  );
}

export default App;