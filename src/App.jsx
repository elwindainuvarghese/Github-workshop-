import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ReactLenis } from 'lenis/react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/HeroSection'
import DescriptionSection from './components/DescriptionSection'
import RosterSection from './components/RosterSection'
import './index.css'

// ─── 3D PARTICLE BACKGROUND ──────────────────────────────────────────
function ParticleField() {
  const pointsRef = useRef()
  const mouse = useRef(new THREE.Vector2())

  // Generate particles
  const [positions] = useState(() => {
    const count = 2000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Spread them wide and deep
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  })

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.05
    pointsRef.current.rotation.x += delta * 0.02
    
    // Parallax effect on mouse move
    const targetX = mouse.current.x * 2
    const targetY = mouse.current.y * 2
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Loader({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2000)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#050505',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, letterSpacing: '0.2em' }}
      >
        CODEX<span style={{ color: 'rgba(255,255,255,0.3)' }}>.AGENCY</span>
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [rosterData, setRosterData] = useState(null)

  useEffect(() => {
    fetch('/students.json').then(r => r.json()).then(setRosterData).catch(console.error)
  }, [])

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <CustomCursor />
      
      {/* 3D Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: loaded ? 1 : 0, transition: 'opacity 2s ease' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <fog attach="fog" args={['#050505', 10, 25]} />
          <ParticleField />
        </Canvas>
      </div>

      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} key="loader" />}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
        <HeroSection />
        <DescriptionSection />
        <RosterSection data={rosterData} />
        
        <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>
            READY TO COMMIT?
          </div>
          <a href="https://github.com" target="_blank" className="btn-primary">Start Building</a>
          <div style={{ marginTop: '40px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>
            © 2024 CODEX AGENCY. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </div>
    </ReactLenis>
  )
}
