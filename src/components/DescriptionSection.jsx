import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const WORKSHOP_LINES = [
  { prompt: '$', cmd: 'cat README.md', color: '#00ff41' },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '#', cmd: 'GITHUB WORKSHOP', color: '#00f5ff', bold: true },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '>', cmd: 'A hands-on session where YOU build a real page,', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: 'push it live with Git, and discover how version', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: 'control PROTECTS you when everything breaks.', color: 'rgba(255,255,255,0.7)' },
  { prompt: '>', cmd: '', color: 'transparent' },
  { prompt: '>', cmd: '─────────────────────────────────────────────', color: 'rgba(0,255,65,0.2)' },
  { prompt: '>', cmd: 'duration   : 3 hours', color: '#bf00ff' },
  { prompt: '>', cmd: 'level      : beginner-friendly', color: '#bf00ff' },
  { prompt: '>', cmd: 'format     : hands-on, real code, real breaks', color: '#bf00ff' },
  { prompt: '>', cmd: 'outcome    : YOU will have pushed to GitHub', color: '#ffe600' },
  { prompt: '>', cmd: '─────────────────────────────────────────────', color: 'rgba(0,255,65,0.2)' },
]

function StatBox({ label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: 1,
        minWidth: '120px',
        border: `1px solid ${color}40`,
        background: `${color}06`,
        padding: '20px 16px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner ticks */}
      <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `1px solid ${color}80`, borderLeft: `1px solid ${color}80` }} />
      <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `1px solid ${color}80`, borderRight: `1px solid ${color}80` }} />
      <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `1px solid ${color}80`, borderLeft: `1px solid ${color}80` }} />
      <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `1px solid ${color}80`, borderRight: `1px solid ${color}80` }} />

      <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: '28px', color, textShadow: `0 0 16px ${color}60`, letterSpacing: '-1px' }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function DescriptionSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const xLeft = useTransform(scrollYProgress, [0, 0.4], ['-80px', '0px'])
  const xRight = useTransform(scrollYProgress, [0, 0.4], ['80px', '0px'])
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '120px 24px',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* BG grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header with scroll-slide effect */}
        <motion.div style={{ x: xLeft, opacity }} >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', letterSpacing: '0.5em', color: '#bf00ff', marginBottom: '12px' }}>
            ▸ WORKSHOP.README
          </div>
          <h2 style={{
            fontFamily: "'Orbitron'",
            fontWeight: 900,
            fontSize: 'clamp(32px, 6vw, 72px)',
            lineHeight: 1,
            letterSpacing: '-1px',
            marginBottom: '48px',
          }}>
            <span style={{ color: '#00ff41' }}>WHAT</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>IS</span>{' '}
            <span style={{ color: '#00f5ff', textShadow: '0 0 30px rgba(0,245,255,0.4)' }}>THIS?</span>
          </h2>
        </motion.div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left: Terminal card */}
          <motion.div style={{ x: xLeft, opacity }}>
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff003c' }} />
                <div className="terminal-dot" style={{ background: '#ffe600' }} />
                <div className="terminal-dot" style={{ background: '#00ff41' }} />
                <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.15em' }}>
                  README.md — WORKSHOP
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                {WORKSHOP_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      fontSize: '12px',
                      lineHeight: 1.8,
                      fontFamily: "'Share Tech Mono'",
                    }}
                  >
                    <span style={{ color: 'rgba(0,255,65,0.3)', flexShrink: 0 }}>{line.prompt}</span>
                    <span style={{ color: line.color, fontWeight: line.bold ? 700 : 400 }}>{line.cmd}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Stats + buttons */}
          <motion.div style={{ x: xRight, opacity }} >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                style={{
                  border: '1px solid rgba(0,255,65,0.15)',
                  padding: '24px',
                  background: 'rgba(0,255,65,0.02)',
                }}
              >
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: 'rgba(0,255,65,0.5)', marginBottom: '16px' }}>
                  YOU WILL LEARN
                </div>
                {[
                  ['01', 'Initialize a Git repo from scratch'],
                  ['02', 'Stage, commit, and push like a pro'],
                  ['03', 'Break things — and recover gracefully'],
                  ['04', 'Deploy your page live to GitHub Pages'],
                  ['05', 'Survive a merge conflict'],
                ].map(([num, text]) => (
                  <div key={num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ fontFamily: "'Orbitron'", fontSize: '10px', color: '#bf00ff', fontWeight: 700, flexShrink: 0, paddingTop: '2px' }}>
                      {num}
                    </span>
                    <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      {text}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#roster" style={{ textDecoration: 'none', flex: 1 }}>
                  <motion.div
                    whileHover={{ borderColor: '#00ff41', boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}
                    style={{
                      padding: '14px 24px',
                      border: '1px solid rgba(0,255,65,0.3)',
                      color: '#00ff41',
                      fontFamily: "'Share Tech Mono'",
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: 'rgba(0,255,65,0.04)',
                    }}
                  >
                    ▸ SEE ROSTER
                  </motion.div>
                </a>
                <a href="https://docs.github.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                  <motion.div
                    whileHover={{ borderColor: '#00f5ff', boxShadow: '0 0 20px rgba(0,245,255,0.3)' }}
                    style={{
                      padding: '14px 24px',
                      border: '1px solid rgba(0,245,255,0.3)',
                      color: '#00f5ff',
                      fontFamily: "'Share Tech Mono'",
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: 'rgba(0,245,255,0.04)',
                    }}
                  >
                    ▸ GIT DOCS
                  </motion.div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
