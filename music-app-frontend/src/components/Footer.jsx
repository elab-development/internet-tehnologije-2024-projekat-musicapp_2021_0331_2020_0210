import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import clickAnim from '../assets/click.json';
import musicAnim from '../assets/music.json';

export default function Footer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

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
      <div className="footer-left">
        &copy; {new Date().getFullYear()} Musify. All rights reserved.
      </div>

      <div className="footer-center">
        <img
          src="/images/musify-icon.png"
          alt="Musify Logo"
          className="footer-logo"
        />
      </div>

      <div className="footer-right" onClick={togglePlay}>
        {!playing && <span className="click-text">Click me</span>}

        <Lottie
          animationData={playing ? musicAnim : clickAnim}
          loop
          className={playing ? "music-lottie" : "click-lottie"}
        />
      </div>
    </footer>
  );
}
