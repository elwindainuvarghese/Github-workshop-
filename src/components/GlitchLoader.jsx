import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?<>[]{}|\/'
const TARGET = 'CODEX'

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

export default function GlitchLoader({ onComplete }) {
  const [phase, setPhase] = useState('rain')     // rain | assemble | flash | done
  const [letters, setLetters] = useState(['', '', '', '', ''])
  const [lettersLocked, setLettersLocked] = useState([false, false, false, false, false])
  const [flashActive, setFlashActive] = useState(false)

  const canvasRef = useRef(null)
  const animIdRef = useRef(null)
  const doneRef = useRef(false)  // prevent onComplete firing twice

  // ─── Phase 1: HEX RAIN CANVAS ───────────────────────────
  useEffect(() => {
    if (phase !== 'rain') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 13
    const cols = Math.ceil(canvas.width / (fontSize * 0.62))
    let frame = 0

    const grid = Array.from({ length: Math.ceil(canvas.height / fontSize) }, () =>
      Array.from({ length: cols }, () => ({
        ch: randomChar(),
        alpha: Math.random() * 0.2,
      }))
    )

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const progress = Math.min(frame / 70, 1)

      if (frame % 2 === 0) {
        const r = Math.floor(Math.random() * grid.length)
        const c = Math.floor(Math.random() * cols)
        if (grid[r] && grid[r][c]) {
          grid[r][c].ch = randomChar()
          grid[r][c].alpha = Math.random() * 0.7 * progress
        }
      }

      grid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          if (cell.alpha <= 0) return
          ctx.globalAlpha = cell.alpha * progress
          ctx.fillStyle = '#00ff41'
          ctx.font = `${fontSize}px "Share Tech Mono", monospace`
          ctx.fillText(cell.ch, ci * fontSize * 0.62, (ri + 1) * fontSize)
        })
      })
      ctx.globalAlpha = 1
      frame++

      if (frame < 80) {
        animIdRef.current = requestAnimationFrame(draw)
      } else {
        setPhase('assemble')
      }
    }

    animIdRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animIdRef.current)
    }
  }, [phase])

  // ─── Phase 2: CODEX LETTER ASSEMBLY ─────────────────────
  useEffect(() => {
    if (phase !== 'assemble') return

    const timers = []
    TARGET.split('').forEach((targetChar, i) => {
      let scramCount = 0
      const scramInterval = setInterval(() => {
        if (scramCount < 10 + i * 2) {
          setLetters(prev => {
            const next = [...prev]
            next[i] = randomChar()
            return next
          })
          scramCount++
        } else {
          clearInterval(scramInterval)
          setLetters(prev => {
            const next = [...prev]
            next[i] = targetChar
            return next
          })
          setLettersLocked(prev => {
            const next = [...prev]
            next[i] = true
            return next
          })

          if (i === TARGET.length - 1) {
            // All letters locked — wait then flash
            const t = setTimeout(() => setPhase('flash'), 600)
            timers.push(t)
          }
        }
      }, 35 + i * 30)
      timers.push(scramInterval)
    })

    return () => timers.forEach(t => { clearTimeout(t); clearInterval(t) })
  }, [phase])

  // ─── Phase 3: FLASH → DONE ───────────────────────────────
  useEffect(() => {
    if (phase !== 'flash') return
    setFlashActive(true)

    const colors = ['#fff', '#00ff41', '#000', '#bf00ff', '#000', '#fff', '#000']
    let idx = 0
    const interval = setInterval(() => {
      idx++
      if (idx >= colors.length) {
        clearInterval(interval)
        setFlashActive(false)
        setPhase('done')
      }
    }, 90)

    return () => clearInterval(interval)
  }, [phase])

  // ─── Phase 4: DONE → call onComplete once ─────────────────
  useEffect(() => {
    if (phase !== 'done') return
    if (doneRef.current) return
    doneRef.current = true
    const t = setTimeout(onComplete, 300)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  // Don't render anything after done
  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 9000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Corner brackets */}
      {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
        <div key={`${v}-${h}`} style={{
          position: 'absolute', [v]: 28, [h]: 28,
          width: 36, height: 36,
          borderTop: v === 'top' ? '2px solid rgba(0,255,65,0.5)' : 'none',
          borderBottom: v === 'bottom' ? '2px solid rgba(0,255,65,0.5)' : 'none',
          borderLeft: h === 'left' ? '2px solid rgba(0,255,65,0.5)' : 'none',
          borderRight: h === 'right' ? '2px solid rgba(0,255,65,0.5)' : 'none',
          zIndex: 5,
        }} />
      ))}

      {/* Rain canvas — only during rain phase */}
      {phase === 'rain' && (
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      )}

      {/* CODEX letters — only during assemble phase */}
      {phase === 'assemble' && (
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {letters.map((ch, i) => (
              <span
                key={i}
                style={{
                  fontSize: 'clamp(56px, 12vw, 140px)',
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 900,
                  color: lettersLocked[i] ? '#00ff41' : '#bf00ff',
                  textShadow: lettersLocked[i]
                    ? '0 0 20px #00ff41, 0 0 60px #00ff4180'
                    : '0 0 10px #bf00ff',
                  letterSpacing: '8px',
                  display: 'inline-block',
                  minWidth: '0.7em',
                  textAlign: 'center',
                  transition: 'color 0.05s, text-shadow 0.05s',
                }}
              >
                {ch || '█'}
              </span>
            ))}
          </div>
          {lettersLocked.every(Boolean) && (
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.6em',
              textTransform: 'uppercase',
              color: '#00f5ff',
              fontFamily: "'Share Tech Mono', monospace",
              textShadow: '0 0 8px #00f5ff',
              animation: 'none',
            }}>
              TECHNICAL COMMITTEE
            </div>
          )}
          {/* Sweep line */}
          <motion.div
            animate={{ x: ['120%', '-120%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(90deg, transparent 20%, rgba(0,255,65,0.12) 50%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Flash overlay */}
      {flashActive && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: '#fff',
          opacity: 0.9,
          animation: 'none',
          mixBlendMode: 'screen',
        }} />
      )}

      {/* Status bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        color: 'rgba(0,255,65,0.4)',
        borderTop: '1px solid rgba(0,255,65,0.08)',
        zIndex: 5,
      }}>
        <span>{phase === 'rain' ? 'INITIALIZING...' : phase === 'assemble' ? 'DECRYPTING PAYLOAD...' : 'ACCESS GRANTED'}</span>
        <span>SYS_v2.4.1</span>
      </div>
    </div>
  )
}
