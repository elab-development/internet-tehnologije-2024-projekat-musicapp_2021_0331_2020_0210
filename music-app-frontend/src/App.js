import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import Auth    from './components/Auth';
import Home    from './components/Home';
import Menu    from './components/Menu';
import Loading from './components/Loading';
import Footer   from './components/Footer';
import Events   from './components/Events';
import Event from './components/EventDetails';
import MyReservations from './components/MyReservations';
import MyEvents from './components/MyEvents';
import ReservationsForMyEvents from './components/ReservationsForMyEvents';
import Users from './components/Users';
import './App.css';

function App() {
  return (
    <Router>
      <AppWithLoading />
    </Router>
  );
}

function AppWithLoading() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Compute login state each render
  const isLoggedIn = Boolean(sessionStorage.getItem('auth_token'));
  const user = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
  const isEventManager = user?.role === 'event_manager';
  const isAdministrator = user?.role === 'administrator';

  // Show loading overlay on every route change
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, [location]);

  // While loading, show spinner + aurora
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Menu only if we have a token */}
      {isLoggedIn && <Menu />}

      <Routes>
        {/* Redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Always allow /auth so users can log in */}
        <Route path="/auth" element={<Auth />} />

        {/* Protect /home */}
        <Route
          path="/home"
          element={
            isLoggedIn
              ? <Home />
              : <Navigate to="/auth" replace />
          }
        />

        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Event />} />
        <Route 
          path="/my-reservations" 
          element={
            isLoggedIn
              ? <MyReservations />
              : <Navigate to="/auth" replace />
          }
        />
        
        {/* Administrator Routes */}
        <Route 
          path="/users" 
          element={
            isLoggedIn && isAdministrator
              ? <Users />
              : <Navigate to="/auth" replace />
          }
        />
        
        {/* Event Manager Routes */}
        <Route 
          path="/my-events" 
          element={
            isLoggedIn && isEventManager
              ? <MyEvents />
              : <Navigate to="/auth" replace />
          }
        />
        <Route 
          path="/reservations-for-my-events" 
          element={
            isLoggedIn && isEventManager
              ? <ReservationsForMyEvents />
              : <Navigate to="/auth" replace />
          }
        />
      </Routes>

      {isLoggedIn && <Footer />}
    </>
  );
}

export default App;
