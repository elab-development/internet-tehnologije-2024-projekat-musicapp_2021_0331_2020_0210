import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
<<<<<<< HEAD
import Menu from './components/Menu';
import './App.css';
=======
import './App.css'
>>>>>>> de3c71b98a5132915f584f8ee55a9068a14ee808

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
        
        <Route path="/home" element={<Home />} />

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
