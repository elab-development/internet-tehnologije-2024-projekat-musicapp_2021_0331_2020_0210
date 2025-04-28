import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Particles from './Particles';
import Card from './Card';

// heading image in public/images/events.png
const HEADING_SRC = '/images/events.png';

export default function Events() {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [sortAsc, setSortAsc]     = useState(true);
  const [page, setPage]           = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem('auth_token');
        const { data } = await axios.get(
          'http://127.0.0.1:8000/api/events',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // assume payload is array under data
        setEvents(data.data || data);
      } catch (err) {
        setError('Could not load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // filter + sort
  const filtered = events
    .filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const da = new Date(a.starts_at), db = new Date(b.starts_at);
      return sortAsc ? da - db : db - da;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData   = filtered.slice(
    (page-1)*pageSize,
    (page-1)*pageSize + pageSize
  );

  const goToDetails = (id) => {
    // e.g. navigate(`/events/${id}`) if using react-router
    window.location.href = `/events/${id}`;
  };

  if (loading) return <div className="events-loading">Loading…</div>;
  if (error)   return <div className="events-error">{error}</div>;

  return (
    <div className="events-page">
      <Particles
        particleColors={['#42a5f5','#1e88e5']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        alphaParticles={false}
        cameraDistance={20}
      />

      <header className="events-header">
        <img src={HEADING_SRC} alt="Events" />
      </header>

      <div className="events-controls">
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={(e)=>{setSearch(e.target.value); setPage(1);}}
        />
        <button onClick={()=>setSortAsc(!sortAsc)}>
          Sort: {sortAsc ? 'Oldest first' : 'Newest first'}
        </button>
      </div>

      <div className="events-grid">
        {pageData.map((ev) => (
          <Card
            key={ev.id}
            event={ev}
            onViewDetails={goToDetails}
          />
        ))}
      </div>

      <footer className="events-pagination">
        <button
          onClick={()=>setPage((p)=>Math.max(1,p-1))}
          disabled={page===1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={()=>setPage((p)=>Math.min(totalPages,p+1))}
          disabled={page===totalPages}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
