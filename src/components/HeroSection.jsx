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

  // Fire a 3D WebGL pulse when the commit happens
  useEffect(() => {
    const commitLine = '> [main 773a902] first breath'
    if (typedLines.includes(commitLine)) {
      if (!window.__pulseFired) {
        window.__pulseFired = true
        window.dispatchEvent(new Event('terminalPulse'))
      }
    }
  }, [typedLines])

  return (
    <section className="hero-section" style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      paddingTop: isMobile ? 'env(safe-area-inset-top, 40px)' : '100px',
      paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 40px)' : '100px',
      paddingLeft: isMobile ? '20px' : '60px',
      paddingRight: isMobile ? '20px' : '60px',
      overflowX: 'hidden',
      pointerEvents: 'none',
      color: '#fff',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      
      {/* NAVBAR */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: isMobile ? 'none' : 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', pointerEvents: 'auto', zIndex: 50,
        borderBottom: '1px solid rgba(0,255,65,0.1)',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 800, fontSize: '20px', color: '#00ff41', letterSpacing: '2px' }}>
          [CODEX]
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
          <span style={{ color: '#00ff41', cursor: 'pointer' }}>• HOME</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>WORKSHOP</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>SCHEDULE</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>ABOUT</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>MENTORS</span>
        </div>
        <button style={{
          border: '1px solid #00ff41', color: '#00ff41',
          padding: '8px 24px', fontSize: '12px', fontWeight: 600,
          background: 'rgba(0,255,65,0.05)', cursor: 'pointer', transition: '0.3s'
        }}>
          REGISTER →
        </button>
      </nav>

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
        pointerEvents: 'none',
        paddingRight: isMobile ? '0' : '40px'
      }}>
        
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ pointerEvents: 'auto', marginBottom: '10px' }}>
          <GlitchTitle isMobile={isMobile} />
        </motion.div>
        
        {/* Gradient Subheading */}
        <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: "'Orbitron'", fontWeight: 800, fontSize: isMobile ? '14px' : '20px',
            marginBottom: '20px', letterSpacing: isMobile ? '1px' : '2px',
            textAlign: isMobile ? 'center' : 'left'
          }}>
          <span style={{ color: '#00ff41' }}>BUILD. COMMIT. </span>
          <span style={{ color: '#ff003c' }}>BREAK. </span>
          <span style={{ color: '#a855f7' }}>RECOVER.</span>
        </motion.div>

        {/* Body Text */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '14px' : '16px', lineHeight: 1.7,
            maxWidth: '500px', marginBottom: '30px', textAlign: isMobile ? 'center' : 'left',
            fontFamily: "'Share Tech Mono'"
          }}>
          Learn Git & GitHub through hands-on practice, real workflows and collaborative development.
        </motion.p>

        {/* Grid Info Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: isMobile ? '20px' : '30px', marginBottom: isMobile ? '10px' : '40px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <div><div style={{ fontSize: '12px', fontWeight: 700 }}>26 SEP 2026</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>SATURDAY</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div><div style={{ fontSize: '12px', fontWeight: 700 }}>10:00 AM - 1:00 PM</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>3 HOURS</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start', marginTop: isMobile ? '10px' : '0' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}><div style={{ fontSize: '12px', fontWeight: 700 }}>ST. FRANCIS</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>INSTITUTE OF TECHNOLOGY</div></div>
          </div>
        </motion.div>

        {/* Mobile visual spacer for the 3D Laptop */}
        {isMobile && <div style={{ height: '25vh', width: '100%' }} />}

        {/* Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', marginBottom: '40px', pointerEvents: 'auto', width: isMobile ? '100%' : 'auto' }}>
          <button style={{ background: '#00ff41', color: '#000', padding: '14px 28px', fontWeight: 700, fontSize: '14px', fontFamily: "'Orbitron'", cursor: 'pointer', border: 'none', boxShadow: '0 0 15px rgba(0,255,65,0.4)', width: isMobile ? '100%' : 'auto' }}>
            &gt; REGISTER NOW
          </button>
          <button style={{ background: 'transparent', border: '1px solid #00ff41', color: '#00ff41', padding: '14px 28px', fontWeight: 700, fontSize: '14px', fontFamily: "'Orbitron'", cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
            &gt; VIEW DETAILS
          </button>
        </motion.div>

        {/* The Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          style={{ width: '100%', maxWidth: '540px', pointerEvents: 'auto' }} className="terminal-card"
        >
          <div className="terminal-header" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffe600' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff41' }} />
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.5)', fontFamily: "'Share Tech Mono'" }}>terminal - bash</span>
          </div>
          <div style={{ padding: '20px', minHeight: '180px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{ fontSize: isMobile ? '10px' : '13px', lineHeight: 1.8, color: line.startsWith('$') ? '#00ff41' : 'rgba(255,255,255,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>
                {line}
                {i === typedLines.length - 1 && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ marginLeft: '4px', color: '#00ff41' }}>█</motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Floating Glassmorphic Cards (over 3D Canvas) */}
      {!isMobile && (
        <div style={{ flex: 1, position: 'relative', pointerEvents: 'none', height: '100vh', alignSelf: 'stretch' }}>
           
           {/* Card 1: 12 Contributors */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
             style={{ position: 'absolute', top: '15vh', right: '5%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,255,65,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <svg width="30" height="30" viewBox="0 0 24 24" fill="#00ff41"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>12</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Contributors</div>
             </div>
           </motion.div>

           {/* Card 2: 48 Commits */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}
             style={{ position: 'absolute', top: '35vh', right: '15%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(245,166,35,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#f5a623' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>48</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Commits</div>
             </div>
           </motion.div>

           {/* Card 3: 5 Branches */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}
             style={{ position: 'absolute', top: '55vh', right: '2%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,245,255,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#00f5ff' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>5</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Branches</div>
             </div>
           </motion.div>
           
           {/* Card 4: 1 Community */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
             style={{ position: 'absolute', top: '75vh', right: '10%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#a855f7' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>1</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Community</div>
             </div>
           </motion.div>
           
        </div>
      )}
    </section>
  )
}
