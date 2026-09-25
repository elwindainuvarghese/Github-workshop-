import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const GIT_COMMANDS = [
  'git init', 'git add .', 'git commit', 'git push', 'git pull',
  'git branch', 'git merge', 'git rebase', 'git stash', 'git log',
  'git diff', 'git status', 'git clone', 'git fetch', 'git checkout',
  'git reset', 'git revert', 'git tag', 'git remote', 'git cherry-pick',
]

export default function TextTunnel() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let scrollVal = 0

    const unsub = scrollYProgress.on('change', v => { scrollVal = v })

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const fov = 500

      const ROWS = 30
      const COLS_PER_ROW = 3

      for (let row = 0; row < ROWS; row++) {
        // z goes from far (0) to near (fov)
        const baseZ = ((row / ROWS + time * 0.25 + scrollVal * 0.5) % 1) * fov * 1.5
        const z = baseZ

        if (z <= 10) continue

        const scale = fov / (fov + z)
        const alpha = Math.min(1, (z / fov) * 1.5) * (1 - Math.max(0, (z - fov) / (fov * 0.5)))

        // Spread across the screen
        const spread = canvas.width * 0.7 * (1 - scale)

        for (let col = 0; col < COLS_PER_ROW; col++) {
          const cmdIdx = (row * COLS_PER_ROW + col) % GIT_COMMANDS.length
          const cmd = GIT_COMMANDS[cmdIdx]

          // Position: spiral/tunnel layout
          const angle = (col / COLS_PER_ROW) * Math.PI * 2 + row * 0.3 + time * 0.5
          const rx = Math.cos(angle) * spread * 0.6
          const ry = Math.sin(angle) * spread * 0.35

          const x = cx + rx * scale
          const y = cy + ry * scale

          const fontSize = Math.max(8, 28 * scale)

          // Color shifts with z depth
          const hue = (row * 30 + time * 50) % 360
          const isNear = z < fov * 0.3

          // Glow for near items
          if (isNear && alpha > 0.5) {
            ctx.shadowBlur = 12 * scale
            ctx.shadowColor = '#00ff41'
          } else {
            ctx.shadowBlur = 0
          }

          // Chromatic aberration for near items
          if (isNear && alpha > 0.7) {
            ctx.globalAlpha = alpha * 0.5
            ctx.fillStyle = '#ff003c'
            ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`
            ctx.textAlign = 'center'
            ctx.fillText(cmd, x - 2, y)

            ctx.fillStyle = '#00f5ff'
            ctx.fillText(cmd, x + 2, y)
          }

          // Main text
          ctx.globalAlpha = alpha
          ctx.fillStyle = isNear
            ? `hsl(${hue}, 100%, 70%)`
            : `rgba(0, ${Math.floor(180 * scale + 75)}, ${Math.floor(65 * scale)}, 1)`

          ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`
          ctx.textAlign = 'center'
          ctx.fillText(cmd, x, y)
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // Central sphere (like reference image)
      const sphereR = 36 + Math.sin(time * 2) * 4
      const gradient = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, sphereR)
      gradient.addColorStop(0, '#bf00ff')
      gradient.addColorStop(0.4, '#7700cc')
      gradient.addColorStop(1, '#1a0033')
      ctx.beginPath()
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.shadowBlur = 30
      ctx.shadowColor = '#bf00ff'
      ctx.fill()

      // Sphere ring
      ctx.strokeStyle = `rgba(0,245,255,${0.4 + Math.sin(time * 3) * 0.2})`
      ctx.lineWidth = 1
      ctx.shadowBlur = 8
      ctx.shadowColor = '#00f5ff'
      ctx.beginPath()
      ctx.ellipse(cx, cy, sphereR + 15, (sphereR + 15) * 0.25, time * 0.5, 0, Math.PI * 2)
      ctx.stroke()

      ctx.shadowBlur = 0

      time += 0.008
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
      unsub()
    }
  }, [scrollYProgress])

  return (
    <section
      ref={sectionRef}
      className="tunnel-section"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Section label */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Share Tech Mono'",
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(0,255,65,0.5)',
            textTransform: 'uppercase',
          }}
        >
          ▸ GIT COMMAND VORTEX — SCROLL TO ACCELERATE ▸
        </motion.div>
      </div>

      {/* Bottom label */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        textAlign: 'center',
      }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            fontFamily: "'Orbitron'",
            fontSize: 'clamp(14px, 4vw, 48px)',
            fontWeight: 900,
            color: '#00ff41',
            textShadow: '0 0 30px rgba(0,255,65,0.6)',
            letterSpacing: '4px',
          }}
        >
          EVERY COMMAND MATTERS
        </motion.div>
      </div>
    </section>
  )
}
