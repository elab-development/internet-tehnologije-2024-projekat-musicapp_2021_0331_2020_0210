import React from 'react';

export default function Card({ event, onViewDetails }) {
  // Destrukturiranje podataka iz event objekta
  const {
    image_url,
    title,
    venue,
    author,
    starts_at,
    ends_at,
  } = event;

  // Pomoćna funkcija za formatiranje ISO datuma u lokalni prikaz
  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',  // npr. Apr 25, 2025
      timeStyle: 'short',   // npr. 4:21 AM
    });

  return (
    <div className="card">
      {/* Slika događaja */}
      <div className="card-image">
        <img src={image_url} alt={title} />
      </div>

      {/* Glavni sadržaj kartice */}
      <div className="card-body">
        {/* Naslov događaja */}
        <h3 className="card-title">{title}</h3>

        {/* Lokacija: adresa, grad, država */}
        <p className="card-venue">
          {venue.address}, {venue.city}, {venue.country}
        </p>

        {/* Autor i muzički žanr */}
        <p className="card-author">
          {author.name}, {author.music_genre}
        </p>

        {/* Vreme početka i kraja */}
        <p className="card-dates">
          {formatDate(starts_at)} – {formatDate(ends_at)}
        </p>

        {/* Dugme za prikaz detalja */}
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
