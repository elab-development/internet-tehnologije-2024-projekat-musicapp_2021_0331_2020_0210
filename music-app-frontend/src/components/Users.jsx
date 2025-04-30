import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';
import Breadcrumbs from './Breadcrumbs';

// heading image
const HEADING_SRC = '/images/users.png';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const user = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
        if (user?.role !== 'administrator') {
          navigate('/home');
          return;
        }

        const { data } = await axios.get(
          'http://127.0.0.1:8000/api/buyers',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setUsers(data.data || data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Could not load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <Particles
          particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
          particleCount={150}
          particleSpread={8}
          speed={0.1}
        />
        <div className="loading-content">
          <div className="loader"></div>
          <p>Loading users data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container error-container">
        <Particles
          particleColors={['#f5c6cb', '#f8d7da', '#f5c6cb']}
          particleCount={150}
          particleSpread={8}
          speed={0.1}
        />
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container users-page">
      <Particles
        particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
        particleCount={150}
        particleSpread={8}
        speed={0.1}
      />

      <div className="content-wrapper">
        <header className="page-header users-header">
          <img src={HEADING_SRC} alt="Users" className="header-image-small" />
        </header>
        
        <Breadcrumbs />

        <div className="users-content">
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h2>No Users Found</h2>
              <p>There are no users registered in the system.</p>
            </div>
          ) : (
            <div className="table-container users-table-container">
              <div className="table-responsive">
                <table className="data-table users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div className="user-name-cell">
                            <span className="user-avatar-small">{user.name.charAt(0).toUpperCase()}</span>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 