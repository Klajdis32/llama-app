import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './Components/Chat/Chat.js';
import Sidebar from './Components/Base/Sidebar/Sidebar.js';
import Header from './Components/Base/Header/Header.js';

function App() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <Router>
      <div className={`app-layout ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
        <Sidebar isHidden={isSidebarHidden} />
        <div className="app-main">
          {/* Πέρασμα toggleSidebar στο Header */}
          <Header isHidden={isSidebarHidden} toggleSidebar={toggleSidebar} />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<ChatWH />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

function ChatWH() {
  useDocumentTitle("Chat");
  return <Chat />;
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default App;