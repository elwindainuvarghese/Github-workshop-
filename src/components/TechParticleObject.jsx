import { useRef, useMemo } from 'react'
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

// Classic 3D Simplex Noise function
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

  // Drift
  float noiseFreq = 0.2;
  float noiseAmp = 0.5;
  vec3 noisePos = vec3(
    snoise(targetPos * noiseFreq + uTime * 0.2),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 100.0),
    snoise(targetPos * noiseFreq + uTime * 0.2 + 200.0)
  );
  targetPos += noisePos * noiseAmp;

  // Repulsion
  float dist = distance(targetPos, uMouse);
  if (dist < uMouseRadius) {
    vec3 dir = normalize(targetPos - uMouse);
    float force = (uMouseRadius - dist) / uMouseRadius;
    force = pow(force, 2.0);
    targetPos += dir * force * 1.5;
  }

  vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
  
  // Size based on depth
  gl_PointSize = (18.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  // Strict Neon Terminal Green: #00FF41
  vec3 neonGreen = vec3(0.0, 1.0, 0.255);
  float alpha = smoothstep(0.5, 0.1, dist);
  gl_FragColor = vec4(neonGreen, alpha * 0.8);
}
`

// ─── PROCEDURAL GEOMETRY GENERATORS ────────────────────────────────────────

function generateOrganicShapes(count) {
  const posA = new Float32Array(count * 3) // SHAPE A: Twisted DNA Helix
  const posB = new Float32Array(count * 3) // SHAPE B: The Globe (World Wide Web)
  const posC = new Float32Array(count * 3) // SHAPE C: Torus Knot (Complex Core)
  const posD = new Float32Array(count * 3) // SHAPE D: Fluid Splatter Wave

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // --- SHAPE A: Twisted DNA / Cylinder (Hero) ---
    const height = 16
    const radius = 4
    const yA = (Math.random() - 0.5) * height
    const angleA = yA * 2.5 + Math.random() * Math.PI * 2
    const rA = Math.random() > 0.5 ? radius : radius - 1.5 + Math.random() * 0.5
    posA[i3 + 0] = Math.cos(angleA) * rA
    posA[i3 + 1] = yA
    posA[i3 + 2] = Math.sin(angleA) * rA

    // --- SHAPE B: Sphere / Globe ---
    const phi = Math.acos((Math.random() * 2) - 1)
    const theta = Math.random() * Math.PI * 2
    const rB = 5 + (Math.random() * 0.3)
    posB[i3 + 0] = rB * Math.sin(phi) * Math.cos(theta)
    posB[i3 + 1] = rB * Math.sin(phi) * Math.sin(theta)
    posB[i3 + 2] = rB * Math.cos(phi)

    // --- SHAPE C: Torus Knot ---
    const t = Math.random() * Math.PI * 2
    const p = 2; const q = 3; const rT = 3; const tube = 1.5;
    const rC = rT + tube * Math.cos(q * t)
    const tx = rC * Math.cos(p * t)
    const ty = rC * Math.sin(p * t)
    const tz = tube * Math.sin(q * t)
    // Add spread inside the tube
    const spreadAngle = Math.random() * Math.PI * 2
    const spreadRadius = Math.random() * tube
    posC[i3 + 0] = tx + Math.cos(spreadAngle) * spreadRadius
    posC[i3 + 1] = ty + Math.sin(spreadAngle) * spreadRadius
    posC[i3 + 2] = tz + (Math.random() - 0.5)

    // --- SHAPE D: Fluid Splatter Wave ---
    const waveX = (Math.random() - 0.5) * 35
    const waveY = Math.sin(waveX * 0.5) * 4 + (Math.random() - 0.5) * 6
    const waveZ = (Math.random() - 0.5) * 15
    const isSplatter = Math.random() > 0.8
    posD[i3 + 0] = isSplatter ? waveX * 1.5 : waveX
    posD[i3 + 1] = isSplatter ? waveY + (Math.random() - 0.5) * 15 : waveY
    posD[i3 + 2] = isSplatter ? waveZ * 2 : waveZ - 5
  }

  return { posA, posB, posC, posD }
}

// ─── REACT COMPONENT ───────────────────────────────────────────────────────

function ParticleMorphSystem() {
  const shaderRef = useRef()
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const { camera } = useThree()

  // 60,000 looks amazing for organic shapes (dense but fluid)
  const PARTICLE_COUNT = 60000
  const { posA, posB, posC, posD } = useMemo(() => generateOrganicShapes(PARTICLE_COUNT), [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  useFrame((state, delta) => {
    if (!shaderRef.current) return

    shaderRef.current.uniforms.uTime.value += delta

    // Map scroll from 0.0 to 3.0
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollNormal = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    const targetProgress = scrollNormal * 3.0 
    
    shaderRef.current.uniforms.uProgress.value += (targetProgress - shaderRef.current.uniforms.uProgress.value) * 0.05

    // Mouse Interaction
    raycaster.setFromCamera(state.mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      mouseWorld.current.lerp(intersectPoint, 0.1)
      shaderRef.current.uniforms.uMouse.value.copy(mouseWorld.current)
    }

    // Gentle rotation
    state.scene.rotation.y = scrollNormal * Math.PI
    state.scene.rotation.x = scrollNormal * 0.5
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
      <Canvas camera={{ position: [0, 0, 16], fov: 60 }} dpr={[1, 2]}>
        <ParticleMorphSystem />
      </Canvas>
    </div>
  )
}
