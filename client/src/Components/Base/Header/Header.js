import React, { useState } from "react";
import "./header.css";
import { PiSidebar } from "react-icons/pi";
import { Link } from "react-router-dom";

const Header = ({ isHidden, toggleSidebar }) => {
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile"); // Default model

  const models = [
    "llama-3.3-70b-versatile",
  ]; // Διαθέσιμα μοντέλα

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value); // Ενημέρωση του μοντέλου
  };

  return (
    <div className="header">
      <div
        className={`toggle-sidebar ${
          isHidden ? "toggle-right" : "toggle-left"
        }`}
        onClick={toggleSidebar}
      >
        <PiSidebar />
      </div>
      <div className="headerIn">
        <div className="model">
          <strong>Model:</strong>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="model-select"
          >
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        
        <div className="loginbut">
          <Link to="/" className="toLink">
            <p>Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;