import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPower } from 'react-icons/fi';

export default function Menu() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('auth_token');
  const user  = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
  const isEventManager = user?.role === 'event_manager';
  const isAdministrator = user?.role === 'administrator';

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      sessionStorage.clear();
      navigate('/auth');
    }
  };

  return (
    <div className="menu-container">
      {/* LEFT NAV: slides in on hover */}
      <div className="menu-left">
        <NavLink to="/home" className="menu-link" style={{marginLeft: '35px'}}>Home</NavLink>
        
        {isAdministrator ? (
          <NavLink to="/users" className="menu-link">Users</NavLink>
        ) : isEventManager ? (
          <>
            <NavLink to="/my-events" className="menu-link">My Events</NavLink>
            <NavLink to="/reservations-for-my-events" className="menu-link">Reservations</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/events" className="menu-link">Events</NavLink>
            <NavLink to="/my-reservations" className="menu-link">My Reservations</NavLink>
          </>
        )}
      </div>

      {/* CENTER ICON: spins on hover */}
      <div className="menu-center">
        <img
          src="/images/musify-icon.png"
          alt="Musify"
          className="center-icon"
        />
      </div>

      {/* RIGHT USER INFO + LOGOUT */}
      <div className="menu-right">
        {user && (
          <div className="user-info">
            <img
              src={user.imageUrl || '/images/default-avatar.png'}
              alt={user.name}
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <br></br>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <FiPower size={20} className="logout-icon" />
        </button>
      </div>
    </div>
  );
}
