import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'

function useTyping(lines, speed = 60, startDelay = 0) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [startDelay])

  useEffect(() => {
    if (!started || done) return
    const line = lines[lineIdx]
    if (!line) { setDone(true); return }
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), speed + Math.random() * 40)
      return () => clearTimeout(t)
    } else {
      if (lineIdx < lines.length - 1) {
        const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0) }, 400)
        return () => clearTimeout(t)
      } else { setDone(true) }
    }
  }, [charIdx, lineIdx, lines, speed, started, done])

  return {
    lines: lines.slice(0, lineIdx + 1).map((l, i) =>
      i < lineIdx ? l : l.slice(0, charIdx)
    ), done,
  }
}

function GlitchTitle({ isMobile }) {
  const lines = ['GITHUB', 'WORKSHOP']
  const [display, setDisplay] = useState(lines)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitching(true)
      let count = 0
      const interval = setInterval(() => {
        setDisplay(lines.map(line =>
          line.split('').map(ch =>
            Math.random() < 0.25 ? '!@#$%&*'[Math.floor(Math.random() * 7)] : ch
          ).join('')
        ))
        count++
        if (count > 8) {
          clearInterval(interval)
          setDisplay(lines)
          setGlitching(false)
        }
      }, 40)
    }
    const randomGlitch = () => {
      triggerGlitch()
      setTimeout(randomGlitch, Math.random() * 4000 + 2500)
    }
    const t = setTimeout(randomGlitch, 2000)
    return () => clearTimeout(t)
  }, [])

  const fontSize = isMobile ? 'clamp(32px, 12vw, 60px)' : 'clamp(48px, 6vw, 100px)'
  const offset = glitching ? (isMobile ? '2px' : '4px') : (isMobile ? '1px' : '2px')

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none', maxWidth: '100%', textAlign: isMobile ? 'center' : 'left' }}>
      {/* Red layer */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: `-${offset}`,
        color: '#ff003c', opacity: glitching ? 0.7 : 0.3,
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 1.0, letterSpacing: '-1px',
        whiteSpace: 'pre-line', filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>
      {/* Cyan layer */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: offset,
        color: '#00f5ff', opacity: glitching ? 0.7 : 0.3,
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 1.0, letterSpacing: '-1px',
        whiteSpace: 'pre-line', filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>
      {/* Main */}
      <div style={{
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 1.0, letterSpacing: '-1px',
        color: '#00ff41', whiteSpace: 'pre-line',
        textShadow: '0 0 20px rgba(0,255,65,0.4)',
      }}>
        {display.join('\n')}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const isMobile = useIsMobile()

  const TERMINAL_LINES = [
    '$ git init workshop',
    '> Initialized empty Git repository',
    '$ git add --all',
    '$ git commit -m "first breath"',
    '> [main 773a902] first breath',
    '$ git push origin main',
    '> Pushing to github.com/codex/reality.git',
    '> ████████████████ 100%',
    '$ cat /dev/mind | git pipe --force',
  ]

  const { lines: typedLines } = useTyping(TERMINAL_LINES, 50, 800)

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      padding: isMobile ? '40px 16px' : '60px 40px',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* Background gradients to frame the tech */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 40%, rgba(0,255,65,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* LEFT SIDE: Typography & Terminal */}
      <div style={{
        flex: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: isMobile ? 'center' : 'flex-start',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ pointerEvents: 'auto', marginBottom: '10px' }}
        >
          <GlitchTitle isMobile={isMobile} />
        </motion.div>
        
        {/* Gradient Subheading */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: "'Orbitron'",
            fontWeight: 800,
            fontSize: isMobile ? '12px' : '20px',
            marginBottom: '40px',
            background: 'linear-gradient(90deg, #00ff41, #00f5ff, #ff003c, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: isMobile ? '1px' : '2px',
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          BUILD. COMMIT. BREAK. RECOVER.
        </motion.div>

        {/* The Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          style={{
            width: '100%',
            maxWidth: '540px',
            pointerEvents: 'auto'
          }}
          className="terminal-card"
        >
          <div className="terminal-header" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffe600' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff41' }} />
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.5)', fontFamily: "'Share Tech Mono'" }}>terminal - bash</span>
          </div>
          <div style={{ padding: '20px', minHeight: '180px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{
                fontSize: isMobile ? '10px' : '13px',
                lineHeight: 1.8,
                color: line.startsWith('$') ? '#00ff41' : 'rgba(255,255,255,0.7)',
                fontFamily: "'Share Tech Mono', monospace",
              }}>
                {line}
                {i === typedLines.length - 1 && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ marginLeft: '4px', color: '#00ff41' }}>
                    █
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Empty space for 3D Canvas */}
      <div style={{ flex: 1, pointerEvents: 'none' }} />
    </section>
  )
}
