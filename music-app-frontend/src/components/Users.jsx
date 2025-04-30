import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';
import Breadcrumbs from './Breadcrumbs';

// slika zaglavlja iz public/images/users.png
const HEADING_SRC = '/images/users.png';

export default function Users() {
  // hook za navigaciju između ruta
  const navigate = useNavigate();
  // stanja komponente
  const [users, setUsers]           = useState([]);    // lista korisnika
  const [loading, setLoading]       = useState(true);  // indikator učitavanja
  const [error, setError]           = useState('');    // poruka o grešci

  // efekat koji pri mount-u učitava korisnike
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);    // prikaz loader-a
      setError('');        // reset poruke o grešci

      try {
        const token = sessionStorage.getItem('auth_token');
        // ako nema tokena, preusmeri na login
        if (!token) {
          navigate('/auth');
          return;
        }

        // proveravamo da li je uloga administrator
        const currentUser = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
        if (currentUser?.role !== 'administrator') {
          navigate('/home');
          return;
        }

        // GET zahtev za listu buyer korisnika
        const { data } = await axios.get(
          'http://127.0.0.1:8000/api/buyers',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // postavljamo povratne podatke u state
        setUsers(data.data || data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Could not load users. Please try again later.');
      } finally {
        setLoading(false);  // isključujemo loader
      }
    };

    fetchUsers();
  }, [navigate]);

  // prikaz loader-a sa posebnom animacijom i porukom
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

  // prikaz ekrana za grešku sa retry opcijom
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

  // glavni prikaz stranice sa tabelom korisnika ili praznim stanjem
  return (
    <div className="page-container users-page">
      {/* pozadinska čestica animacija */}
      <Particles
        particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
        particleCount={150}
        particleSpread={8}
        speed={0.1}
      />

      <div className="content-wrapper">
        {/* zaglavlje sa malom slikom */}
        <header className="page-header users-header">
          <img src={HEADING_SRC} alt="Users" className="header-image-small" />
        </header>
        
        {/* breadcrumbs navigacija */}
        <Breadcrumbs />

        {/* sadržaj tabele ili prazno stanje */}
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
                    {users.map(user => (
                      <tr key={user.id}>
                        {/* ID korisnika */}
                        <td>{user.id}</td>
                        {/* ime i avatar iz inicijala */}
                        <td>
                          <div className="user-name-cell">
                            <span className="user-avatar-small">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        {/* email */}
                        <td>{user.email}</td>
                        {/* uloga sa badgom */}
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        {/* datum registracije */}
                        <td>
                          {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
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
