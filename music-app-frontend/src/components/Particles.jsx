import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
  uniform float uTime, uSpread, uBaseSize, uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor  = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime, uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    if (uAlphaParticles < 0.5) {
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className,
}) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) return;

    // 1) Setup renderer
    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    mount.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    // 2) Scene root
    const scene = new Transform();

    // 3) Camera
    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    // 4) Resize handling
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };
    window.addEventListener("resize", resize);
    resize();

    // 5) Mouse move
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };
    if (moveParticlesOnHover) {
      mount.addEventListener("mousemove", handleMouse);
    }

    // 6) Buffers
    const count = particleCount;
    const posArr = new Float32Array(count * 3);
    const rndArr = new Float32Array(count * 4);
    const colArr = new Float32Array(count * 3);
    const palette = (particleColors && particleColors.length) ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x*x + y*y + z*z;
      } while (len > 1 || len === 0);

      const r = Math.cbrt(Math.random());
      posArr.set([x * r, y * r, z * r], i*3);
      rndArr.set([Math.random(),Math.random(),Math.random(),Math.random()], i*4);
      const col = hexToRgb(palette[Math.floor(Math.random()*palette.length)]);
      colArr.set(col, i*3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: posArr },
      random:   { size: 4, data: rndArr },
      color:    { size: 3, data: colArr },
    });

    // 7) Program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime:           { value: 0 },
        uSpread:         { value: particleSpread },
        uBaseSize:       { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    // 8) Mesh → scene
    const particles = new Mesh(gl, {
      mode: gl.POINTS,
      geometry,
      program,
    });
    scene.addChild(particles);

    // 9) Animate
    let last = performance.now();
    let elapsed = 0;
    let frameId;
    const update = (t) => {
      frameId = requestAnimationFrame(update);
      const dt = t - last;
      last = t;
      elapsed += dt * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene, camera });
    };
    update(last);

    // 10) Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        mount.removeEventListener("mousemove", handleMouse);
      }
      cancelAnimationFrame(frameId);
      // remove canvas, no renderer.dispose()
      if (mount.contains(gl.canvas)) {
        mount.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount, particleSpread, speed,
    moveParticlesOnHover, particleHoverFactor,
    alphaParticles, particleBaseSize, sizeRandomness,
    cameraDistance, disableRotation, particleColors
  ]);

  return (
    <div
      ref={containerRef}
      className={`particles-container ${className || ""}`}
    />
  );
}
