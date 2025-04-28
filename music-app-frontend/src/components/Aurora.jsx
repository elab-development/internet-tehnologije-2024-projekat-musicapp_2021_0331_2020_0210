import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Transform } from "ogl";

// hex "#rrggbb" → normalized [r,g,b]
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const i = parseInt(hex, 16);
  return [((i >> 16) & 255) / 255, ((i >> 8) & 255) / 255, (i & 255) / 255];
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
   -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
  + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(0.5 - vec3(
    dot(x0, x0),
    dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)
  ), 0.0);
  m = m * m * m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) { \
  int idx = 0;                                  \
  for (int i = 0; i < 2; i++) {                 \
    bool between = colors[i].position <= factor;\
    idx = int(mix(float(idx), float(i), float(between))); \
  }                                             \
  ColorStop c0 = colors[idx];                   \
  ColorStop c1 = colors[idx + 1];               \
  float span = c1.position - c0.position;       \
  float f    = (factor - c0.position) / span;   \
  finalColor = mix(c0.color, c1.color, f);      \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop stops[3];
  stops[0] = ColorStop(uColorStops[0], 0.0);
  stops[1] = ColorStop(uColorStops[1], 0.5);
  stops[2] = ColorStop(uColorStops[2], 1.0);

  vec3 ramp;
  COLOR_RAMP(stops, uv.x, ramp);

  float n = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25));
  float h = exp(n * 0.5 * uAmplitude);
  h = uv.y * 2.0 - h + 0.2;
  float intensity = 0.6 * h;

  float mid = 0.20;
  float alpha = smoothstep(mid - uBlend * 0.2, mid + uBlend * 0.2, intensity);

  vec3 color = intensity * ramp;
  fragColor = vec4(color * alpha, alpha);
}
`;

export default function Aurora({
  colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
  amplitude  = 1.0,
  blend      = 0.5,
  speed      = 0.5,
}) {
  const containerRef = useRef();
  const propsRef     = useRef({ colorStops, amplitude, blend, speed });
  propsRef.current   = { colorStops, amplitude, blend, speed };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha:            true,
      premultipliedAlpha: true,
      antialias:         true,
    });
    const gl = renderer.gl;
    gl.clearColor(0,0,0,0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const initialStops = colorStops.map(hexToRgb);

    const program = new Program(gl, {
      vertex:   VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: amplitude },
        uBlend:      { value: blend },
        uColorStops: { value: initialStops },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      },
    });

    // scene root
    const scene = new Transform();
    const mesh  = new Mesh(gl, { geometry, program });
    scene.addChild(mesh);

    // resize
    const resize = () => {
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      renderer.setSize(W, H);
      program.uniforms.uResolution.value = [W, H];
    };
    window.addEventListener("resize", resize);
    resize();

    // animate
    let last = performance.now();
    let id;
    const animate = (now) => {
      id      = requestAnimationFrame(animate);
      const { colorStops, amplitude, blend, speed } = propsRef.current;
      const dt  = (now - last) * 0.001;
      last      = now;

      program.uniforms.uTime.value      += dt * speed;
      program.uniforms.uAmplitude.value  = amplitude;
      program.uniforms.uBlend.value      = blend;
      program.uniforms.uColorStops.value = colorStops.map(hexToRgb);

      renderer.render({ scene });
    };
    animate(last);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className="aurora-container" />;
}
