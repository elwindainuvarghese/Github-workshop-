import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'

function SkillBar({ label, level, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.4 }} style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>{label.toUpperCase()}</span>
        <span style={{ fontFamily: "'Orbitron'", fontSize: '10px', color, fontWeight: 700 }}>{level}%</span>
      </div>
      <div className="skill-bar-bg">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${level}%` }}
          transition={{ delay: delay + 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="skill-bar-fill"
          style={{ background: `linear-gradient(90deg, ${color}60, ${color})`, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
    </motion.div>
  )
}

function GlitchAvatar({ member, size = 100 }) {
  const [glitched, setGlitched] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  const handle = member.handle
  const color = member.color

  useEffect(() => {
    const t = setInterval(() => {
      setGlitched(true); setTimeout(() => setGlitched(false), 180)
    }, 2500 + Math.random() * 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div 
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ position: 'absolute', inset: -6, border: `1px solid ${color}30`, borderRadius: '50%', borderTopColor: color }} />
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{ position: 'absolute', inset: -12, border: `1px dashed ${color}18`, borderRadius: '50%', borderRightColor: `${color}60` }} />
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: member.image ? `url(${member.image}) center/cover` : `radial-gradient(circle at 35% 35%, ${color}30, #000)`,
        border: `2px solid ${color}`, boxShadow: `0 0 24px ${color}40, inset 0 0 16px ${color}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Holographic overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)', borderRadius: '50%', zIndex: 1, pointerEvents: 'none' }} />
        
        {/* Fallback Handle Text if no image */}
        {!member.image && glitched && (
          <>
            <span style={{ position: 'absolute', fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.35, color: '#ff003c', left: '-3px', zIndex: 0, opacity: 0.7 }}>{handle.slice(0,2)}</span>
            <span style={{ position: 'absolute', fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.35, color: '#00f5ff', left: '3px', zIndex: 0, opacity: 0.7 }}>{handle.slice(0,2)}</span>
          </>
        )}
        {!member.image && (
          <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.32, color, textShadow: `0 0 20px ${color}`, position: 'relative', zIndex: 2 }}>
            {handle.slice(0, 2)}
          </span>
        )}

        {/* Hover Social Overlay (Linkedin/Github) */}
        <AnimatePresence>
          {hovered && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
              animate={{ opacity: 1, backdropFilter: 'blur(6px)' }} 
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
            >
              {member.github && (
                <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', zIndex: 10 }}>
                  <motion.div whileHover={{ scale: 1.2, color: color, filter: `drop-shadow(0 0 8px ${color})` }} style={{ cursor: 'pointer', display: 'flex' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  </motion.div>
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', zIndex: 10 }}>
                  <motion.div whileHover={{ scale: 1.2, color: color, filter: `drop-shadow(0 0 8px ${color})` }} style={{ cursor: 'pointer', display: 'flex' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </motion.div>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function TeamModal({ member, onClose }) {
  const isMobile = useIsMobile()
  const c = member.color
  const avatarSize = isMobile ? 80 : 110

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="member-modal-overlay"
        onClick={onClose}
        style={{ zIndex: 8000, padding: isMobile ? '12px' : '20px' }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />

        {/* Grid BG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${c}06 1px, transparent 1px), linear-gradient(90deg, ${c}06 1px, transparent 1px)`,
          backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ scale: 0.92, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="member-modal"
          style={{
            maxWidth: '540px', width: '100%', margin: '0 auto', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(20px)',
            border: `1px solid ${c}40`, boxShadow: `0 0 40px ${c}15, inset 0 0 20px ${c}05`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top Bar */}
          <div style={{
            padding: isMobile ? '12px 16px' : '14px 22px',
            borderBottom: `1px solid ${c}20`,
            background: `${c}06`,
            display: 'flex', alignItems: 'center', gap: '8px',
            position: 'sticky', top: 0, zIndex: 3,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffe600' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ff41' }} />
            <span style={{ fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '9px' : '11px', color: `${c}80`, letterSpacing: '0.15em', marginLeft: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              PROFILE_{member.handle}
            </span>
            <button onClick={onClose} style={{
              marginLeft: 'auto', background: 'none', border: `1px solid rgba(255,255,255,0.1)`,
              color: 'rgba(255,255,255,0.5)', width: isMobile ? '28px' : '28px', height: isMobile ? '28px' : '28px',
              cursor: 'pointer', fontFamily: "'Share Tech Mono'", fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              borderRadius: '2px',
            }}>✕</button>
          </div>

          {/* Content */}
          <div style={{ padding: isMobile ? '20px 16px' : '28px 24px' }}>
            {/* Top: avatar + info */}
            <div style={{ display: 'flex', gap: isMobile ? '16px' : '24px', alignItems: 'flex-start', marginBottom: isMobile ? '20px' : '28px' }}>
              <GlitchAvatar member={member} size={avatarSize} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  style={{ display: 'inline-block', padding: '3px 10px', border: `1px solid ${c}50`, background: `${c}10`, fontFamily: "'Orbitron'", fontSize: isMobile ? '8px' : '9px', fontWeight: 700, color: c, letterSpacing: '0.25em', marginBottom: '8px' }}>
                  {member.vibe}
                </motion.div>
                <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: isMobile ? '20px' : '28px', color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px', textShadow: `0 0 20px ${c}40` }}>
                  {member.name}
                </motion.h2>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                  // {member.role}
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              {[ { l: 'LIFETIME COMMITS', v: member.commits }, { l: 'CURRENT STREAK', v: `${member.streak} DAYS` } ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '4px' }}>
                  <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '6px' }}>{s.l}</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: isMobile ? '16px' : '20px', fontWeight: 700, color: c }}>{s.v}</div>
                </motion.div>
              ))}
            </div>

            {/* Bio */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '10px' }}>SYSTEM.BIO_DATA</div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? '13px' : '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                {member.bio}
              </p>
            </motion.div>

            {/* Skills */}
            <div>
              <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '16px' }}>CORE.COMPETENCIES</div>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                {member.skills.map((s, i) => (
                  <SkillBar key={s} label={s} level={member.skillLevels[i]} color={c} delay={0.7 + i * 0.1} />
                ))}
              </div>
            </div>
            
            {/* Quote */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              style={{ marginTop: '28px', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Space Grotesk'", fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              "{member.quote}"
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
