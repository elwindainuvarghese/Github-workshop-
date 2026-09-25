import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MatrixRain from './MatrixRain'

// Typing effect hook
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
        const t = setTimeout(() => {
          setLineIdx(l => l + 1)
          setCharIdx(0)
        }, 400)
        return () => clearTimeout(t)
      } else {
        setDone(true)
      }
    }
  }, [charIdx, lineIdx, lines, speed, started, done])

  return { lines: lines.slice(0, lineIdx + 1).map((l, i) =>
    i < lineIdx ? l : l.slice(0, charIdx)
  ), done }
}

// Glitch title that randomly corrupts itself
function GlitchTitle() {
  const original = 'GITHUB\nWORKSHOP'
  const lines = original.split('\n')
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
      setTimeout(randomGlitch, Math.random() * 4000 + 2000)
    }
    const t = setTimeout(randomGlitch, 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
      {/* Red offset layer */}
      <div style={{
        position: 'absolute',
        top: 0, left: glitching ? '-4px' : '-2px',
        color: '#ff003c',
        opacity: glitching ? 0.7 : 0.3,
        transition: 'opacity 0.1s',
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace",
        fontWeight: 900,
        fontSize: 'clamp(56px, 12vw, 150px)',
        lineHeight: 0.9,
        letterSpacing: '-2px',
        whiteSpace: 'pre-line',
        filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>

      {/* Cyan offset layer */}
      <div style={{
        position: 'absolute',
        top: 0, left: glitching ? '4px' : '2px',
        color: '#00f5ff',
        opacity: glitching ? 0.7 : 0.3,
        transition: 'opacity 0.1s',
        pointerEvents: 'none',
        fontFamily: "'Orbitron', monospace",
        fontWeight: 900,
        fontSize: 'clamp(56px, 12vw, 150px)',
        lineHeight: 0.9,
        letterSpacing: '-2px',
        whiteSpace: 'pre-line',
        filter: 'blur(0.5px)',
      }}>
        {display.join('\n')}
      </div>

      {/* Main layer */}
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontWeight: 900,
        fontSize: 'clamp(56px, 12vw, 150px)',
        lineHeight: 0.9,
        letterSpacing: '-2px',
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

// Kinetic tagline — each word flies in from a different direction
const tagWords = [
  { word: 'BUILD.', from: { x: -200, rotate: -15 }, color: '#00ff41' },
  { word: 'COMMIT.', from: { x: 200, rotate: 15 }, color: '#00f5ff' },
  { word: 'BREAK.', from: { y: -100, rotate: 0, scale: 2 }, color: '#ff003c' },
  { word: 'RECOVER.', from: { x: -200, rotate: 10 }, color: '#bf00ff' },
]

function KineticTagline() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', justifyContent: 'center' }}>
      {tagWords.map((item, i) => (
        <motion.span
          key={item.word}
          initial={{ opacity: 0, ...item.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{
            delay: i * 0.15 + 0.3,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            fontSize: 'clamp(18px, 3.5vw, 36px)',
            fontFamily: "'Orbitron', monospace",
            fontWeight: 700,
            color: item.color,
            textShadow: `0 0 20px ${item.color}80`,
            display: 'inline-block',
            letterSpacing: '2px',
          }}
        >
          {item.word === 'BREAK.' ? (
            <motion.span
              animate={{
                textShadow: [
                  `0 0 20px ${item.color}80`,
                  `0 0 40px ${item.color}`,
                  `0 0 20px ${item.color}80`,
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 1.2 }}
            >
              {item.word}
            </motion.span>
          ) : item.word}
        </motion.span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const TERMINAL_LINES = [
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
    <section className="hero-section" style={{ minHeight: '100vh' }}>
      {/* Matrix rain background */}
      <MatrixRain opacity={0.2} />

      {/* Radial dark overlay at center so text is readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: '1200px', padding: '0 24px' }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <span style={{ color: 'rgba(0,255,65,0.4)', fontSize: '11px', letterSpacing: '0.3em', fontFamily: "'Share Tech Mono'" }}>
            ▸ CODEX_TC
          </span>
          <span style={{ color: 'rgba(0,255,65,0.2)' }}>/</span>
          <span style={{ color: 'rgba(0,255,65,0.7)', fontSize: '11px', letterSpacing: '0.3em', fontFamily: "'Share Tech Mono'" }}>
            GITHUB_WORKSHOP
          </span>
          <span style={{ color: 'rgba(0,255,65,0.2)' }}>/</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ color: '#00ff41', fontSize: '11px', letterSpacing: '0.3em', fontFamily: "'Share Tech Mono'" }}
          >
            LIVE
          </motion.span>
        </motion.div>

        {/* Giant glitch title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <GlitchTitle />
        </motion.div>

        {/* Kinetic tagline */}
        <div style={{ marginBottom: '60px' }}>
          <KineticTagline />
        </div>

        {/* Terminal typing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="terminal-card"
          style={{
            maxWidth: '560px',
            margin: '0 auto 48px',
            padding: '0',
            textAlign: 'left',
          }}
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ff003c' }} />
            <div className="terminal-dot" style={{ background: '#ffe600' }} />
            <div className="terminal-dot" style={{ background: '#00ff41' }} />
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.2em' }}>
              BASH — CODEX@WORKSHOP
            </span>
          </div>
          <div style={{ padding: '16px 20px', minHeight: '140px' }}>
            {typedLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: '12px',
                  lineHeight: 1.7,
                  color: line.startsWith('$') ? '#00ff41' : line.startsWith('>') ? 'rgba(0,245,255,0.7)' : 'rgba(0,255,65,0.5)',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {line}
                {i === typedLines.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    style={{ marginLeft: '2px' }}
                  >
                    █
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a href="#roster" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,65,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px 32px',
                border: '1px solid #00ff41',
                background: 'rgba(0,255,65,0.08)',
                color: '#00ff41',
                fontFamily: "'Share Tech Mono'",
                fontSize: '13px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            >
              ▸ ACCESS ROSTER
            </motion.div>
          </a>
          <a href="https://docs.github.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,245,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px 32px',
                border: '1px solid #00f5ff',
                background: 'rgba(0,245,255,0.06)',
                color: '#00f5ff',
                fontFamily: "'Share Tech Mono'",
                fontSize: '13px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            >
              ▸ GIT DOCS
            </motion.div>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(0,255,65,0.35)', fontFamily: "'Share Tech Mono'" }}>
            SCROLL_DOWN
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, rgba(0,255,65,0.6), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
