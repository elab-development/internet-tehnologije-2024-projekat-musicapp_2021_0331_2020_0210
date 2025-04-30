import { useState, useEffect } from 'react';
import fetchJsonp from '../utils/fetchJsonpHelper';

export default function usePopularMusicians() {
  const [artists, setArtists] = useState([]);      // stanje za listu popularnih umetnika
  const [loading, setLoading] = useState(true);    // indikator učitavanja
  const [error, setError]     = useState('');      // poruka o grešci

  useEffect(() => {
    const callback = 'dzCallback_' + Math.random().toString(36).slice(2);  
    const url = 'https://api.deezer.com/chart/0/artists?limit=5';

    // šaljemo JSONP zahteve Deezer API‑ju
    fetchJsonp(url, callback)
      .then((resp) => {
        // Deezer JSONP vraća objekat { data: [ … ] }
        setArtists(resp.data || []);               // postavi listu umetnika ili prazan niz
      })
      .catch((e) => {
        console.error('Deezer JSONP error', e);
        setError('Could not load popular artists.'); // postavi poruku o grešci
      })
      .finally(() => {
        setLoading(false);                         // isključi indikator učitavanja
      });
  }, []);

  return { artists, loading, error };             // izvezi stanje iz hook‑a
}
