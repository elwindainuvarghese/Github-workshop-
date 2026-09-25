import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamModal from './TeamModal'
import useIsMobile from '../hooks/useIsMobile'

function ErrorBlock() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: 'rgba(255,0,60,0.04)', border: '1px solid rgba(255,0,60,0.3)', padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,60,0.04) 2px, rgba(255,0,60,0.04) 4px)' }} />
      <motion.div animate={{ opacity: [1, 0.3, 1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: '32px', color: '#ff003c', marginBottom: '10px' }}>⚠</motion.div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '14px', color: '#ff003c', letterSpacing: '0.15em', marginBottom: '6px' }}>
        SYSTEM_ERROR_0x4A3F
      </div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', color: 'rgba(255,100,100,0.6)' }}>
        Unable to load participants.<br /><span style={{ color: 'rgba(255,100,100,0.35)' }}>▸ Check students.json</span>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
      style={{ border: '1px solid rgba(0,255,65,0.06)', padding: '24px', background: 'rgba(0,255,65,0.02)', borderRadius: '2px' }}>
      {['60%', '40%', '50%'].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? '13px' : '10px', width: w, background: `rgba(0,255,65,${i === 0 ? 0.12 : 0.06})`, borderRadius: '2px', marginBottom: '10px' }} />
      ))}
    </motion.div>
  )
}

function MemberCard({ member, index, onClick, isMobile }) {
  const [glitching, setGlitching] = useState(false)
  const handleHover = () => { setGlitching(true); setTimeout(() => setGlitching(false), 300) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(member)}
      onMouseEnter={handleHover}
      className="team-card clickable"
      style={{ padding: isMobile ? '20px 16px' : '28px' }}
    >
      <div className="corner corner-tl" /><div className="corner corner-tr" />
      <div className="corner corner-bl" /><div className="corner corner-br" />

      <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${member.color}, transparent)`, position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.6 }} />

      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', letterSpacing: '0.25em', color: member.color, opacity: 0.6, marginBottom: '10px' }}>{member.vibe}</div>

      {/* Name with glitch */}
      <div style={{ position: 'relative', marginBottom: '4px' }}>
        {glitching && (
          <>
            <div style={{ position: 'absolute', top: 0, left: '-2px', fontFamily: "'Orbitron'", fontWeight: 700, fontSize: isMobile ? '15px' : '18px', color: '#ff003c', opacity: 0.7, clipPath: 'inset(30% 0 40% 0)' }}>{member.name}</div>
            <div style={{ position: 'absolute', top: 0, left: '2px', fontFamily: "'Orbitron'", fontWeight: 700, fontSize: isMobile ? '15px' : '18px', color: '#00f5ff', opacity: 0.7, clipPath: 'inset(60% 0 10% 0)' }}>{member.name}</div>
          </>
        )}
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: isMobile ? '15px' : '18px', color: '#fff', letterSpacing: '-0.3px' }}>{member.name}</div>
      </div>

      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', color: member.color, marginBottom: '6px', opacity: 0.8 }}>{member.handle}</div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px', letterSpacing: '0.04em' }}>{member.role}</div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
        {[{ label: 'COMMITS', val: member.commits }, { label: 'STREAK', val: `${member.streak}d` }].map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>{s.label}</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '13px', fontWeight: 700, color: member.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>▸</motion.span>
        CLICK TO ACCESS PROFILE
      </div>
    </motion.div>
  )
}

export default function RosterSection({ data, loading, error }) {
  const isMobile = useIsMobile()
  const [activeMember, setActiveMember] = useState(null)
  const members = data?.members || []
  const participants = data?.participants || []

  return (
    <section id="roster" style={{ padding: isMobile ? '60px 16px' : '120px 24px', background: '#000', position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,255,65,0.012) 59px, rgba(0,255,65,0.012) 60px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: isMobile ? '32px' : '60px' }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: '#bf00ff', marginBottom: '10px' }}>▸ TEAM_ROSTER.JSON</div>
          <h2 style={{
            fontFamily: "'Orbitron'", fontWeight: 900,
            fontSize: isMobile ? 'clamp(28px, 9vw, 60px)' : 'clamp(36px, 7vw, 80px)',
            lineHeight: 1, letterSpacing: isMobile ? '-1px' : '-2px', marginBottom: '6px',
          }}>
            <span style={{ color: '#00ff41' }}>CODEX</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>×</span>{' '}
            <span style={{ color: '#00f5ff', textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>TEAM</span>
          </h2>
          <p style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Tap any card to access full profile</p>
        </motion.div>

        {/* Members grid */}
        {error ? <ErrorBlock /> : loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '60px' }}>
            {Array(isMobile ? 4 : 6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '10px' : '16px', marginBottom: isMobile ? '48px' : '80px' }}>
            {members.map((m, i) => (
              <MemberCard key={m.github} member={m} index={i} onClick={setActiveMember} isMobile={isMobile} />
            ))}
          </div>
        )}

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: '#00f5ff', marginBottom: '10px' }}>▸ PARTICIPANTS.LIST</div>
          <h3 style={{
            fontFamily: "'Orbitron'", fontWeight: 900,
            fontSize: isMobile ? 'clamp(20px, 6vw, 36px)' : 'clamp(24px, 4vw, 48px)',
            letterSpacing: '-1px', color: '#00f5ff', marginBottom: '24px',
            textShadow: '0 0 30px rgba(0,245,255,0.2)',
          }}>
            ENROLLED [{participants.length}]
          </h3>

          {loading ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Array(6).fill(0).map((_, i) => (
                <motion.div key={i} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  style={{ width: isMobile ? '110px' : '140px', height: '40px', background: 'rgba(0,245,255,0.06)', borderRadius: '2px', border: '1px solid rgba(0,245,255,0.1)' }} />
              ))}
            </div>
          ) : error ? <ErrorBlock /> : (
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to right, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to left, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />
              <div className="marquee-track" style={{ gap: '10px' }}>
                {[...participants, ...participants].map((p, i) => (
                  <div key={i} className="participant-pill" style={{ padding: isMobile ? '6px 12px' : '8px 18px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '2px', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#00f5ff', fontFamily: "'Share Tech Mono'", flexShrink: 0 }}>
                      {(p.name || '?')[0]}
                    </span>
                    <span style={{ fontSize: isMobile ? '11px' : '13px' }}>{p.name}</span>
                    {!isMobile && p.github && (
                      <span style={{ fontSize: '10px', color: 'rgba(0,245,255,0.35)', fontFamily: "'Share Tech Mono'" }}>@{p.github}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeMember && <TeamModal member={activeMember} onClose={() => setActiveMember(null)} />}
      </AnimatePresence>
    </section>
  )
}
