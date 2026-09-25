import { useEffect, useRef } from 'react'

// Matrix characters: mix of katakana, latin, digits, code symbols
const CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFabcdef{}[]()<>/\\|!@#$%^&*'

export default function MatrixRain({ opacity = 0.85 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fontSize = 14
    const cols = Math.ceil(canvas.width / fontSize)

    // Drop positions and speeds
    const drops = Array.from({ length: cols }, () => ({
      y: Math.random() * -canvas.height,
      speed: Math.random() * 1.2 + 0.4,
      len: Math.floor(Math.random() * 20 + 8),
      chars: [],
      changeTimer: 0,
    }))

    // Initialize chars for each drop
    drops.forEach(d => {
      d.chars = Array.from({ length: d.len }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      )
    })

    const draw = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop, colIdx) => {
        const x = colIdx * fontSize
        const gradient = drop.len

        drop.chars.forEach((ch, i) => {
          const y = drop.y + i * fontSize
          if (y < -fontSize || y > canvas.height) return

          const progress = i / gradient
          // Head = bright white-green, tail = dim
          if (i === gradient - 1) {
            // Glowing head
            ctx.shadowBlur = 8
            ctx.shadowColor = '#00ff41'
            ctx.fillStyle = '#ccffcc'
          } else if (progress > 0.85) {
            ctx.shadowBlur = 4
            ctx.shadowColor = '#00ff41'
            ctx.fillStyle = `rgba(0, 255, 65, ${0.9 - progress * 0.5})`
          } else if (progress > 0.5) {
            ctx.shadowBlur = 0
            ctx.fillStyle = `rgba(0, 200, 50, ${0.4 - progress * 0.15})`
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = `rgba(0, 100, 30, ${0.15})`
          }

          ctx.font = `${fontSize}px "Share Tech Mono", monospace`
          ctx.fillText(ch, x, y)
        })

        // Randomly mutate characters
        drop.changeTimer++
        if (drop.changeTimer > Math.random() * 4 + 2) {
          const idx = Math.floor(Math.random() * drop.chars.length)
          drop.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
          drop.changeTimer = 0
        }

        // Advance drop
        drop.y += drop.speed

        // Reset when fully off screen
        if (drop.y - drop.len * fontSize > canvas.height) {
          drop.y = -drop.len * fontSize - Math.random() * canvas.height * 0.5
          drop.speed = Math.random() * 1.2 + 0.4
          drop.len = Math.floor(Math.random() * 20 + 8)
          drop.chars = Array.from({ length: drop.len }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
          )
        }
      })

      ctx.shadowBlur = 0
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
      }}
    />
  )
}
