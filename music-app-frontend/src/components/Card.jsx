import React from 'react';

export default function Card({ event, onViewDetails }) {
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
        <button
          className="card-button"
          onClick={() => onViewDetails(event.id)}
        >
          View details
        </button>
      </div>
    </div>
  );
}
