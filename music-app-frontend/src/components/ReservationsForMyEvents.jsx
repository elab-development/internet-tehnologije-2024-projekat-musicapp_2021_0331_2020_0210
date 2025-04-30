import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';
import Breadcrumbs from './Breadcrumbs';

// heading image
const HEADING_SRC = '/images/reservations-for-my-events.png';

export default function ReservationsForMyEvents() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

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

        const user = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
        if (user?.role !== 'event_manager') {
          navigate('/home');
          return;
        }

        const { data } = await axios.get(
          'http://127.0.0.1:8000/api/reservations/events',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setReservations(data.data || data);
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

  const updateReservationStatus = async (reservationId, newStatus) => {
    setUpdateLoading(true);
    
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.patch(
        `http://127.0.0.1:8000/api/reservations/${reservationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setReservations(reservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus } 
          : reservation
      ));
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
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
        <img src={HEADING_SRC} alt="Reservations For My Events" />
      </header>

      <Breadcrumbs />

      {reservations.length === 0 ? (
        <div className="no-reservations">
          <p>There are no reservations for your events yet.</p>
          <button onClick={() => navigate('/my-events')}>Manage My Events</button>
        </div>
      ) : (
        <div className="reservations-table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>User</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.event.title}</td>
                  <td>{reservation.user.name}</td>
                  <td>
                    {new Date(reservation.event.starts_at).toLocaleDateString()}
                    <div className="time-detail">
                      {new Date(reservation.event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
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
                    <div className="reservation-actions-container">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            className="status-btn confirm-btn"
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            disabled={updateLoading}
                          >
                            Confirm
                          </button>
                          <button
                            className="status-btn cancel-btn"
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            disabled={updateLoading}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button
                          className="status-btn cancel-btn"
                          onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                      )}
                      {reservation.status === 'cancelled' && (
                        <button
                          className="status-btn confirm-btn"
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          disabled={updateLoading}
                        >
                          Reconfirm
                        </button>
                      )}
                    </div>
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