import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'

const WORKSHOP_LINES = [
  { prompt: '$', cmd: 'cat README.md', color: '#00ff41' },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '#', cmd: 'GITHUB WORKSHOP', color: '#00f5ff', bold: true },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '>', cmd: 'A hands-on session where YOU build a real page,', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: 'push live with Git, and learn how version', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: 'control PROTECTS you when everything breaks.', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '>', cmd: 'duration   : 3 hours', color: '#bf00ff' },
  { prompt: '>', cmd: 'level      : beginner-friendly', color: '#bf00ff' },
  { prompt: '>', cmd: 'outcome    : YOU pushed to GitHub ✓', color: '#ffe600' },
]

function StatBox({ label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '1 1 90px', minWidth: '80px',
        border: `1px solid ${color}40`,
        background: `${color}06`,
        padding: '16px 12px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {[['top','left'], ['top','right'], ['bottom','left'], ['bottom','right']].map(([v, h]) => (
        <div key={`${v}-${h}`} style={{
          position: 'absolute', [v]: 4, [h]: 4,
          width: 7, height: 7,
          borderTop: v === 'top' ? `1px solid ${color}80` : 'none',
          borderBottom: v === 'bottom' ? `1px solid ${color}80` : 'none',
          borderLeft: h === 'left' ? `1px solid ${color}80` : 'none',
          borderRight: h === 'right' ? `1px solid ${color}80` : 'none',
        }} />
      ))}
      <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: '22px', color, textShadow: `0 0 12px ${color}60` }}>{value}</div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textTransform: 'uppercase' }}>{label}</div>
    </motion.div>
  )
}

export default function DescriptionSection() {
  const isMobile = useIsMobile()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const xLeft = useTransform(scrollYProgress, [0, 0.4], [isMobile ? '-40px' : '-80px', '0px'])
  const xRight = useTransform(scrollYProgress, [0, 0.4], [isMobile ? '40px' : '80px', '0px'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section ref={sectionRef} style={{ position: 'relative', padding: isMobile ? '60px 16px' : '120px 24px', background: 'transparent', overflow: 'hidden' }}>
      {/* BG grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div style={{ x: xLeft, opacity }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: '#bf00ff', marginBottom: '10px' }}>
            ▸ WORKSHOP.README
          </div>
          <h2 style={{
            fontFamily: "'Orbitron'", fontWeight: 900,
            fontSize: isMobile ? 'clamp(28px, 9vw, 48px)' : 'clamp(32px, 6vw, 72px)',
            lineHeight: 1, letterSpacing: isMobile ? '-0.5px' : '-1px', marginBottom: isMobile ? '28px' : '48px',
          }}>
            <span style={{ color: '#00ff41' }}>WHAT</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>IS</span>{' '}
            <span style={{ color: '#00f5ff', textShadow: '0 0 30px rgba(0,245,255,0.4)' }}>THIS?</span>
          </h2>
        </motion.div>

        {/* Layout: stacked on mobile, two-col on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '20px' : '32px',
          alignItems: 'start',
        }}>
          {/* Terminal card */}
          <motion.div style={{ x: xLeft, opacity }}>
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff003c' }} />
                <div className="terminal-dot" style={{ background: '#ffe600' }} />
                <div className="terminal-dot" style={{ background: '#00ff41' }} />
                <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.1em' }}>README.md</span>
              </div>
              <div style={{ padding: isMobile ? '14px' : '20px' }}>
                {WORKSHOP_LINES.map((line, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    style={{ display: 'flex', gap: '8px', fontSize: isMobile ? '11px' : '12px', lineHeight: 1.7, fontFamily: "'Share Tech Mono'" }}
                  >
                    <span style={{ color: 'rgba(0,255,65,0.3)', flexShrink: 0 }}>{line.prompt}</span>
                    <span style={{ color: line.color, fontWeight: line.bold ? 700 : 400, wordBreak: 'break-word' }}>{line.cmd}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats + learn + buttons */}
          <motion.div style={{ x: isMobile ? undefined : xRight, opacity }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <StatBox label="Duration" value="3H" color="#00ff41" delay={0.1} />
                <StatBox label="Hands-on" value="100%" color="#00f5ff" delay={0.2} />
                <StatBox label="Commits" value="∞" color="#bf00ff" delay={0.3} />
              </div>

              {/* What you'll learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{ border: '1px solid rgba(0,255,65,0.12)', padding: isMobile ? '16px' : '24px', background: 'rgba(0,255,65,0.02)' }}
              >
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(0,255,65,0.5)', marginBottom: '14px' }}>YOU WILL LEARN</div>
                {[
                  ['01', 'Initialize a Git repo from scratch'],
                  ['02', 'Stage, commit, and push like a pro'],
                  ['03', 'Break things — and recover gracefully'],
                  ['04', 'Deploy your page live to GitHub Pages'],
                  ['05', 'Survive a merge conflict'],
                ].map(([num, text]) => (
                  <div key={num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontFamily: "'Orbitron'", fontSize: '9px', color: '#bf00ff', fontWeight: 700, flexShrink: 0, paddingTop: '2px' }}>{num}</span>
                    <span style={{ fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { href: '#roster', label: '▸ SEE ROSTER', color: '#00ff41', border: 'rgba(0,255,65,0.3)', bg: 'rgba(0,255,65,0.04)' },
                  { href: 'https://docs.github.com', label: '▸ GIT DOCS', color: '#00f5ff', border: 'rgba(0,245,255,0.3)', bg: 'rgba(0,245,255,0.04)', external: true },
                ].map(b => (
                  <a key={b.label} href={b.href} target={b.external ? '_blank' : undefined} rel={b.external ? 'noopener noreferrer' : undefined}
                    style={{ textDecoration: 'none', flex: '1 1 120px' }}>
                    <motion.div
                      whileHover={{ borderColor: b.color, boxShadow: `0 0 16px ${b.color}40` }}
                      style={{
                        padding: isMobile ? '12px 16px' : '14px 24px',
                        border: `1px solid ${b.border}`, color: b.color,
                        fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px',
                        letterSpacing: '0.15em', textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.2s', background: b.bg,
                      }}
                    >{b.label}</motion.div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
