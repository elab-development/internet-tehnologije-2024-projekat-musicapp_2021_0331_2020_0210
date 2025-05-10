import React from 'react';
import Aurora from './Aurora';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';

export default function Loading() {
  return (
    <div className="loading-wrapper">
      {/* Pozadinski aurora efekat */}
      <Aurora
        colorStops={['#87CEFA', '#81D8D0', '#1ca9c9']}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      {/* Prednji sadržaj: logo i animacija */}
      <div className="loading-content">
        {/* Logo ikonica i tekst */}
        <div className="loading-logo">
          <img
            src="/images/musify-icon.png"
            alt="Musify Icon"
            className="loading-icon"
          />
          <img
            src="/images/musify-text.png"
            alt="Musify Text"
            className="loading-text"
          />
        </div>

        {/* Lottie animacija učitavanja */}
        <div className="loading-lottie">
          <Lottie animationData={loadingAnimation} loop />
        </div>
      </div>
    </div>
  );
}
