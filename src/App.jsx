import { useState, useEffect, useCallback } from 'react'
import './index.css'
import GlitchCursor from './components/CustomCursor'
import GlitchLoader from './components/GlitchLoader'
import HeroSection from './components/HeroSection'
import TextTunnel from './components/TextTunnel'
import DescriptionSection from './components/DescriptionSection'
import RosterSection from './components/RosterSection'
import InteractiveBackground from './components/InteractiveBackground'
import { motion } from 'framer-motion'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [rosterData, setRosterData] = useState(null)
  const [rosterLoading, setRosterLoading] = useState(true)
  const [rosterError, setRosterError] = useState(false)

  useEffect(() => {
    fetch('/students.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setRosterData(d); setRosterLoading(false) })
      .catch(() => { setRosterError(true); setRosterLoading(false) })
  }, [])

  const handleLoadComplete = useCallback(() => setLoaded(true), [])

  return (
    <>
      <InteractiveBackground />
      <GlitchCursor />
      {/* Persistent scanlines + noise */}
      <div className="scanlines" />
      <div className="noise" />

      <GlitchLoader onComplete={handleLoadComplete} />

      {loaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <HeroSection />
          <TextTunnel />
          <DescriptionSection />
          <RosterSection data={rosterData} loading={rosterLoading} error={rosterError} />
          <Footer />
        </motion.main>
      )}
    </>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '60px 24px 40px',
      background: 'transparent',
      position: 'relative',
      textAlign: 'center',
    }}>
      {/* Top glitch line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #00ff41, #bf00ff, #00f5ff, transparent)',
        marginBottom: '48px',
        boxShadow: '0 0 8px rgba(0,255,65,0.4)',
      }} />

      {/* Logo */}
      <div style={{
        fontFamily: "'Orbitron'",
        fontWeight: 900,
        fontSize: '32px',
        letterSpacing: '4px',
        color: '#00ff41',
        textShadow: '0 0 20px rgba(0,255,65,0.4)',
        marginBottom: '8px',
      }}>
        CODEX
      </div>
      <div style={{
        fontFamily: "'Share Tech Mono'",
        fontSize: '10px',
        letterSpacing: '0.5em',
        color: 'rgba(0,255,65,0.35)',
        marginBottom: '32px',
        textTransform: 'uppercase',
      }}>
        Technical Committee · GitHub Workshop
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        {[
          { label: 'GITHUB', href: 'https://github.com' },
          { label: 'GIT DOCS', href: 'https://docs.github.com' },
          { label: 'CHEATSHEET', href: 'https://training.github.com/downloads/github-git-cheat-sheet/' },
        ].map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Share Tech Mono'",
              fontSize: '11px',
              color: 'rgba(0,255,65,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.2em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#00ff41'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,255,65,0.4)'}
          >
            ▸ {l.label}
          </a>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>
        BUILT WITH REACT · THREE.JS · FRAMER MOTION · TAILWIND CSS · CHAOS
      </div>

      {/* Blinking cursor */}
      <motion.div
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{
          display: 'inline-block',
          width: '8px',
          height: '14px',
          background: '#00ff41',
          marginLeft: '6px',
          verticalAlign: 'middle',
          boxShadow: '0 0 6px #00ff41',
        }}
      />
    </footer>
  )
}
