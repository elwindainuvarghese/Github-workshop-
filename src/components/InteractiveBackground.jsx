import { useEffect, useRef } from 'react'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    // Set canvas to full window size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Mouse/Touch state
    const pointer = { x: null, y: null, radius: 150 }

    const onPointerMove = (e) => {
      pointer.x = e.clientX || (e.touches && e.touches[0].clientX)
      pointer.y = e.clientY || (e.touches && e.touches[0].clientY)
    }
    const onPointerLeave = () => {
      pointer.x = null
      pointer.y = null
    }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('touchend', onPointerLeave)

    // Particles
    const particles = []
    const numParticles = Math.min(100, (window.innerWidth * window.innerHeight) / 10000)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 1.5
        this.vy = (Math.random() - 0.5) * 1.5
        this.baseSize = Math.random() * 2 + 1
        this.size = this.baseSize
        this.color = Math.random() > 0.8 ? '#00f5ff' : '#00ff41' // cyan or green
        this.isGlitching = false
      }

      update() {
        // Move
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1

        // Interact with pointer
        if (pointer.x != null && pointer.y != null) {
          const dx = pointer.x - this.x
          const dy = pointer.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < pointer.radius) {
            // Repel / glitch effect
            const force = (pointer.radius - distance) / pointer.radius
            this.x -= dx * force * 0.05
            this.y -= dy * force * 0.05
            this.isGlitching = true
            this.size = this.baseSize * 2
          } else {
            this.isGlitching = false
            this.size = this.baseSize
          }
        } else {
          this.isGlitching = false
          this.size = this.baseSize
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.isGlitching ? '#ff003c' : this.color // Turn red when glitching/interacting
        ctx.shadowBlur = this.isGlitching ? 15 : 5
        ctx.shadowColor = ctx.fillStyle
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Init particles
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle())
    }

    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // We want a dark trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)' // Adjust opacity for trail length
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Draw connections
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist / 100})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }

        // Connect to pointer if close
        if (pointer.x != null && pointer.y != null) {
          const dx = particles[i].x - pointer.x
          const dy = particles[i].y - pointer.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < pointer.radius) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 0, 60, ${1 - dist / pointer.radius})` // Red connections to cursor
            ctx.lineWidth = 1.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('touchend', onPointerLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#000'
      }}
    />
  )
}
