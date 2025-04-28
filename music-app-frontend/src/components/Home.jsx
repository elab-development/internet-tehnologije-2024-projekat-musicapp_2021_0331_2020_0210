import React from "react";
import Particles from "./Particles";
import Lottie from "lottie-react";
import boyAnimation from "../assets/boy.json";

export default function Home() {
  return (
    <div className="home-container">
      <Particles
        particleColors={["#42a5f5", "#1e88e5"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        alphaParticles={false}
        cameraDistance={20}
      />

      <div className="home-content-wrapper">
        <div className="home-lottie">
          <Lottie
            animationData={boyAnimation}
            loop
            autoplay
            style={{ maxWidth: 350, width: "100%", height: "auto" }}
          />
        </div>

        <div className="home-text-block">
          {/* Use the generated PNG here */}
          <img
            src="/images/Welcome_to_Musify.png"
            alt="Welcome to Musify"
            className="home-heading-img"
          />


          <h2 className="home-subheading">Your ultimate music events hub</h2>
          <p className="home-text">
            Discover, stream, and share an endless mix of music events and concerts from
            emerging and world‑famous artists—all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
