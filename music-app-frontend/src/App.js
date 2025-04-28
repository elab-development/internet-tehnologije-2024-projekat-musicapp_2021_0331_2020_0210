import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Authentication page */}
        <Route path="/auth" element={<Auth />} />

      </Routes>
    </Router>
  );
}

export default App;
