import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleGeometry() {
  const pointsRef = useRef()
  const mouse = useRef(new THREE.Vector2())
  const scrollY = useRef(0)
  
  // We will morph between two shapes based on scroll.
  // Shape 1: A tight, organized, techy spiral (for the Hero)
  // Shape 2: A splattered, swiping fluid wave (for Description/Roster)
  
  const [positions, targetPositions, colors] = useMemo(() => {
    const count = 50000
    const pos = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    
    const color1 = new THREE.Color('#00ff41') // Matrix Green
    const color2 = new THREE.Color('#00f5ff') // Cyan
    const color3 = new THREE.Color('#bf00ff') // Purple

    for (let i = 0; i < count; i++) {
      // --- SHAPE 1: Techy Spiral / Vortex ---
      // We want it to look like a digital vortex going deep into the screen
      const r = Math.sqrt(Math.random()) * 8
      const theta = Math.random() * Math.PI * 20 // multiple coils
      
      // Make it spiral out from center
      const spiralX = r * Math.cos(theta)
      const spiralY = r * Math.sin(theta)
      const spiralZ = (Math.random() - 0.5) * 2 - (r * 1.5) // Deeper in Z as it gets wider

      pos[i * 3] = spiralX
      pos[i * 3 + 1] = spiralY
      pos[i * 3 + 2] = spiralZ + 5 // Push it slightly back

      // --- SHAPE 2: Fluid Wave / Splatter ---
      // A sweeping wave that crosses the screen horizontally (like the user's mockup)
      const waveX = (Math.random() - 0.5) * 30
      const waveY = Math.sin(waveX * 0.5) * 3 + (Math.random() - 0.5) * 4
      const waveZ = (Math.random() - 0.5) * 10
      
      // Splatter: some particles explode outward
      const isSplatter = Math.random() > 0.7
      target[i * 3] = isSplatter ? waveX * 1.5 : waveX
      target[i * 3 + 1] = isSplatter ? waveY + (Math.random() - 0.5) * 10 : waveY
      target[i * 3 + 2] = isSplatter ? waveZ * 2 : waveZ - 5

      // --- COLORS ---
      const mixedColor = new THREE.Color()
      const mixRatio = Math.random()
      
      if (mixRatio < 0.5) {
        mixedColor.copy(color1) // Green
      } else if (mixRatio < 0.75) {
        mixedColor.copy(color3) // Purple
      } else {
        mixedColor.copy(color2) // Cyan
      }

      // Add variance
      mixedColor.multiplyScalar(0.4 + Math.random() * 0.8)

      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }
    return [pos, target, col]
  }, [])

  // We need a ref to the geometry to update positions dynamically
  const geoRef = useRef()

  const { viewport } = useThree()
  
  useFrame((state) => {
    // Smooth mouse follow
    mouse.current.x += (state.mouse.x - mouse.current.x) * 0.05
    mouse.current.y += (state.mouse.y - mouse.current.y) * 0.05

    // Track scroll (normalized roughly 0 to 1 based on page height)
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0
    scrollY.current += (scrollProgress - scrollY.current) * 0.1

    const time = state.clock.getElapsedTime()

    if (pointsRef.current && geoRef.current) {
      // 1. Overall group rotation based on time & mouse
      pointsRef.current.rotation.y = time * 0.1 + mouse.current.x * 0.5
      pointsRef.current.rotation.x = mouse.current.y * 0.5
      
      // 2. Morphing animation!
      // We interpolate every single vertex between 'positions' (spiral) and 'targetPositions' (splatter wave)
      // based on how far the user has scrolled.
      const currentPos = geoRef.current.attributes.position.array
      const morphFactor = scrollY.current // 0 at top, 1 at bottom

      for (let i = 0; i < currentPos.length; i += 3) {
        // Base points
        const bx = positions[i]
        const by = positions[i+1]
        const bz = positions[i+2]
        
        // Target points
        const tx = targetPositions[i]
        const ty = targetPositions[i+1]
        const tz = targetPositions[i+2]

        // Interpolate
        let mx = bx + (tx - bx) * morphFactor
        let my = by + (ty - by) * morphFactor
        let mz = bz + (tz - bz) * morphFactor

        // Add a gentle floating wave effect to everything based on time
        my += Math.sin(time * 2 + mx * 0.5) * 0.1
        mx += Math.cos(time * 1.5 + my * 0.5) * 0.1

        currentPos[i] = mx
        currentPos[i+1] = my
        currentPos[i+2] = mz
      }
      geoRef.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)} // Initial state
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
        size={0.04}
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
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#000', 5, 20]} />
        <ParticleGeometry />
      </Canvas>
      {/* Dark overlay to ensure text remains readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
    </div>
  )
}
