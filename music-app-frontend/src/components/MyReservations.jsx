import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';
import Breadcrumbs from './Breadcrumbs';

// heading image in public/images/my-reservations.png
const HEADING_SRC = '/images/my-reservations.png';

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const { data } = await axios.get(
          'http://127.0.0.1:8000/api/reservations/my',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // assume payload is array under data
        setReservations(data.data || data);
        console.log('Fetched reservations:', data.data || data);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Could not load reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const viewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) return <div className="reservations-loading">Loading…</div>;
  if (error) return <div className="reservations-error">{error}</div>;

  return (
    <div className="my-reservations-page">
      <Particles
        particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
        particleCount={150}
        particleSpread={8}
        speed={0.1}
      />

      <header className="reservations-header">
        <img src={HEADING_SRC} alt="My Reservations" />
      </header>

      <Breadcrumbs />

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>You don't have any reservations yet.</p>
          <button onClick={() => navigate('/events')}>Browse Events</button>
        </div>
      ) : (
        <div className="reservations-table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.event.title}</td>
                  <td>
                    {new Date(reservation.event.starts_at).toLocaleDateString()}
                    <div className="time-detail">
                      {new Date(reservation.event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>{reservation.event.venue?.name || 'N/A'}</td>
                  <td>
                    <div className="seats-container">
                      <span className="seat-count">{reservation.number_of_seats}</span>
                      {reservation.seats && (
                        <div className="seat-details">
                          {reservation.seats.map(seat => seat.position).join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`reservation-status ${getStatusClass(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-event-btn"
                      onClick={() => viewEvent(reservation.event.id)}
                    >
                      View Event
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 