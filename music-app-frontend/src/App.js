import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Menu from './components/Menu';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(sessionStorage.getItem('auth_token'))
  );

  useEffect(() => {
    // Poll sessionStorage every second
    const id = setInterval(() => {
      const hasToken = Boolean(sessionStorage.getItem('auth_token'));
      setIsLoggedIn(hasToken);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <Router>
      {/* Show the Menu only when logged in */}
      {isLoggedIn && <Menu />}

      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Authentication page (always accessible) */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected home: if not logged in, go back to /auth */}
        <Route
          path="/home"
          element={
            isLoggedIn
              ? <Home />
              : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
