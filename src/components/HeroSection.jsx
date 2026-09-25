import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

  const fontSize = isMobile
    ? 'clamp(36px, 13vw, 80px)'
    : 'clamp(56px, 10vw, 150px)'
  const offset = glitching ? (isMobile ? '2px' : '4px') : (isMobile ? '1px' : '2px')

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none', maxWidth: '100%' }}>
      {/* Red layer */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: `-${offset}`,
        color: '#ff003c', opacity: glitching ? 0.7 : 0.3,
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 0.9, letterSpacing: isMobile ? '-1px' : '-2px',
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
        fontSize, lineHeight: 0.9, letterSpacing: isMobile ? '-1px' : '-2px',
        whiteSpace: 'pre-line', filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>
      {/* Main */}
      <div style={{
        fontFamily: "'Orbitron', monospace", fontWeight: 900,
        fontSize, lineHeight: 0.9,
        letterSpacing: isMobile ? '-1px' : '-2px',
        color: '#00ff41',
        whiteSpace: 'pre-line',
        textShadow: '0 0 40px rgba(0,255,65,0.4)',
        position: 'relative',
      }}>
        {display.join('\n')}
      </div>
    </div>
  )
}

const tagWords = [
  { word: 'BUILD.', from: { x: -200, rotate: -15 }, color: '#00ff41' },
  { word: 'COMMIT.', from: { x: 200, rotate: 15 }, color: '#00f5ff' },
  { word: 'BREAK.', from: { y: -100, rotate: 0, scale: 2 }, color: '#ff003c' },
  { word: 'RECOVER.', from: { x: -200, rotate: 10 }, color: '#bf00ff' },
]

function KineticTagline({ isMobile }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '8px 12px' : '12px 20px',
      justifyContent: 'center',
    }}>
      {tagWords.map((item, i) => (
        <motion.span
          key={item.word}
          custom={i}
          initial={{ opacity: 0, ...item.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{ delay: i * 0.15 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: isMobile ? 'clamp(16px, 5vw, 24px)' : 'clamp(18px, 3.5vw, 36px)',
            fontFamily: "'Orbitron', monospace",
            fontWeight: 700,
            color: item.color,
            textShadow: `0 0 20px ${item.color}80`,
            display: 'inline-block',
            letterSpacing: isMobile ? '1px' : '2px',
          }}
        >
          {item.word === 'BREAK.'
            ? <motion.span animate={{ textShadow: [`0 0 20px ${item.color}80`, `0 0 40px ${item.color}`, `0 0 20px ${item.color}80`] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 1.2 }}>
                {item.word}
              </motion.span>
            : item.word}
        </motion.span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const isMobile = useIsMobile()

  // Fewer terminal lines on mobile to avoid overflow
  const TERMINAL_LINES = isMobile ? [
    '$ git init workshop',
    '> Initialized empty Git repository',
    '$ git add --all',
    '$ git commit -m "first breath"',
    '$ git push origin main',
    '> ████████████████ 100%',
  ] : [
    '$ git init workshop',
    '> Initialized empty Git repository',
    '$ git add --all',
    '$ git commit -m "first breath"',
    '> [main 7f3a9b2] first breath',
    '$ git push origin main',
    '> Pushing to github.com/codex/reality.git',
    '> ████████████████ 100%',
    '$ cat /dev/mind | git pipe --force',
  ]

  const { lines: typedLines } = useTyping(TERMINAL_LINES, 50, 800)

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      padding: isMobile ? '80px 16px 40px' : '0 24px',
    }}>
      {/* Center dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        width: '100%', maxWidth: '1200px',
      }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', marginBottom: isMobile ? '24px' : '40px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: 'rgba(0,255,65,0.5)', fontSize: isMobile ? '9px' : '11px', letterSpacing: '0.25em', fontFamily: "'Share Tech Mono'" }}>
            ▸ CODEX_TC
          </span>
          <span style={{ color: 'rgba(0,255,65,0.2)' }}>/</span>
          <span style={{ color: 'rgba(0,255,65,0.7)', fontSize: isMobile ? '9px' : '11px', letterSpacing: '0.25em', fontFamily: "'Share Tech Mono'" }}>
            GITHUB_WORKSHOP
          </span>
          <span style={{ color: 'rgba(0,255,65,0.2)' }}>/</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ color: '#00ff41', fontSize: isMobile ? '9px' : '11px', letterSpacing: '0.25em', fontFamily: "'Share Tech Mono'" }}>
            LIVE
          </motion.span>
        </motion.div>

        {/* Giant glitch title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: isMobile ? '24px' : '40px', overflow: 'hidden' }}
        >
          <GlitchTitle isMobile={isMobile} />
        </motion.div>

        {/* Kinetic tagline */}
        <div style={{ marginBottom: isMobile ? '32px' : '60px' }}>
          <KineticTagline isMobile={isMobile} />
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="terminal-card"
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '560px',
            margin: `0 auto ${isMobile ? '28px' : '48px'}`,
            textAlign: 'left',
          }}
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ff003c' }} />
            <div className="terminal-dot" style={{ background: '#ffe600' }} />
            <div className="terminal-dot" style={{ background: '#00ff41' }} />
            {!isMobile && (
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.15em' }}>
                BASH — CODEX@WORKSHOP
              </span>
            )}
          </div>
          <div style={{ padding: isMobile ? '12px 14px' : '16px 20px', minHeight: isMobile ? '100px' : '140px' }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{
                fontSize: isMobile ? '11px' : '12px',
                lineHeight: 1.7,
                color: line.startsWith('$') ? '#00ff41' : line.startsWith('>') ? 'rgba(0,245,255,0.7)' : 'rgba(0,255,65,0.5)',
                fontFamily: "'Share Tech Mono', monospace",
                wordBreak: 'break-all',
              }}>
                {line}
                {i === typedLines.length - 1 && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ marginLeft: '2px' }}>
                    █
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: isMobile ? '320px' : 'none',
            margin: '0 auto',
          }}
        >
          {[
            { label: '▸ ACCESS ROSTER', href: '#roster', color: '#00ff41', border: '1px solid #00ff41', bg: 'rgba(0,255,65,0.08)' },
            { label: '▸ GIT DOCS', href: 'https://docs.github.com', color: '#00f5ff', border: '1px solid #00f5ff', bg: 'rgba(0,245,255,0.06)', external: true },
          ].map(btn => (
            <a key={btn.label} href={btn.href} target={btn.external ? '_blank' : undefined} rel={btn.external ? 'noopener noreferrer' : undefined}
              style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${btn.color}50` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: isMobile ? '14px 20px' : '12px 32px',
                  border: btn.border, background: btn.bg, color: btn.color,
                  fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '12px' : '13px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '2px', textAlign: 'center',
                }}
              >
                {btn.label}
              </motion.div>
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator — hide on very small screens */}
        {!isMobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(0,255,65,0.35)', fontFamily: "'Share Tech Mono'" }}>
              SCROLL_DOWN
            </span>
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(0,255,65,0.6), transparent)' }} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
