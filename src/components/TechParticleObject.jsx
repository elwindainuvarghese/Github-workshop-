import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── SHADER CODE ───────────────────────────────────────────────────────────
const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform float uMouseRadius;

attribute vec3 aPositionB;
attribute vec3 aPositionC;
attribute vec3 aColor;

varying vec3 vColor;

// Classic 3D Simplex Noise function (by Ashima Arts)
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vColor = aColor;

  // 1. Morphing Logic
  vec3 targetPos;
  if (uProgress < 1.0) {
    // Morph between Shape A (position) and Shape B
    float t = smoothstep(0.0, 1.0, uProgress);
    targetPos = mix(position, aPositionB, t);
  } else {
    // Morph between Shape B and Shape C
    float t = smoothstep(0.0, 1.0, uProgress - 1.0);
    targetPos = mix(aPositionB, aPositionC, t);
  }

  // 2. Organic Noise (Drift)
  float noiseFreq = 0.2;
  float noiseAmp = 0.5;
  vec3 noisePos = vec3(
    snoise(targetPos * noiseFreq + uTime * 0.2),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 100.0),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 200.0)
  );
  targetPos += noisePos * noiseAmp;

  // 3. Mouse Repulsion Physics
  float dist = distance(targetPos, uMouse);
  if (dist < uMouseRadius) {
    vec3 dir = normalize(targetPos - uMouse);
    // Exponential falloff for smooth spring feeling
    float force = (uMouseRadius - dist) / uMouseRadius;
    force = pow(force, 2.0); // Stronger at center
    targetPos += dir * force * 1.5; // push amount
  }

  // Calculate final position
  vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
  
  // Perspective point size
  gl_PointSize = (18.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Create a soft circle
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  // Soft edge glow
  float alpha = smoothstep(0.5, 0.1, dist);
  
  gl_FragColor = vec4(vColor, alpha * 0.8);
}
`

// ─── GEOMETRY GENERATORS ───────────────────────────────────────────────────

function generateShapes(count) {
  const posA = new Float32Array(count * 3) // SHAPE A: DNA Helix / Cylinder
  const posB = new Float32Array(count * 3) // SHAPE B: Sphere (GitHub Globe)
  const posC = new Float32Array(count * 3) // SHAPE C: Expanded Grid / Box (Code Matrix)
  const colors = new Float32Array(count * 3)

  const cGreen = new THREE.Color('#00ff41')
  const cCyan = new THREE.Color('#00f5ff')
  const cPurple = new THREE.Color('#bf00ff')

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // --- SHAPE A: Twisted DNA / Cylinder (Hero) ---
    const height = 12
    const radius = 3
    const yA = (Math.random() - 0.5) * height
    const angleA = yA * 2.5 + Math.random() * Math.PI * 2 // Twisted
    const rA = Math.random() > 0.5 ? radius : radius - 1.5 + Math.random() * 0.5
    posA[i3 + 0] = Math.cos(angleA) * rA
    posA[i3 + 1] = yA
    posA[i3 + 2] = Math.sin(angleA) * rA

    // --- SHAPE B: Sphere / Globe (Middle section) ---
    const phi = Math.acos((Math.random() * 2) - 1)
    const theta = Math.random() * Math.PI * 2
    const rB = 4 + (Math.random() * 0.2) // slightly fuzzy edge
    posB[i3 + 0] = rB * Math.sin(phi) * Math.cos(theta)
    posB[i3 + 1] = rB * Math.sin(phi) * Math.sin(theta)
    posB[i3 + 2] = rB * Math.cos(phi)

    // --- SHAPE C: Tech Grid / Box (Bottom section) ---
    const sC = 8
    posC[i3 + 0] = (Math.random() - 0.5) * sC * 1.5
    posC[i3 + 1] = (Math.random() - 0.5) * sC
    posC[i3 + 2] = (Math.random() - 0.5) * sC * 0.5

    // --- COLORS ---
    const mixed = new THREE.Color()
    const r = Math.random()
    if (r < 0.5) mixed.copy(cGreen)
    else if (r < 0.8) mixed.copy(cCyan)
    else mixed.copy(cPurple)
    
    mixed.multiplyScalar(0.5 + Math.random() * 0.5)
    colors[i3 + 0] = mixed.r
    colors[i3 + 1] = mixed.g
    colors[i3 + 2] = mixed.b
  }

  return { posA, posB, posC, colors }
}

// ─── REACT COMPONENT ───────────────────────────────────────────────────────

function ParticleMorphSystem() {
  const shaderRef = useRef()
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const { size, camera } = useThree()

  // Generate the geometries once
  const PARTICLE_COUNT = 60000
  const { posA, posB, posC, colors } = useMemo(() => generateShapes(PARTICLE_COUNT), [])

  // Raycaster for mouse-to-world conversion
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []) // Invisible plane at Z=0

  useFrame((state, delta) => {
    if (!shaderRef.current) return

    // 1. Update Time
    shaderRef.current.uniforms.uTime.value += delta

    // 2. Map scroll progress to uProgress (0.0 to 2.0)
    // 0 = Shape A (Hero), 1 = Shape B (Description), 2 = Shape C (Roster)
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollNormal = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    
    // Smooth damp the scroll progress for a fluid transition
    const targetProgress = scrollNormal * 2.0
    shaderRef.current.uniforms.uProgress.value += (targetProgress - shaderRef.current.uniforms.uProgress.value) * 0.05

    // 3. Mouse Interaction (Raycast to world space)
    raycaster.setFromCamera(state.mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      // Smoothly move the uniform mouse position to the real mouse position
      mouseWorld.current.lerp(intersectPoint, 0.1)
      shaderRef.current.uniforms.uMouse.value.copy(mouseWorld.current)
    }

    // Optional: Slow rotation of the entire system based on scroll
    state.scene.rotation.y = scrollNormal * Math.PI
    state.scene.rotation.x = scrollNormal * 0.5
  })

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseRadius: { value: 2.5 } // Radius of repulsion
  }), [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={posA} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionB" count={PARTICLE_COUNT} array={posB} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionC" count={PARTICLE_COUNT} array={posC} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function TechParticleObject() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
        <ParticleMorphSystem />
      </Canvas>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
    </div>
  )
}
