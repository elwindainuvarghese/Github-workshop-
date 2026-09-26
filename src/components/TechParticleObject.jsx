import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

// ─── SHADER CODE ───────────────────────────────────────────────────────────
const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform float uMouseRadius;

attribute vec3 aPositionB;
attribute vec3 aPositionC;
attribute vec3 aPositionD;
attribute float aRandom; // Unique random value per particle (0.0 to 1.0)

varying float vAlpha;

// Simplex Noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
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
  vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
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
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

// Function to rotate a vector around the Y axis (for fluid morph swirling)
vec3 rotateY(vec3 v, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec3(v.x * c - v.z * s, v.y, v.x * s + v.z * c);
}

void main() {
  vec3 targetPos;
  
  float t; 
  vec3 startPos;
  vec3 endPos;

  if (uProgress < 1.0) {
    t = smoothstep(0.0, 1.0, uProgress);
    startPos = position; endPos = aPositionB;
  } else if (uProgress < 2.0) {
    t = smoothstep(0.0, 1.0, uProgress - 1.0);
    startPos = aPositionB; endPos = aPositionC;
  } else {
    t = smoothstep(0.0, 1.0, uProgress - 2.0);
    startPos = aPositionC; endPos = aPositionD;
  }

  // Fluid transition
  float morphIntensity = sin(t * 3.14159);
  vec3 midPos = mix(startPos, endPos, t);
  float swirlAngle = morphIntensity * (aRandom * 10.0 - 5.0);
  vec3 swirlingPos = rotateY(midPos, swirlAngle);
  swirlingPos.y += morphIntensity * (aRandom * 4.0 - 2.0);
  swirlingPos.x += morphIntensity * (aRandom * 4.0 - 2.0);
  
  targetPos = swirlingPos;

  // Organic drift
  float noiseFreq = 0.15;
  float noiseAmp = 0.25;
  vec3 noisePos = vec3(
    snoise(targetPos * noiseFreq + uTime * 0.2),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 100.0),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 200.0)
  );
  targetPos += noisePos * noiseAmp;

  // Hover Interaction (The Bulge)
  // Distance in screen/world space xy
  float dist = distance(targetPos.xy, uMouse.xy);
  if (dist < uMouseRadius) {
    float force = (uMouseRadius - dist) / uMouseRadius;
    force = pow(force, 2.0); // Smooth falloff
    // Push outward towards the camera (Z axis)
    targetPos.z += force * 6.0;
    // Slight stretch outwards from the mouse center
    targetPos.x += (targetPos.x - uMouse.x) * force * 1.5;
    targetPos.y += (targetPos.y - uMouse.y) * force * 1.5;
  }

  vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
  float baseSize = 8.0 + (aRandom * 12.0); 
  gl_PointSize = (baseSize / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = 0.5 + (sin(uTime * 3.0 + aRandom * 10.0) * 0.4);
}
`

const fragmentShader = `
varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  vec3 neonGreen = vec3(0.0, 1.0, 0.255);
  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
  gl_FragColor = vec4(neonGreen, alpha);
}
`

// ─── ORGANIC WIREFRAME EDGE SAMPLER ────────────────────────────────────────

// Extracts the edges but adds a slight, randomized natural "fuzz" to the lines
// so they look like glowing clouds forming a shape rather than rigid math vectors.
function sampleOrganicEdges(geometry, count) {
  const edgesGeometry = new THREE.EdgesGeometry(geometry, 15)
  const edgePositions = edgesGeometry.attributes.position
  const points = new Float32Array(count * 3)
  
  const lineSegmentsCount = edgePositions.count / 2
  
  if (lineSegmentsCount === 0) return new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const lineIndex = Math.floor(Math.random() * lineSegmentsCount)
    
    const v0x = edgePositions.getX(lineIndex * 2)
    const v0y = edgePositions.getY(lineIndex * 2)
    const v0z = edgePositions.getZ(lineIndex * 2)
    
    const v1x = edgePositions.getX(lineIndex * 2 + 1)
    const v1y = edgePositions.getY(lineIndex * 2 + 1)
    const v1z = edgePositions.getZ(lineIndex * 2 + 1)
    
    const t = Math.random()
    
    // Base position on the edge
    let px = v0x + (v1x - v0x) * t
    let py = v0y + (v1y - v0y) * t
    let pz = v0z + (v1z - v0z) * t

    // Add natural organic fuzz/scatter (a Gaussian-like distribution)
    const scatter = 0.12 // Scatter radius
    px += (Math.random() - 0.5) * scatter
    py += (Math.random() - 0.5) * scatter
    pz += (Math.random() - 0.5) * scatter

    points[i * 3 + 0] = px
    points[i * 3 + 1] = py
    points[i * 3 + 2] = pz
  }
  
  return points
}

// ─── GEOMETRY BUILDERS ──────────────────────────────────────────────────────

function buildLaptop() {
  const parts = []
  const base = new THREE.BoxGeometry(10, 0.4, 7)
  base.translate(0, -3, 0)
  parts.push(base)
  const screen = new THREE.BoxGeometry(10, 6, 0.4)
  screen.translate(0, 3, -3.5)
  screen.rotateX(-0.1)
  screen.translate(0, -3, 0)
  parts.push(screen)
  const trackpad = new THREE.BoxGeometry(3, 0.1, 2)
  trackpad.translate(0, -2.8, 1.5)
  parts.push(trackpad)
  
  const merged = mergeGeometries(parts)
  merged.rotateY(0.4)
  merged.rotateX(0.2)
  return merged
}

function buildScreens() {
  const parts = []
  const s1 = new THREE.BoxGeometry(6, 4, 0.2)
  s1.translate(-3, 0, 1)
  s1.rotateY(0.3)
  parts.push(s1)
  
  const s2 = new THREE.BoxGeometry(5, 3.5, 0.2)
  s2.translate(4, 1.5, -2)
  s2.rotateY(-0.4)
  parts.push(s2)
  
  const s3 = new THREE.BoxGeometry(3.5, 2.5, 0.2)
  s3.translate(3, -2, 3)
  s3.rotateY(-0.2)
  parts.push(s3)

  return mergeGeometries(parts)
}

function buildCloudServer() {
  const parts = []
  const rack = new THREE.BoxGeometry(5, 10, 4)
  rack.translate(0, -1, 0)
  parts.push(rack)
  
  for(let i=0; i<6; i++) {
    const blade = new THREE.BoxGeometry(4.5, 0.5, 4.2)
    blade.translate(0, 3 - (i * 1.5), 0)
    parts.push(blade)
  }
  
  for(let i=0; i<8; i++) {
    const node = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    node.translate((Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*12)
    parts.push(node)
  }

  const merged = mergeGeometries(parts)
  merged.rotateY(-0.4)
  return merged
}

function buildDesktop() {
  const parts = []
  const monitor = new THREE.BoxGeometry(8, 5, 0.4)
  monitor.translate(0, 2, 0)
  parts.push(monitor)
  const stand = new THREE.BoxGeometry(1, 2, 1)
  stand.translate(0, 0, 0)
  parts.push(stand)
  const base = new THREE.BoxGeometry(3, 0.2, 2)
  base.translate(0, -1, 0)
  parts.push(base)
  
  const tower = new THREE.BoxGeometry(3, 7, 6)
  tower.translate(7, 1.5, 0)
  parts.push(tower)
  
  const kb = new THREE.BoxGeometry(6, 0.3, 2.5)
  kb.translate(0, -1, 4)
  parts.push(kb)

  const merged = mergeGeometries(parts)
  merged.rotateY(-0.2)
  return merged
}

// ─── REACT COMPONENT ───────────────────────────────────────────────────────

function ParticleMorphSystem() {
  const shaderRef = useRef()
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const { camera } = useThree()
  const [geometries, setGeometries] = useState(null)
  const [randoms, setRandoms] = useState(null)
  
  // Dense count for rich clouds
  const PARTICLE_COUNT = 65000

  useEffect(() => {
    const geoA = buildLaptop()
    const geoB = buildScreens()
    const geoC = buildCloudServer()
    const geoD = buildDesktop()

    setGeometries({
      posA: sampleOrganicEdges(geoA, PARTICLE_COUNT),
      posB: sampleOrganicEdges(geoB, PARTICLE_COUNT),
      posC: sampleOrganicEdges(geoC, PARTICLE_COUNT),
      posD: sampleOrganicEdges(geoD, PARTICLE_COUNT),
    })

    // Generate unique random seed for each particle
    const randArray = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      randArray[i] = Math.random()
    }
    setRandoms(randArray)
  }, [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  useFrame((state, delta) => {
    if (!shaderRef.current || !geometries || !randoms) return

    // Limit delta to prevent huge jumps if tab is inactive
    const safeDelta = Math.min(delta, 0.1)
    shaderRef.current.uniforms.uTime.value += safeDelta

    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollNormal = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    const targetProgress = scrollNormal * 3.0 
    
    // Slower, more natural interpolation for scroll mapping
    shaderRef.current.uniforms.uProgress.value += (targetProgress - shaderRef.current.uniforms.uProgress.value) * 0.03

    raycaster.setFromCamera(state.mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      // Natural, slightly slower mouse following
      mouseWorld.current.lerp(intersectPoint, 0.08)
      shaderRef.current.uniforms.uMouse.value.copy(mouseWorld.current)
    }

    // Natural fluid breathing rotation
    state.scene.rotation.y = scrollNormal * Math.PI * 0.15 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    state.scene.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.05

    // Shift and scale for the Hero Section Layout
    const isMobile = window.innerWidth < 768
    // On mobile, scale it down to 40% and move it up. On desktop, scale to 70% and move it far left.
    state.scene.scale.setScalar(isMobile ? 0.35 : 0.65)
    state.scene.position.x = isMobile ? 0 : -5.0
    state.scene.position.y = isMobile ? 3.0 : 0
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseRadius: { value: 4.0 }
  }), [])

  if (!geometries || !randoms) return null 

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={geometries.posA} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionB" count={PARTICLE_COUNT} array={geometries.posB} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionC" count={PARTICLE_COUNT} array={geometries.posC} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionD" count={PARTICLE_COUNT} array={geometries.posD} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={PARTICLE_COUNT} array={randoms} itemSize={1} />
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#000000' }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }} dpr={[1, 2]}>
        <ParticleMorphSystem />
      </Canvas>
    </div>
  )
}
