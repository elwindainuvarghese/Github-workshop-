import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// We create a massive torus knot made of particles.
function ParticleGeometry() {
  const pointsRef = useRef()
  const mouse = useRef(new THREE.Vector2())
  const scrollY = useRef(0)

  // Track mouse for interaction
  const { viewport } = useThree()
  useFrame((state) => {
    // Smooth mouse follow
    mouse.current.x += (state.mouse.x - mouse.current.x) * 0.1
    mouse.current.y += (state.mouse.y - mouse.current.y) * 0.1

    // Read scroll from window (since it's a fixed canvas)
    const currentScroll = window.scrollY
    scrollY.current += (currentScroll - scrollY.current) * 0.1

    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Base rotation + scroll rotation
      pointsRef.current.rotation.y = time * 0.2 + scrollY.current * 0.002
      pointsRef.current.rotation.x = time * 0.1 + scrollY.current * 0.001

      // Mouse parallax
      pointsRef.current.position.x = mouse.current.x * 2
      pointsRef.current.position.y = mouse.current.y * 2
    }
  })

  // Generate 40,000 particles based on a Torus Knot equation + noise
  const [positions, colors] = useMemo(() => {
    const count = 40000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const color1 = new THREE.Color('#00ff41') // Matrix Green
    const color2 = new THREE.Color('#00f5ff') // Cyan
    const color3 = new THREE.Color('#bf00ff') // Purple

    for (let i = 0; i < count; i++) {
      // Create a Torus Knot
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * Math.PI * 2

      // Knot parameters (p=2, q=3 is standard, let's do p=3, q=4 for complexity)
      const p = 3
      const q = 4
      const r = 2.5 + Math.random() * 0.4 // Thickness
      
      const cu = Math.cos(u)
      const su = Math.sin(u)
      const quOverP = q * u / p
      const cs = Math.cos(quOverP)

      const x = r * (2 + cu) * 0.5 * Math.cos(quOverP)
      const y = r * (2 + cu) * 0.5 * Math.sin(quOverP)
      const z = r * su * 0.5

      // Add explosive noise based on distance from center
      const noise = (Math.random() - 0.5) * 0.5
      pos[i * 3] = x + noise
      pos[i * 3 + 1] = y + noise
      pos[i * 3 + 2] = z + noise

      // Assign colors based on position
      const mixedColor = new THREE.Color()
      const mixRatio = Math.random()
      
      if (mixRatio < 0.6) {
        mixedColor.copy(color1) // Mostly green
      } else if (mixRatio < 0.85) {
        mixedColor.copy(color2) // Some cyan
      } else {
        mixedColor.copy(color3) // Sprinkle of purple
      }

      // Add some color variance
      mixedColor.multiplyScalar(0.5 + Math.random() * 0.8)

      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }
    return [pos, col]
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  )
}

export default function TechParticleObject() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        {/* Subtle dark fog so particles fade into the background */}
        <fog attach="fog" args={['#000', 3, 10]} />
        <ParticleGeometry />
      </Canvas>
      {/* Dark overlay so it doesn't overpower the text */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #000 80%)', pointerEvents: 'none' }} />
    </div>
  )
}
