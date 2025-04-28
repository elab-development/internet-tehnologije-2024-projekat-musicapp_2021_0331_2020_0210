import React from 'react';
import Aurora from './Aurora';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json'; // your Lottie file

export default function Loading() {
  return (
    <div className="loading-wrapper">
      {/* Aurora background */}
      <Aurora
        colorStops={["#87CEFA", "#81D8D0", "#1ca9c9"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      {/* Foreground content */}
      <div className="loading-content">
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
        <div className="loading-lottie">
          <Lottie animationData={loadingAnimation} loop />
        </div>
      </div>
    </div>
  );
}
