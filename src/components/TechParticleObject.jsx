import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

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
  float noiseAmp = 0.2;
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
  gl_PointSize = (12.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  vec3 neonGreen = vec3(0.0, 1.0, 0.255);
  float alpha = smoothstep(0.5, 0.1, dist);
  gl_FragColor = vec4(neonGreen, alpha * 0.8);
}
`

// ─── GEOMETRY BUILDERS ──────────────────────────────────────────────────────

function sampleGeometry(geometry, count) {
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  const sampler = new MeshSurfaceSampler(mesh).build()
  const points = new Float32Array(count * 3)
  const tempPosition = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    sampler.sample(tempPosition)
    points[i * 3 + 0] = tempPosition.x
    points[i * 3 + 1] = tempPosition.y
    points[i * 3 + 2] = tempPosition.z
  }
  return points
}

function buildRocket() {
  const parts = []
  const body = new THREE.CylinderGeometry(1.2, 1.2, 7, 32)
  parts.push(body)
  const nose = new THREE.ConeGeometry(1.2, 3, 32)
  nose.translate(0, 5, 0)
  parts.push(nose)
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.BoxGeometry(0.2, 3, 2.5)
    fin.translate(0, -2, 1.5)
    fin.rotateY((i * Math.PI) / 2)
    parts.push(fin)
  }
  const engine = new THREE.CylinderGeometry(0.8, 1.4, 1.5, 32)
  engine.translate(0, -4.25, 0)
  parts.push(engine)
  
  const merged = mergeGeometries(parts)
  // Tilt it so it looks dynamic
  merged.rotateX(0.2)
  merged.rotateZ(-0.2)
  return merged
}

function buildPlane() {
  const parts = []
  const fuselage = new THREE.CylinderGeometry(1, 1, 10, 32)
  fuselage.rotateX(Math.PI / 2)
  parts.push(fuselage)
  const nose = new THREE.SphereGeometry(1, 32, 32)
  nose.translate(0, 0, 5)
  parts.push(nose)
  const wings = new THREE.BoxGeometry(14, 0.2, 3)
  wings.translate(0, 0, 1)
  parts.push(wings)
  const tail = new THREE.BoxGeometry(0.2, 3, 2)
  tail.translate(0, 1.5, -4)
  parts.push(tail)
  const tailWings = new THREE.BoxGeometry(4, 0.2, 1.5)
  tailWings.translate(0, 0, -4)
  parts.push(tailWings)
  
  const merged = mergeGeometries(parts)
  merged.rotateY(Math.PI / 4)
  merged.rotateX(-0.2)
  return merged
}

function buildComputer() {
  const parts = []
  // Monitor
  const monitor = new THREE.BoxGeometry(7, 4.5, 0.5)
  monitor.translate(0, 2, 0)
  parts.push(monitor)
  const stand = new THREE.CylinderGeometry(0.3, 0.3, 2, 16)
  stand.translate(0, 0, 0)
  parts.push(stand)
  const base = new THREE.BoxGeometry(2.5, 0.2, 2.5)
  base.translate(0, -1, 0)
  parts.push(base)
  // Tower
  const tower = new THREE.BoxGeometry(2.5, 6, 5)
  tower.translate(6, 1.5, 0)
  parts.push(tower)
  // Keyboard
  const kb = new THREE.BoxGeometry(6, 0.2, 2.5)
  kb.translate(0, -1, 3)
  parts.push(kb)
  // Mouse
  const mouse = new THREE.BoxGeometry(0.6, 0.25, 1)
  mouse.translate(4, -1, 3)
  parts.push(mouse)
  
  const merged = mergeGeometries(parts)
  merged.rotateY(-Math.PI / 6)
  return merged
}

function buildWall() {
  const plane = new THREE.PlaneGeometry(30, 15, 100, 50)
  const pos = plane.attributes.position
  // Create a soundwave / mountain grid look
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    // Complex sine waves for data-vis look
    let z = Math.sin(x * 0.5) * 2.0 + Math.sin(y * 0.8) * 1.5
    z += Math.sin(x * 1.2 + y * 0.5) * 0.8
    pos.setZ(i, z)
  }
  plane.computeVertexNormals()
  return plane
}

// ─── REACT COMPONENT ───────────────────────────────────────────────────────

function ParticleMorphSystem() {
  const shaderRef = useRef()
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const { camera } = useThree()
  const [geometries, setGeometries] = useState(null)
  
  const PARTICLE_COUNT = 80000

  useEffect(() => {
    // Generate heavily detailed sampled points on mount
    const rGeo = buildRocket()
    const pGeo = buildPlane()
    const cGeo = buildComputer()
    const wGeo = buildWall()

    setGeometries({
      posA: sampleGeometry(rGeo, PARTICLE_COUNT),
      posB: sampleGeometry(pGeo, PARTICLE_COUNT),
      posC: sampleGeometry(cGeo, PARTICLE_COUNT),
      posD: sampleGeometry(wGeo, PARTICLE_COUNT),
    })
  }, [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  useFrame((state, delta) => {
    if (!shaderRef.current || !geometries) return

    shaderRef.current.uniforms.uTime.value += delta

    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollNormal = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    const targetProgress = scrollNormal * 3.0 
    
    shaderRef.current.uniforms.uProgress.value += (targetProgress - shaderRef.current.uniforms.uProgress.value) * 0.05

    raycaster.setFromCamera(state.mouse, camera)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      mouseWorld.current.lerp(intersectPoint, 0.1)
      shaderRef.current.uniforms.uMouse.value.copy(mouseWorld.current)
    }

    // Slow rotation
    state.scene.rotation.y = scrollNormal * Math.PI * 0.1
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseRadius: { value: 3.0 }
  }), [])

  if (!geometries) return null // Wait until sampling is done

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={geometries.posA} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionB" count={PARTICLE_COUNT} array={geometries.posB} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionC" count={PARTICLE_COUNT} array={geometries.posC} itemSize={3} />
        <bufferAttribute attach="attributes-aPositionD" count={PARTICLE_COUNT} array={geometries.posD} itemSize={3} />
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
