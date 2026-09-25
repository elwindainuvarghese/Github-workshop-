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

function GlitchAvatar({ handle, color, size = 100 }) {
  const [glitched, setGlitched] = useState(false)
  useEffect(() => {
    const t = setInterval(() => {
      setGlitched(true); setTimeout(() => setGlitched(false), 180)
    }, 2500 + Math.random() * 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ position: 'absolute', inset: -6, border: `1px solid ${color}30`, borderRadius: '50%', borderTopColor: color }} />
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{ position: 'absolute', inset: -12, border: `1px dashed ${color}18`, borderRadius: '50%', borderRightColor: `${color}60` }} />
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${color}30, #000)`,
        border: `2px solid ${color}`, boxShadow: `0 0 24px ${color}40, inset 0 0 16px ${color}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)', borderRadius: '50%', zIndex: 1 }} />
        {glitched && (
          <>
            <span style={{ position: 'absolute', fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.35, color: '#ff003c', left: '-3px', zIndex: 0, opacity: 0.7 }}>{handle.slice(0,2)}</span>
            <span style={{ position: 'absolute', fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.35, color: '#00f5ff', left: '3px', zIndex: 0, opacity: 0.7 }}>{handle.slice(0,2)}</span>
          </>
        )}
        <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: size * 0.32, color, textShadow: `0 0 20px ${color}`, position: 'relative', zIndex: 2 }}>
          {handle.slice(0, 2)}
        </span>
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
    // Prevent body scroll when modal open
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
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(4px)' }} />

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
          style={{
            position: 'relative', zIndex: 2,
            width: '100%', maxWidth: isMobile ? '100%' : '800px',
            maxHeight: isMobile ? '92vh' : '88vh',
            overflowY: 'auto',
            background: '#030303',
            border: `1px solid ${c}40`,
            boxShadow: `0 0 50px ${c}18`,
            borderRadius: '4px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Header */}
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
            {/* Top: avatar + info — always row, but shrink on mobile */}
            <div style={{ display: 'flex', gap: isMobile ? '16px' : '24px', alignItems: 'flex-start', marginBottom: isMobile ? '20px' : '28px' }}>
              <GlitchAvatar handle={member.handle} color={c} size={avatarSize} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                  style={{ display: 'inline-block', padding: '3px 10px', border: `1px solid ${c}50`, background: `${c}10`, fontFamily: "'Orbitron'", fontSize: isMobile ? '8px' : '9px', fontWeight: 700, color: c, letterSpacing: '0.25em', marginBottom: '8px' }}>
                  {member.vibe}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
                  style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: isMobile ? 'clamp(18px, 5vw, 28px)' : 'clamp(22px, 3vw, 34px)', color: '#fff', marginBottom: '4px', lineHeight: 1.1, wordBreak: 'break-word' }}>
                  {member.name}
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px', color: c }}>@{member.github}</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.35)' }}>{member.role}</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                  style={{ display: 'flex', gap: isMobile ? '14px' : '20px', flexWrap: 'wrap' }}>
                  {[{ k: 'COMMITS', v: member.commits.toLocaleString() }, { k: 'STREAK', v: `${member.streak}d` }, { k: 'STATUS', v: 'ONLINE' }].map(({ k, v }) => (
                    <div key={k}>
                      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em' }}>{k}</div>
                      <div style={{ fontFamily: "'Orbitron'", fontSize: isMobile ? '13px' : '15px', fontWeight: 700, color: c }}>{v}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bio + Skills: stacked on mobile, two-col on desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
              {/* Bio */}
              <div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', letterSpacing: '0.35em', color: `${c}60`, marginBottom: '10px' }}>▸ BIO.TXT</div>
                <div style={{ background: '#000', border: `1px solid ${c}20`, padding: isMobile ? '12px' : '16px', borderRadius: '2px', fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{member.bio}</motion.span>
                </div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                  style={{ marginTop: '12px', padding: isMobile ? '10px 12px' : '12px 14px', borderLeft: `3px solid ${c}`, background: `${c}06`, fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px', color: c, fontStyle: 'italic' }}>
                  "{member.quote}"
                </motion.div>
              </div>

              {/* Skills */}
              <div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', letterSpacing: '0.35em', color: `${c}60`, marginBottom: '10px' }}>▸ SKILLS.JSON</div>
                <div style={{ background: '#000', border: `1px solid ${c}20`, padding: isMobile ? '12px' : '16px', borderRadius: '2px' }}>
                  {member.skills.map((skill, i) => (
                    <SkillBar key={skill} label={skill} level={member.skillLevels[i]} color={c} delay={0.35 + i * 0.09} />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ boxShadow: `0 0 16px ${c}50` }}
                  style={{ padding: isMobile ? '10px 18px' : '10px 22px', border: `1px solid ${c}40`, background: `${c}08`, color: c, fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s' }}>
                  ▸ GITHUB
                </motion.div>
              </a>
              <motion.div whileHover={{ boxShadow: '0 0 16px rgba(255,0,60,0.3)' }} onClick={onClose}
                style={{ padding: isMobile ? '10px 18px' : '10px 22px', border: '1px solid rgba(255,0,60,0.3)', background: 'rgba(255,0,60,0.06)', color: '#ff003c', fontFamily: "'Share Tech Mono'", fontSize: isMobile ? '11px' : '12px', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s' }}>
                ✕ CLOSE
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
