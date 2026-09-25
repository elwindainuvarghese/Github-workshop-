import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamModal from './TeamModal'

function ErrorBlock() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'rgba(255,0,60,0.04)',
        border: '1px solid rgba(255,0,60,0.3)',
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,60,0.04) 2px, rgba(255,0,60,0.04) 4px)',
      }} />
      <motion.div
        animate={{ opacity: [1, 0.3, 1, 0.7, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: '40px', color: '#ff003c', marginBottom: '12px' }}
      >
        ⚠
      </motion.div>
      <div style={{
        fontFamily: "'Share Tech Mono'",
        fontSize: '16px',
        color: '#ff003c',
        letterSpacing: '0.2em',
        marginBottom: '8px',
        position: 'relative',
      }}>
        SYSTEM_ERROR_0x4A3F
      </div>
      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '12px', color: 'rgba(255,100,100,0.6)', letterSpacing: '0.05em' }}>
        Unable to load workshop participants.<br />
        <span style={{ color: 'rgba(255,100,100,0.35)' }}>▸ Check students.json</span>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      style={{
        border: '1px solid rgba(0,255,65,0.06)',
        padding: '28px',
        background: 'rgba(0,255,65,0.02)',
        borderRadius: '2px',
      }}
    >
      {['60%', '40%', '50%'].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '14px' : '10px',
          width: w,
          background: `rgba(0,255,65,${i === 0 ? 0.12 : 0.06})`,
          borderRadius: '2px',
          marginBottom: '10px',
        }} />
      ))}
    </motion.div>
  )
}

function MemberCard({ member, index, onClick }) {
  const [glitching, setGlitching] = useState(false)

  const handleHover = () => {
    setGlitching(true)
    setTimeout(() => setGlitching(false), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(member)}
      onMouseEnter={handleHover}
      className="team-card clickable"
    >
      {/* Corner brackets */}
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      {/* Top bar with color accent */}
      <div style={{
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${member.color}, transparent)`,
        position: 'absolute',
        top: 0, left: 0, right: 0,
        opacity: 0.6,
      }} />

      {/* Vibe badge */}
      <div style={{
        fontFamily: "'Share Tech Mono'",
        fontSize: '9px',
        letterSpacing: '0.3em',
        color: member.color,
        opacity: 0.6,
        marginBottom: '12px',
      }}>
        {member.vibe}
      </div>

      {/* Name with glitch */}
      <div style={{ position: 'relative', marginBottom: '6px' }}>
        {glitching && (
          <>
            <div style={{
              position: 'absolute',
              top: 0, left: '-2px',
              fontFamily: "'Orbitron'",
              fontWeight: 700,
              fontSize: '18px',
              color: '#ff003c',
              opacity: 0.7,
              clipPath: 'inset(30% 0 40% 0)',
            }}>{member.name}</div>
            <div style={{
              position: 'absolute',
              top: 0, left: '2px',
              fontFamily: "'Orbitron'",
              fontWeight: 700,
              fontSize: '18px',
              color: '#00f5ff',
              opacity: 0.7,
              clipPath: 'inset(60% 0 10% 0)',
            }}>{member.name}</div>
          </>
        )}
        <div style={{
          fontFamily: "'Orbitron'",
          fontWeight: 700,
          fontSize: '18px',
          color: '#fff',
          letterSpacing: '-0.5px',
        }}>
          {member.name}
        </div>
      </div>

      {/* Handle */}
      <div style={{
        fontFamily: "'Share Tech Mono'",
        fontSize: '12px',
        color: member.color,
        marginBottom: '8px',
        opacity: 0.8,
      }}>
        {member.handle}
      </div>

      {/* Role */}
      <div style={{
        fontFamily: "'Share Tech Mono'",
        fontSize: '11px',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '20px',
        letterSpacing: '0.05em',
      }}>
        {member.role}
      </div>

      {/* Mini stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'COMMITS', val: member.commits },
          { label: 'STREAK', val: `${member.streak}d` },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>{s.label}</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '14px', fontWeight: 700, color: member.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Click hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: "'Share Tech Mono'",
        fontSize: '10px',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.2em',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '12px',
        marginTop: 'auto',
      }}>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ▸
        </motion.span>
        CLICK TO ACCESS PROFILE
      </div>
    </motion.div>
  )
}

export default function RosterSection({ data, loading, error }) {
  const [activeMember, setActiveMember] = useState(null)
  const members = data?.members || []
  const participants = data?.participants || []

  return (
    <section id="roster" style={{ padding: '120px 24px', background: '#000', position: 'relative' }}>
      {/* BG horizontal lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,255,65,0.015) 59px, rgba(0,255,65,0.015) 60px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '60px' }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.5em', color: '#bf00ff', marginBottom: '12px' }}>
            ▸ TEAM_ROSTER.JSON
          </div>
          <h2 style={{
            fontFamily: "'Orbitron'",
            fontWeight: 900,
            fontSize: 'clamp(36px, 7vw, 80px)',
            lineHeight: 1,
            letterSpacing: '-2px',
            marginBottom: '8px',
          }}>
            <span style={{ color: '#00ff41' }}>CODEX</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>×</span>{' '}
            <span style={{ color: '#00f5ff', textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>TEAM</span>
          </h2>
          <p style={{ fontFamily: "'Share Tech Mono'", fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Click any card to access full profile
          </p>
        </motion.div>

        {/* Members grid */}
        {error ? (
          <ErrorBlock />
        ) : loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '80px' }}>
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '80px' }}>
            {members.map((m, i) => (
              <MemberCard key={m.github} member={m} index={i} onClick={setActiveMember} />
            ))}
          </div>
        )}

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.5em', color: '#00f5ff', marginBottom: '12px' }}>
            ▸ PARTICIPANTS.LIST
          </div>
          <h3 style={{
            fontFamily: "'Orbitron'",
            fontWeight: 900,
            fontSize: 'clamp(24px, 4vw, 48px)',
            letterSpacing: '-1px',
            color: '#00f5ff',
            marginBottom: '32px',
            textShadow: '0 0 30px rgba(0,245,255,0.2)',
          }}>
            ENROLLED [{participants.length}]
          </h3>

          {loading ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Array(8).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  style={{ width: '140px', height: '40px', background: 'rgba(0,245,255,0.06)', borderRadius: '2px', border: '1px solid rgba(0,245,255,0.1)' }}
                />
              ))}
            </div>
          ) : error ? (
            <ErrorBlock />
          ) : (
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              {/* Edge fades */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #000, transparent)', zIndex: 2, pointerEvents: 'none' }} />
              <div className="marquee-track" style={{ gap: '12px' }}>
                {[...participants, ...participants].map((p, i) => (
                  <div key={i} className="participant-pill">
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '2px',
                      background: 'rgba(0,245,255,0.1)',
                      border: '1px solid rgba(0,245,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#00f5ff',
                      fontFamily: "'Share Tech Mono'",
                      flexShrink: 0,
                    }}>
                      {(p.name || '?')[0]}
                    </span>
                    {p.name}
                    {p.github && (
                      <span style={{ fontSize: '10px', color: 'rgba(0,245,255,0.35)', fontFamily: "'Share Tech Mono'" }}>
                        @{p.github}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Member profile modal */}
      <AnimatePresence>
        {activeMember && (
          <TeamModal member={activeMember} onClose={() => setActiveMember(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
