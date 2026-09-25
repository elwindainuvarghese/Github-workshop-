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
attribute vec3 aPositionD;

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
  // 1. Morphing Logic (4 Shapes -> 3 Transitions)
  // uProgress goes from 0.0 to 3.0
  vec3 targetPos;
  
  if (uProgress < 1.0) {
    float t = smoothstep(0.0, 1.0, uProgress);
    targetPos = mix(position, aPositionB, t);
  } else if (uProgress < 2.0) {
    float t = smoothstep(0.0, 1.0, uProgress - 1.0);
    targetPos = mix(aPositionB, aPositionC, t);
  } else {
    float t = smoothstep(0.0, 1.0, uProgress - 2.0);
    targetPos = mix(aPositionC, aPositionD, t);
  }

  // 2. Organic Noise (Drift)
  float noiseFreq = 0.3;
  float noiseAmp = 0.4;
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
    float force = (uMouseRadius - dist) / uMouseRadius;
    force = pow(force, 2.0);
    targetPos += dir * force * 2.0; // magnetic push
  }

  // Calculate final position
  vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
  
  // Perspective point size
  gl_PointSize = (15.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
void main() {
  // Create a soft glowing circle
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  // Strict Neon Terminal Green: #00FF41
  vec3 neonGreen = vec3(0.0, 1.0, 0.255);
  
  // Soft edge glow
  float alpha = smoothstep(0.5, 0.1, dist);
  
  gl_FragColor = vec4(neonGreen, alpha * 0.9);
}
`

// ─── PROCEDURAL GEOMETRY GENERATORS ────────────────────────────────────────

function generateShapes(count) {
  const posA = new Float32Array(count * 3) // SHAPE A: Space Rocket
  const posB = new Float32Array(count * 3) // SHAPE B: Plane
  const posC = new Float32Array(count * 3) // SHAPE C: Desktop Computer
  const posD = new Float32Array(count * 3) // SHAPE D: Dense Abstract Wall

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // --- SHAPE A: Space Rocket (Procedural Approximation) ---
    // Body (Cylinder), Nose (Cone), Fins (Triangles)
    const rA = Math.random()
    if (rA < 0.6) {
      // Main Body Cylinder
      const h = (Math.random() - 0.5) * 8
      const angle = Math.random() * Math.PI * 2
      const radius = 1.2
      posA[i3 + 0] = Math.cos(angle) * radius
      posA[i3 + 1] = h
      posA[i3 + 2] = Math.sin(angle) * radius
    } else if (rA < 0.8) {
      // Nose Cone
      const h = Math.random() * 3 + 4 // Top part
      const angle = Math.random() * Math.PI * 2
      const radius = 1.2 * (1.0 - (h - 4) / 3) // Tapers to 0
      posA[i3 + 0] = Math.cos(angle) * radius
      posA[i3 + 1] = h
      posA[i3 + 2] = Math.sin(angle) * radius
    } else {
      // Engine / Fins at bottom
      const angle = (Math.floor(Math.random() * 3) / 3) * Math.PI * 2
      const spread = Math.random() * 2 + 1.2
      const h = -4 - Math.random() * 2
      posA[i3 + 0] = Math.cos(angle) * spread
      posA[i3 + 1] = h
      posA[i3 + 2] = Math.sin(angle) * spread
    }
    // Rotate Rocket slightly to look dynamic
    const tempX = posA[i3+0]; const tempY = posA[i3+1]
    posA[i3+0] = tempX * Math.cos(0.5) - tempY * Math.sin(0.5)
    posA[i3+1] = tempX * Math.sin(0.5) + tempY * Math.cos(0.5)


    // --- SHAPE B: Plane (Procedural Approximation) ---
    // Fuselage and swept wings
    const rB = Math.random()
    if (rB < 0.3) {
      // Fuselage (Long cylinder along Z)
      const z = (Math.random() - 0.5) * 10
      const angle = Math.random() * Math.PI * 2
      const radius = 0.8
      posB[i3 + 0] = Math.cos(angle) * radius
      posB[i3 + 1] = Math.sin(angle) * radius
      posB[i3 + 2] = z
    } else {
      // Swept Wings
      const side = Math.random() > 0.5 ? 1 : -1
      const z = (Math.random() - 0.5) * 4 // Spread along fuselage
      const x = (Math.random() * 6) * side // Wing span
      // Sweep back
      const sweptZ = z - Math.abs(x) * 0.8
      posB[i3 + 0] = x
      posB[i3 + 1] = (Math.random() - 0.5) * 0.2 // thin wing
      posB[i3 + 2] = sweptZ
    }
    // Tilt plane up slightly
    const tempZ2 = posB[i3+2]; const tempY2 = posB[i3+1]
    posB[i3+1] = tempY2 * Math.cos(0.2) - tempZ2 * Math.sin(0.2)
    posB[i3+2] = tempY2 * Math.sin(0.2) + tempZ2 * Math.cos(0.2)


    // --- SHAPE C: Desktop Computer (Procedural Approximation) ---
    // Monitor Box + Stand + Keyboard
    const rC = Math.random()
    if (rC < 0.7) {
      // Monitor (Flat box)
      posC[i3 + 0] = (Math.random() - 0.5) * 8
      posC[i3 + 1] = (Math.random() - 0.5) * 5 + 3
      posC[i3 + 2] = (Math.random() - 0.5) * 0.5 - 2
    } else if (rC < 0.8) {
      // Stand (Vertical slim box)
      posC[i3 + 0] = (Math.random() - 0.5) * 2
      posC[i3 + 1] = (Math.random() - 0.5) * 3
      posC[i3 + 2] = (Math.random() - 0.5) * 0.5 - 2
    } else {
      // Keyboard (Flat box on ground)
      posC[i3 + 0] = (Math.random() - 0.5) * 6
      posC[i3 + 1] = (Math.random() - 0.5) * 0.2 - 1.5
      posC[i3 + 2] = (Math.random() - 0.5) * 3 + 2
    }


    // --- SHAPE D: Dense Abstract Wall ---
    // Massive, perfectly flat grid with some depth noise
    posD[i3 + 0] = (Math.random() - 0.5) * 20
    posD[i3 + 1] = (Math.random() - 0.5) * 15
    posD[i3 + 2] = (Math.random() - 0.5) * 1.5 - 5 // Pushed back slightly
  }

  return { posA, posB, posC, posD }
}

// ─── REACT COMPONENT ───────────────────────────────────────────────────────

function ParticleMorphSystem() {
  const shaderRef = useRef()
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const { camera } = useThree()

  // Generate 80,000 highly dense particles
  const PARTICLE_COUNT = 80000
  const { posA, posB, posC, posD } = useMemo(() => generateShapes(PARTICLE_COUNT), [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  useFrame((state, delta) => {
    if (!shaderRef.current) return

    // 1. Time for noise
    shaderRef.current.uniforms.uTime.value += delta

    // 2. Map scroll progress from 0.0 to 3.0 for the 4 shapes
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollNormal = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    const targetProgress = scrollNormal * 3.0 // 0 to 3.0
    
    shaderRef.current.uniforms.uProgress.value += (targetProgress - shaderRef.current.uniforms.uProgress.value) * 0.05

    // 3. Mouse Physics
    raycaster.setFromCamera(state.mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      mouseWorld.current.lerp(intersectPoint, 0.1)
      shaderRef.current.uniforms.uMouse.value.copy(mouseWorld.current)
    }

    // Gentle overall scene drift
    state.scene.rotation.y = scrollNormal * Math.PI * 0.25
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseRadius: { value: 3.5 }
  }), [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={posA} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionB" count={PARTICLE_COUNT} array={posB} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionC" count={PARTICLE_COUNT} array={posC} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionD" count={PARTICLE_COUNT} array={posD} itemSize={3} />
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
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]}>
        <ParticleMorphSystem />
      </Canvas>
    </div>
  )
}
