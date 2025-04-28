import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('auth_token');

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventData = () => {
    console.log('Fetching event with ID:', id);
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log('Event API response:', res.data);
        // Extract event data from the nested 'data' property
        const eventData = res.data.data || res.data;
        console.log('Extracted event data:', eventData);
        
        setEvent(eventData);
        // fallback to empty array if seats is undefined
        const eventSeats = Array.isArray(eventData.seats) ? eventData.seats : [];
        setSeats(eventSeats);
        
        // Log exact structure for debugging
        console.log('📌 Event data structure:', JSON.stringify(eventData, null, 2));
        console.log('📌 Venue data:', eventData.venue);
        console.log('📌 Author data:', eventData.author);
        console.log('📌 Manager data:', eventData.manager);
        console.log('📌 Seats data:', eventSeats);
        console.log('📌 Reserved seats:', eventSeats.filter(seat => seat.reserved).length);
      })
      .catch(err => {
        console.error('Error fetching event data:', err);
        setError(err.message || 'Failed to load event details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEventData();
  }, [id, token]);

  if (loading) {
    return <div className="event-details-loading">Loading…</div>;
  }

  if (error) {
    return <div className="event-details-error">Error: {error}</div>;
  }

  if (!event) {
    return <div className="event-details-loading">Event not found.</div>;
  }

  console.log('Current event state:', event);
  console.log('Event venue:', event.venue);
  console.log('Event author:', event.author);
  console.log('Event manager:', event.manager);

  // Organize seats by rows and columns
  // For positions like "A16", parse 'A' as row and '16' as column
  const groupedSeats = {};
  
  seats.forEach(seat => {
    if (!seat.position) return;
    
    try {
      // Extract row letter and column number
      const rowMatch = seat.position.match(/[A-Z]/);
      const numMatch = seat.position.match(/\d+/);
      
      if (!rowMatch || !numMatch) {
        console.error(`Invalid seat position format: ${seat.position}`);
        return;
      }
      
      const rowLetter = rowMatch[0];
      const colNumber = parseInt(numMatch[0], 10);
      
      // Initialize row if it doesn't exist
      if (!groupedSeats[rowLetter]) {
        groupedSeats[rowLetter] = {};
      }
      
      // Add seat to the row at the column position
      groupedSeats[rowLetter][colNumber] = seat;
    } catch (e) {
      console.error(`Error parsing seat position: ${seat.position}`, e);
    }
  });
  
  // Get sorted rows and columns for display
  const sortedRows = Object.keys(groupedSeats).sort();
  
  const toggleSeat = (seatId, isReserved) => {
    if (isReserved) {
      console.log(`Seat ${seatId} is already reserved, cannot select`);
      return;
    }
    
    setSelected(sel =>
      sel.includes(seatId)
        ? sel.filter(x => x !== seatId)
        : [...sel, seatId]
    );
  };

  const makeReservation = () => {
    if (!selected.length) return;
    setReserving(true);
    console.log('Making reservation for seats:', selected);
    axios
      .post(
        'http://127.0.0.1:8000/api/reservations',
        { 
          event_id: id, 
          seats: selected 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(response => {
        console.log('Reservation successful:', response.data);
        
        // Update event in state to reflect new reservation count
        if (event) {
          const updatedEvent = {
            ...event,
            tickets_reserved: event.tickets_reserved + selected.length
          };
          setEvent(updatedEvent);
          
          // Mark selected seats as reserved locally
          const updatedSeats = seats.map(seat => {
            if (selected.includes(seat.id)) {
              return { ...seat, reserved: true };
            }
            return seat;
          });
          setSeats(updatedSeats);
        }
        
        // Clear selection
        setSelected([]);
        
        alert('Reservation created successfully!');
        
        // Fetch fresh data from server to ensure we have the latest state
        fetchEventData();
      })
      .catch(error => {
        console.error('Reservation error:', error);
        alert('Could not complete reservation. Please try again.');
      })
      .finally(() => setReserving(false));
  };

  return (
    <div className="event-details-container">
      {/* Background particles animation */}
      <Particles
        className="event-details-particles"
        particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
        particleCount={150}
        particleSpread={8}
        speed={0.1}
      />

      {/* Main content wrapper */}
      <div className="event-details-content">
        {/* Header with event image */}
        <div className="event-details-header">
          <img src="/images/event.png" alt="Event" className="event-details-header-img" />
        </div>

        {/* Main Grid Layout */}
        <div className="event-details-grid">
          {/* Event Details Section */}
          <div className="grid-item event-info-section">
            <h2 className="grid-section-title">Event Title</h2>
            <h3 className="event-title">{event.title || 'No title available'}</h3>
            
            <h2 className="grid-section-title">Event description</h2>
            <p className="event-description">{event.description || 'No description available'}</p>
            
            <div className="event-meta">
              <div className="event-date-time">
                <h2 className="grid-section-title">Start at - Ends at</h2>
                <div className="event-time-value">
                  {event.starts_at && event.ends_at 
                    ? `${new Date(event.starts_at).toLocaleString()} - ${new Date(event.ends_at).toLocaleString()}`
                    : 'Date information not available'}
                </div>
              </div>
              
              <div className="event-tickets-info">
                <h2 className="grid-section-title">Tickets reserved / Tickets capacity</h2>
                <div className="tickets-count">
                  {typeof event.tickets_reserved !== 'undefined' && typeof event.tickets_capacity !== 'undefined'
                    ? `${event.tickets_reserved} / ${event.tickets_capacity}`
                    : 'Ticket information not available'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Author Card */}
          <div className="grid-item author-section">
            {event.author ? (
              <>
                <div className="author-image-container">
                  {event.author.image_url ? (
                    <img src={event.author.image_url} alt={event.author.name} className="author-image" />
                  ) : (
                    <div className="author-image-placeholder">Author image</div>
                  )}
                </div>
                <h2 className="author-name">{event.author.name || 'Unknown Author'}</h2>
                <div className="author-genre">{event.author.music_genre || 'Genre not specified'}</div>
              </>
            ) : (
              <div className="missing-data">Author information not available</div>
            )}
          </div>
          
          {/* Venue Section */}
          <div className="grid-item venue-section">
            {event.venue ? (
              <>
                <div className="venue-image-container">
                  {event.venue.image_url ? (
                    <img src={event.venue.image_url} alt={event.venue.name} className="venue-image" />
                  ) : (
                    <div className="venue-image-placeholder">Venue image</div>
                  )}
                </div>
                <div className="venue-details">
                  <h2 className="venue-name">{event.venue.name || 'Unknown Venue'}</h2>
                  <div className="venue-address">
                    {event.venue.address && event.venue.city && event.venue.country
                      ? `${event.venue.address}, ${event.venue.city}, ${event.venue.country}`
                      : 'Address not available'}
                  </div>
                  <div className="venue-capacity">
                    People capacity: {event.venue.capacity_people || 'Not specified'}
                  </div>
                </div>
              </>
            ) : (
              <div className="missing-data">Venue information not available</div>
            )}
          </div>
          
          {/* Manager Section */}
          <div className="grid-item manager-section">
            {event.manager ? (
              <>
                <div className="manager-image-container">
                  {event.manager.image_url ? (
                    <img src={event.manager.image_url} alt={event.manager.name} className="manager-image" />
                  ) : (
                    <div className="manager-image-placeholder">Manager image</div>
                  )}
                </div>
                <h2 className="manager-name">{event.manager.name || 'Unknown Manager'}</h2>
                <div className="manager-email">{event.manager.email || 'Email not available'}</div>
                <div className="manager-address">{event.manager.address || 'Address not available'}</div>
                <div className="manager-phone">{event.manager.phone || 'Phone not available'}</div>
              </>
            ) : (
              <div className="missing-data">Manager information not available</div>
            )}
          </div>
          
          {/* Seat Selection Section */}
          <div className="grid-item seat-selection-section">
            <h2 className="section-title">Select a Seat</h2>
            
            <div className="seat-legend">
              <div className="legend-item">
                <span className="seat-box reserved"></span>
                <span>reserved ({seats.filter(seat => seat.reserved).length})</span>
              </div>
              <div className="legend-item">
                <span className="seat-box free"></span>
                <span>free ({seats.filter(seat => !seat.reserved).length})</span>
              </div>
              <div className="legend-item">
                <span className="seat-box selected"></span>
                <span>selected ({selected.length})</span>
              </div>
            </div>
            
            <div className="selected-count">
              Selected seats: {selected.length}
            </div>
            
            <div className="theater-container">
              {seats.length > 0 ? (
                <div className="theater-layout">
                  {sortedRows.map((rowLetter, rowIndex) => (
                    <div key={rowLetter} className={`theater-row row-${rowIndex}`}>
                      <div className="row-label">{rowLetter}</div>
                      {Object.values(groupedSeats[rowLetter]).map((seat) => {
                        const seatStatus = seat.reserved 
                          ? 'reserved' 
                          : selected.includes(seat.id) 
                          ? 'selected' 
                          : 'free';
                        
                        return (
                          <div 
                            key={seat.id}
                            className={`theater-seat ${seatStatus}`}
                            title={`Seat ${seat.position}${seat.reserved ? ' (Reserved)' : ''}`}
                            onClick={() => toggleSeat(seat.id, seat.reserved)}
                          >
                            <span className="seat-label">{seat.position}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-seats-message">No seats available for this event</div>
              )}
              <div className="stage">Stage</div>
            </div>
            
            <div className="reservation-actions">
              <button
                className="reserve-button"
                onClick={makeReservation}
                disabled={!selected.length || reserving}
              >
                {reserving ? 'Reserving…' : `Reserve ${selected.length} seat${selected.length !== 1 ? 's' : ''}`}
              </button>
              <button className="cancel-button" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
            
            {/* Fixed mobile reservation button */}
            <div className="mobile-reservation-action">
              <button
                className="make-reservation-button"
                onClick={makeReservation}
                disabled={!selected.length || reserving}
              >
                {`Make a reservation (${selected.length} seat${selected.length !== 1 ? 's' : ''})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
