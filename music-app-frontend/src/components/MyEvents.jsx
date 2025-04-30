import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from './Particles';
import Breadcrumbs from './Breadcrumbs';

// heading image
const HEADING_SRC = '/images/my-events.png';

// Custom card component for managers (no View Details button)
const ManagerEventCard = ({ event, onDelete }) => {
  const {
    image_url,
    title,
    venue,
    author,
    starts_at,
    ends_at,
  } = event;

  // Format dates nicely
  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="card">
      <div className="card-image">
        <img src={image_url} alt={title} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-venue">
          {venue.address}, {venue.city}, {venue.country}
        </p>
        <p className="card-author">
          {author.name}, {author.music_genre}
        </p>
        <p className="card-dates">
          {formatDate(starts_at)} – {formatDate(ends_at)}
        </p>
        <div className="card-actions">
          <button 
            className="card-button delete-button full-width"
            onClick={() => onDelete(event.id)}
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal component for creating events
const CreateEventModal = ({ isOpen, onClose, onCreate, venues, authors, isLoadingOptions }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    starts_at: '',
    ends_at: '',
    venue_id: '',
    author_id: '',
    tickets_capacity: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    // Validate tickets capacity
    if (!formData.tickets_capacity || formData.tickets_capacity < 1) {
      setFormError('Tickets capacity is required and must be at least 1');
      setIsSubmitting(false);
      return;
    }

    try {
      await onCreate(formData);
      // Reset form and close modal on success
      setFormData({
        title: '',
        description: '',
        image_url: '',
        starts_at: '',
        ends_at: '',
        venue_id: '',
        author_id: '',
        tickets_capacity: 50
      });
      onClose();
    } catch (err) {
      setFormError('Failed to create event. Please check your inputs and try again.');
      console.error('Error creating event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure form dates are in the correct format for datetime-local input
  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  // Close modal when clicking on the overlay (outside the modal content)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Event</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        {formError && <div className="form-error">{formError}</div>}
        
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label htmlFor="title">
              Event Title <span className="required-field">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required-field">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Describe your event"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image_url">
              Image URL <span className="required-field">*</span>
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="starts_at">
                Start Date/Time <span className="required-field">*</span>
              </label>
              <input
                type="datetime-local"
                id="starts_at"
                name="starts_at"
                value={formatDateForInput(formData.starts_at)}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="ends_at">
                End Date/Time <span className="required-field">*</span>
              </label>
              <input
                type="datetime-local"
                id="ends_at"
                name="ends_at"
                value={formatDateForInput(formData.ends_at)}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="venue_id">
              Venue <span className="required-field">*</span>
            </label>
            <select
              id="venue_id"
              name="venue_id"
              value={formData.venue_id}
              onChange={handleChange}
              required
              disabled={isLoadingOptions}
            >
              {isLoadingOptions ? (
                <option value="">Loading venues...</option>
              ) : (
                <>
                  <option value="">Select a venue</option>
                  {Array.isArray(venues) && venues.length > 0 ? venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.address}, {venue.city}
                    </option>
                  )) : (
                    <option value="" disabled>No venues available</option>
                  )}
                </>
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="author_id">
              Artist/Author <span className="required-field">*</span>
            </label>
            <select
              id="author_id"
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              required
              disabled={isLoadingOptions}
            >
              {isLoadingOptions ? (
                <option value="">Loading artists...</option>
              ) : (
                <>
                  <option value="">Select an artist</option>
                  {Array.isArray(authors) && authors.length > 0 ? authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name} - {author.music_genre}
                    </option>
                  )) : (
                    <option value="" disabled>No artists available</option>
                  )}
                </>
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tickets_capacity">
              Tickets Capacity <span className="required-field">*</span>
            </label>
            <input
              type="number"
              id="tickets_capacity"
              name="tickets_capacity"
              min="1"
              max="1000"
              value={formData.tickets_capacity}
              onChange={handleChange}
              required
              placeholder="Number of available tickets"
              className={formData.tickets_capacity < 1 ? 'input-error' : ''}
            />
            <small className="field-hint">Required - Enter the total number of tickets available for this event</small>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-form-btn"
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function MyEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [fetchingOptions, setFetchingOptions] = useState(false);

  // Debug effect to monitor venues and authors
  useEffect(() => {
    if (venues.length > 0) {
      console.log('Venues updated:', venues);
    }
    if (authors.length > 0) {
      console.log('Authors updated:', authors);
    }
  }, [venues, authors]);

  const fetchEvents = useCallback(async () => {
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
        'http://127.0.0.1:8000/api/events/my',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEvents(data.data || data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Could not load your events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchOptionsForModal = async () => {
    setFetchingOptions(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      
      // Fetch venues
      const venuesResponse = await axios.get(
        'http://127.0.0.1:8000/api/venues',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Parse the response carefully, handle different response formats
      let venuesData = [];
      if (venuesResponse.data) {
        if (Array.isArray(venuesResponse.data)) {
          venuesData = venuesResponse.data;
        } else if (venuesResponse.data.data && Array.isArray(venuesResponse.data.data)) {
          venuesData = venuesResponse.data.data;
        }
      }
      
      setVenues(venuesData);
      console.log('Loaded venues:', venuesData.length);
      
      // Fetch authors/artists
      const authorsResponse = await axios.get(
        'http://127.0.0.1:8000/api/authors',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Parse the response carefully, handle different response formats
      let authorsData = [];
      if (authorsResponse.data) {
        if (Array.isArray(authorsResponse.data)) {
          authorsData = authorsResponse.data;
        } else if (authorsResponse.data.data && Array.isArray(authorsResponse.data.data)) {
          authorsData = authorsResponse.data.data;
        }
      }
      
      setAuthors(authorsData);
      console.log('Loaded authors:', authorsData.length);
      
    } catch (err) {
      console.error('Error fetching options for modal:', err);
      // More detailed error message
      alert(`Could not load venues and artists. Error: ${err.message || 'Unknown error'}`);
      setIsModalOpen(false);
    } finally {
      setFetchingOptions(false);
    }
  };

  const handleCreateEvent = () => {
    setIsModalOpen(true);
    fetchOptionsForModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateEventSubmit = async (formData) => {
    const token = sessionStorage.getItem('auth_token');
    
    try {
      // First create the event
      const response = await axios.post(
        'http://127.0.0.1:8000/api/events',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const eventId = response.data.data.id;
      
      // Then create seats with proper row identifiers
      const seats = [];
      const totalCapacity = formData.tickets_capacity;
      let seatsCreated = 0;
      
      // Row 1: S, S1, S2, S3, ..., S18 (19 seats)
      const row1Labels = ['S', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18'];
      
      // Create first row (or partial row if capacity < 19)
      for (let i = 0; i < Math.min(19, totalCapacity); i++) {
        seats.push({
          position: row1Labels[i],
          is_reserved: false
        });
        seatsCreated++;
      }
      
      if (totalCapacity > 19) {
        // Row 2: S19, S20, ..., S38
        for (let i = 19; i < Math.min(38, totalCapacity); i++) {
          seats.push({
            position: `S${i}`,
            is_reserved: false
          });
          seatsCreated++;
        }
      }
      
      if (totalCapacity > 38) {
        // Row 3: S39, S40, ..., S57
        for (let i = 39; i < Math.min(58, totalCapacity); i++) {
          seats.push({
            position: `S${i}`,
            is_reserved: false
          });
          seatsCreated++;
        }
      }
      
      // If we need more seats, continue the pattern
      if (seatsCreated < totalCapacity) {
        let nextSeat = 58;
        while (seatsCreated < totalCapacity) {
          seats.push({
            position: `S${nextSeat}`,
            is_reserved: false
          });
          nextSeat++;
          seatsCreated++;
        }
      }
      
      // Create seats for the event
      await axios.post(
        `http://127.0.0.1:8000/api/events/${eventId}/seats`,
        { seats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the events list
      fetchEvents();
    } catch (err) {
      console.error('Error creating event or seats:', err);
      alert('Failed to create event or seats. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.delete(
        `http://127.0.0.1:8000/api/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove from state
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete the event. Please try again.');
    }
  };

  if (loading) return <div className="events-loading">Loading…</div>;
  if (error) return <div className="events-error">{error}</div>;

  return (
    <div className="events-page my-events-page">
      <Particles
        particleColors={['#e3f2fd', '#bbdefb', '#90caf9']}
        particleCount={150}
        particleSpread={8}
        speed={0.1}
      />

      <header className="events-header">
        <img src={HEADING_SRC} alt="My Events" />
      </header>

      <Breadcrumbs />

      <div className="events-controls">
        <button 
          className="create-event-btn"
          onClick={handleCreateEvent}
        >
          Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>You haven't created any events yet.</p>
          <button onClick={handleCreateEvent}>Create Your First Event</button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <ManagerEventCard
              key={event.id}
              event={event}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Modal for creating events */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateEventSubmit}
        venues={venues}
        authors={authors}
        isLoadingOptions={fetchingOptions}
      />
    </div>
  );
} 