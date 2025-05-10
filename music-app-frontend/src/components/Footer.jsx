import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import clickAnim from '../assets/click.json';
import musicAnim from '../assets/music.json';

export default function Footer() {
  // stanje koje prati da li je audio trenutno pušten
  const [playing, setPlaying] = useState(false);
  // ref na Audio objekat za reprodukciju
  const audioRef = useRef(null);

  // funkcija koja pokreće ili pauzira audio i menja animaciju
  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/music.mp3');
      audioRef.current.loop = true;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <footer className="footer">
      {/* levi deo footera: copyright tekst */}
      <div className="footer-left">
        &copy; {new Date().getFullYear()} Musify. All rights reserved.
      </div>

      {/* centar footera: logo ikonica */}
      <div className="footer-center">
        <img
          src="/images/musify-icon.png"
          alt="Musify Logo"
          className="footer-logo"
        />
      </div>

      {/* desni deo footera: tekst i Lottie animacija */}
      <div className="footer-right" onClick={togglePlay}>
        {/* prikaz teksta samo kada se audio ne reprodukuje */}
        {!playing && <span className="click-text">Click me</span>}

        {/* Lottie animacija zavisno od stanja playing */}
        <Lottie
          animationData={playing ? musicAnim : clickAnim}
          loop
          className={playing ? 'music-lottie' : 'click-lottie'}
        />
      </div>
    </footer>
  );
}
