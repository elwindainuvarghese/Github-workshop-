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

  const fontSize = isMobile ? 'clamp(48px, 15vw, 70px)' : 'clamp(70px, 8vw, 130px)'
  const offset = glitching ? (isMobile ? '2px' : '4px') : (isMobile ? '1px' : '2px')

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none', maxWidth: '100%', textAlign: isMobile ? 'center' : 'right' }}>
      {/* Red layer */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: `-${offset}`,
        color: '#ff003c', opacity: glitching ? 0.7 : 0.3,
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 0.9, letterSpacing: '-2px',
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
        fontSize, lineHeight: 0.9, letterSpacing: '-2px',
        whiteSpace: 'pre-line', filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>
      {/* Main */}
      <div style={{
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 0.9, letterSpacing: '-2px',
        color: '#00ff41', whiteSpace: 'pre-line',
        textShadow: '0 0 20px rgba(0,255,65,0.4)',
      }}>
        {display.join('\n')}
      </div>
    </div>
  )
}

function FloatingLabel({ text, delay, yOffset }) {
  return (
    <motion.div
      animate={{ y: [0, yOffset, 0] }}
      transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut" }}
      style={{
        padding: '6px 12px',
        border: '1px solid rgba(0,255,65,0.3)',
        background: 'rgba(0,0,0,0.6)',
        color: 'rgba(0,255,65,0.8)',
        fontFamily: "'Share Tech Mono'",
        fontSize: '12px',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 0 10px rgba(0,255,65,0.1)',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      [{text}]
    </motion.div>
  )
}

export default function HeroSection() {
  const isMobile = useIsMobile()
  const sectionRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  // Terminal slides in from bottom left as you scroll down
  const terminalY = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const terminalOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

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
    <section ref={sectionRef} className="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      padding: isMobile ? '100px 16px 40px' : '40px',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* Background gradients to frame the tech */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 40%, rgba(0,255,65,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* LEFT SIDE: Terminal (Laptop is handled by TechParticleObject Canvas underneath) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: isMobile ? 'center' : 'flex-start',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none', // let mouse pass through to canvas
        paddingBottom: isMobile ? '40px' : '80px',
        paddingLeft: isMobile ? '0' : '40px'
      }}>
        
        {/* The Terminal Window */}
        <motion.div
          style={{
            y: terminalY,
            opacity: terminalOpacity,
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
                fontSize: '13px',
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

      {/* RIGHT SIDE: Typography & Tags */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: isMobile ? 'center' : 'flex-end',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none',
        paddingRight: isMobile ? '0' : '40px'
      }}>
        
        {/* Floating Labels Cloud */}
        <div style={{ position: 'absolute', top: '15%', right: isMobile ? '10%' : '-10%', opacity: 0.6, pointerEvents: 'none' }}>
          <div style={{ transform: 'rotate(15deg)' }}><FloatingLabel text="Code Review" delay={0.5} yOffset={-15} /></div>
        </div>
        <div style={{ position: 'absolute', bottom: '25%', right: isMobile ? '80%' : '60%', opacity: 0.5, pointerEvents: 'none' }}>
          <div style={{ transform: 'rotate(-10deg)' }}><FloatingLabel text="CI/CD" delay={1.2} yOffset={10} /></div>
        </div>
        <div style={{ position: 'absolute', top: '35%', right: isMobile ? '60%' : '80%', opacity: 0.7, pointerEvents: 'none' }}>
          <FloatingLabel text="Git Flow" delay={0} yOffset={-20} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ pointerEvents: 'auto' }}
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
            fontSize: isMobile ? '16px' : '24px',
            marginTop: '16px',
            background: 'linear-gradient(90deg, #00ff41, #00f5ff, #ff003c, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            textAlign: isMobile ? 'center' : 'right'
          }}
        >
          BUILD. COMMIT. BREAK. RECOVER.
        </motion.div>

        {/* Vertical Tags List (Right Edge) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '10%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'flex-end',
              pointerEvents: 'auto'
            }}
          >
            {[
              { title: 'Git Flow', sub: 'Workflow & Collaboration' },
              { title: 'Branching Strategy', sub: 'Feature · Develop · Main' },
              { title: 'Code Review', sub: 'Better Code Together' },
              { title: 'CI/CD', sub: 'Automate · Test · Deploy' }
            ].map((tag, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: -10, scale: 1.05 }}
                style={{ 
                  border: '1px solid rgba(0,255,65,0.3)', 
                  background: 'rgba(0,0,0,0.8)', 
                  padding: '10px 16px', 
                  borderRadius: '4px',
                  textAlign: 'right',
                  cursor: 'crosshair',
                  boxShadow: '0 0 10px rgba(0,255,65,0.1)'
                }}
              >
                <div style={{ color: '#00ff41', fontFamily: "'Orbitron'", fontWeight: 700, fontSize: '14px' }}>{tag.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Space Grotesk'", fontSize: '10px' }}>{tag.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
