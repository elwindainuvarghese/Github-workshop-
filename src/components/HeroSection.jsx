import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroSection() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '50vh'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={container} style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div style={{ y, opacity, textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(48px, 12vw, 160px)', 
            fontWeight: 800, 
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            marginBottom: '24px'
          }}
        >
          ELEVATE<br />YOUR CODE
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: 'clamp(16px, 2vw, 20px)', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}
        >
          A premium digital workshop designed to transform your understanding of version control. We build, we break, we innovate.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
        >
          <a href="#roster" className="btn-primary">View Roster</a>
          <a href="#about" className="btn-outline">Discover</a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Scroll to explore</span>
        <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            style={{ width: '100%', height: '50%', background: 'white' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
