import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TEXTS = [
  'git commit', 'git push', 'git pull', 'git init', 'git add .',
  'git merge', 'git rebase', 'git stash', 'git clone', 'git log',
  'git diff', 'git reset', 'git branch', 'git checkout', 'git fetch',
  'git push --force', 'git cherry-pick', 'git bisect', 'git tag', 'git blame',
]

export default function TextTunnel() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)

  // Interaction state — all in refs so the canvas loop reads live values
  const mouse = useRef({ x: 0.45, y: 0.35 })          // normalized 0-1
  const targetMouse = useRef({ x: 0.45, y: 0.35 })    // smooth-follow target
  const speed = useRef(0.35)
  const targetSpeed = useRef(0.35)
  const time = useRef(0)
  const animId = useRef(null)
  const lastTouch = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')

    /* ── Resize ─────────────────────────────────────────── */
    const resize = () => {
      canvas.width  = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Mouse interaction ──────────────────────────────── */
    const onMouseMove = (e) => {
      const r = section.getBoundingClientRect()
      targetMouse.current = {
        x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
      }
      // Slightly boost speed on mouse move
      targetSpeed.current = 0.55
      clearTimeout(window.__tunnelMouseTimer)
      window.__tunnelMouseTimer = setTimeout(() => { targetSpeed.current = 0.35 }, 300)
    }

    /* ── Scroll wheel – burst of speed ─────────────────── */
    const onWheel = (e) => {
      const r = section.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) {
        const delta = Math.abs(e.deltaY)
        targetSpeed.current = Math.min(3.5, 0.35 + delta * 0.018)
        clearTimeout(window.__tunnelWheelTimer)
        window.__tunnelWheelTimer = setTimeout(() => { targetSpeed.current = 0.35 }, 350)
      }
    }

    /* ── Touch – move = tilt, swipe = speed ─────────────── */
    const onTouchStart = (e) => {
      const t = e.touches[0]
      const r = section.getBoundingClientRect()
      lastTouch.current = { x: t.clientX, y: t.clientY }
      targetMouse.current = {
        x: Math.max(0, Math.min(1, (t.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (t.clientY - r.top)  / r.height)),
      }
    }
    const onTouchMove = (e) => {
      const t = e.touches[0]
      const r = section.getBoundingClientRect()
      targetMouse.current = {
        x: Math.max(0, Math.min(1, (t.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (t.clientY - r.top)  / r.height)),
      }
      // Swipe speed
      if (lastTouch.current) {
        const dy = Math.abs(t.clientY - lastTouch.current.y)
        targetSpeed.current = Math.min(3.0, 0.35 + dy * 0.06)
      }
      lastTouch.current = { x: t.clientX, y: t.clientY }
      clearTimeout(window.__tunnelTouchTimer)
      window.__tunnelTouchTimer = setTimeout(() => { targetSpeed.current = 0.35 }, 400)
    }
    const onTouchEnd = () => {
      lastTouch.current = null
      targetSpeed.current = 0.35
    }

    section.addEventListener('mousemove',  onMouseMove)
    section.addEventListener('touchstart', onTouchStart, { passive: true })
    section.addEventListener('touchmove',  onTouchMove,  { passive: true })
    section.addEventListener('touchend',   onTouchEnd)
    window.addEventListener('wheel', onWheel, { passive: true })

    /* ── Draw loop ──────────────────────────────────────── */
    const N = 22   // number of text rows in the ribbon

    const draw = () => {
      const W = canvas.width
      const H = canvas.height

      /* Smooth-follow mouse & speed */
      const EASE = 0.06
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * EASE
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * EASE
      speed.current   += (targetSpeed.current   - speed.current)   * 0.08

      time.current += 0.0028 * speed.current

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, W, H)

      /* ── Vanishing point: follows mouse ─────────────── */
      const vx = W * (0.12 + mouse.current.x * 0.48)
      const vy = H * (0.05 + mouse.current.y * 0.38)

      /* ── Near end: bottom-right, slight mouse influence */
      const nx = W  * (0.7  + mouse.current.x * 0.28)
      const ny = H  * (0.82 + mouse.current.y * 0.14)

      /* ── Sphere position: ~28% along the ribbon ─────── */
      const t28  = 0.28
      const spX = vx + (nx - vx) * t28
      const spY = vy + (ny - vy) * t28
      const sphR = Math.min(W, H) * (W < 500 ? 0.055 : 0.052)

      /* ═══════ DRAW TEXT RIBBON ═════════════════════════ */
      for (let i = 0; i < N; i++) {
        /* phase: 0 = at vanishing pt (far/tiny), 1 = at viewer (huge) */
        let phase = ((i / N) + time.current) % 1

        /* Quadratic ease so near-rows rush in dramatically */
        const ep = phase * phase

        /* Position along the ribbon */
        const rx = vx + (nx - vx) * ep
        const ry = vy + (ny - vy) * ep

        /* Font size */
        const maxFS = Math.min(W * 0.17, W < 500 ? 72 : 110)
        const fs    = Math.max(7, 7 + (maxFS - 7) * ep)

        /* Which text row */
        const txt = TEXTS[Math.abs(Math.floor(i + time.current * 8)) % TEXTS.length]

        /* Alpha – fade in from far, slight fade at very-near */
        const alpha = Math.min(1, ep * 1.4) * (phase > 0.95 ? (1 - phase) * 20 : 1)
        if (alpha <= 0.01) continue

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.font        = `bold ${fs}px "Share Tech Mono", "Courier New", monospace`
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'

        /* ── Style: neon yellow-green fill + purple glowing stroke */
        const glowStr = ep

        /* Thick dark-purple outer stroke (creates the 3D extruded look) */
        ctx.shadowColor  = `rgba(100, 0, 220, ${glowStr})`
        ctx.shadowBlur   = fs * 0.5 * ep
        ctx.strokeStyle  = `rgba(90, 0, 180, ${alpha * 0.9})`
        ctx.lineWidth    = fs * 0.12
        ctx.strokeText(txt, rx, ry)

        /* Mid purple stroke */
        ctx.strokeStyle  = `rgba(160, 80, 255, ${alpha * 0.7})`
        ctx.lineWidth    = fs * 0.05
        ctx.strokeText(txt, rx, ry)

        /* Neon yellow-green fill — matches the reference image exactly */
        ctx.shadowColor  = `rgba(180, 255, 10, ${glowStr * 0.6})`
        ctx.shadowBlur   = fs * 0.15
        ctx.fillStyle    = `rgb(${Math.round(150 + 80 * ep)}, 255, ${Math.round(20 * (1 - ep))})`
        ctx.fillText(txt, rx, ry)

        ctx.restore()
      }

      /* ═══════ DRAW SPHERE ══════════════════════════════ */

      /* Outer atmospheric halo */
      const halo = ctx.createRadialGradient(spX, spY, 0, spX, spY, sphR * 3.5)
      halo.addColorStop(0,   `rgba(160, 0, 255, 0.35)`)
      halo.addColorStop(0.5, `rgba(100, 0, 180, 0.12)`)
      halo.addColorStop(1,   `rgba(0,   0,   0, 0)`)
      ctx.beginPath()
      ctx.arc(spX, spY, sphR * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      /* Sphere body gradient */
      const sg = ctx.createRadialGradient(
        spX - sphR * 0.35, spY - sphR * 0.35, sphR * 0.05,
        spX, spY, sphR
      )
      sg.addColorStop(0,   '#cc55ff')
      sg.addColorStop(0.35,'#8800dd')
      sg.addColorStop(0.75,'#4400aa')
      sg.addColorStop(1,   '#0d001a')
      ctx.shadowColor = '#9900ff'
      ctx.shadowBlur  = 28
      ctx.beginPath()
      ctx.arc(spX, spY, sphR, 0, Math.PI * 2)
      ctx.fillStyle = sg
      ctx.fill()
      ctx.shadowBlur = 0

      /* Horizontal scanlines across sphere surface */
      ctx.save()
      ctx.beginPath()
      ctx.arc(spX, spY, sphR, 0, Math.PI * 2)
      ctx.clip()
      const lineGap = sphR * 0.11
      for (let ly = -sphR; ly < sphR; ly += lineGap) {
        ctx.strokeStyle = `rgba(0, 0, 0, 0.38)`
        ctx.lineWidth   = lineGap * 0.45
        ctx.beginPath()
        ctx.moveTo(spX - sphR, spY + ly)
        ctx.lineTo(spX + sphR, spY + ly)
        ctx.stroke()
      }
      /* Shine highlight */
      const shine = ctx.createRadialGradient(
        spX - sphR * 0.3, spY - sphR * 0.32, 0,
        spX - sphR * 0.3, spY - sphR * 0.32, sphR * 0.55
      )
      shine.addColorStop(0, 'rgba(255,255,255,0.25)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = shine
      ctx.fillRect(spX - sphR, spY - sphR, sphR * 2, sphR * 2)
      ctx.restore()

      /* Orbit ring 1 — tilted ellipse, spins */
      ctx.save()
      ctx.translate(spX, spY)
      ctx.rotate(time.current * 1.8)
      ctx.scale(1, 0.28)
      ctx.shadowColor = '#aa22ff'
      ctx.shadowBlur  = 7
      ctx.strokeStyle = `rgba(180, 80, 255, 0.7)`
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, sphR * 1.65, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      /* Orbit ring 2 — opposite tilt, slower */
      ctx.save()
      ctx.translate(spX, spY)
      ctx.rotate(-time.current * 0.9 + 1.2)
      ctx.scale(0.3, 1)
      ctx.shadowColor = '#6600cc'
      ctx.shadowBlur  = 5
      ctx.strokeStyle = `rgba(130, 40, 200, 0.45)`
      ctx.lineWidth   = 1
      ctx.beginPath()
      ctx.arc(0, 0, sphR * 1.45, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      /* Swirl particles orbiting the sphere */
      for (let p = 0; p < 6; p++) {
        const pa = (p / 6) * Math.PI * 2 + time.current * 2.5
        const pr = sphR * (1.5 + 0.3 * Math.sin(time.current * 3 + p))
        const px = spX + Math.cos(pa) * pr
        const py = spY + Math.sin(pa) * pr * 0.3
        ctx.beginPath()
        ctx.arc(px, py, 2.5 * (W < 500 ? 0.7 : 1), 0, Math.PI * 2)
        ctx.fillStyle = p % 2 === 0 ? '#ccff00' : '#cc44ff'
        ctx.shadowColor = p % 2 === 0 ? '#aaff00' : '#aa00ff'
        ctx.shadowBlur  = 8
        ctx.fill()
        ctx.shadowBlur  = 0
      }

      animId.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel',  onWheel)
      section.removeEventListener('mousemove',  onMouseMove)
      section.removeEventListener('touchstart', onTouchStart)
      section.removeEventListener('touchmove',  onTouchMove)
      section.removeEventListener('touchend',   onTouchEnd)
      cancelAnimationFrame(animId.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '400px',
        overflow: 'hidden',
        background: 'transparent',
        cursor: 'crosshair',
        touchAction: 'none',   /* let our touch handlers run unblocked */
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {/* Top label */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '24px', textAlign: 'center', pointerEvents: 'none', zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: 'clamp(8px, 1.5vw, 11px)',
            letterSpacing: '0.45em',
            color: 'rgba(180,255,30,0.45)',
            textTransform: 'uppercase',
          }}
        >
          ▸ MOVE MOUSE · SWIPE · SCROLL TO INTERACT ▸
        </motion.div>
      </div>

      {/* Bottom label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '28px 16px', textAlign: 'center', pointerEvents: 'none', zIndex: 2,
      }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{
            fontFamily: "'Orbitron'",
            fontWeight: 900,
            fontSize: 'clamp(13px, 4vw, 46px)',
            color: '#ccff00',
            textShadow: '0 0 28px rgba(180,255,0,0.55)',
            letterSpacing: 'clamp(2px, 0.5vw, 6px)',
          }}
        >
          EVERY COMMAND MATTERS
        </motion.div>
      </div>
    </section>
  )
}
