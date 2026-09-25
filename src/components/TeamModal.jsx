import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SkillBar({ label, level, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ marginBottom: '14px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
          {label.toUpperCase()}
        </span>
        <span style={{ fontFamily: "'Orbitron'", fontSize: '11px', color, fontWeight: 700 }}>
          {level}%
        </span>
      </div>
      <div className="skill-bar-bg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="skill-bar-fill"
          style={{
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </motion.div>
  )
}

function GlitchAvatar({ handle, color }) {
  const [glitched, setGlitched] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setGlitched(true)
      setTimeout(() => setGlitched(false), 200)
    }, 2500 + Math.random() * 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '120px',
      height: '120px',
      flexShrink: 0,
    }}>
      {/* Rotating rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: -8,
          border: `1px solid ${color}30`,
          borderRadius: '50%',
          borderTopColor: color,
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: -16,
          border: `1px dashed ${color}20`,
          borderRadius: '50%',
          borderRightColor: color + '60',
        }}
      />

      {/* Avatar circle */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${color}30, #000)`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanlines on avatar */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)',
          borderRadius: '50%',
          zIndex: 1,
        }} />

        {/* Glitch offset copy */}
        {glitched && (
          <>
            <span style={{
              position: 'absolute',
              fontFamily: "'Orbitron'",
              fontWeight: 900,
              fontSize: '22px',
              color: '#ff003c',
              left: '-3px',
              zIndex: 0,
              opacity: 0.7,
            }}>
              {handle.slice(0, 2)}
            </span>
            <span style={{
              position: 'absolute',
              fontFamily: "'Orbitron'",
              fontWeight: 900,
              fontSize: '22px',
              color: '#00f5ff',
              left: '3px',
              zIndex: 0,
              opacity: 0.7,
            }}>
              {handle.slice(0, 2)}
            </span>
          </>
        )}

        <span style={{
          fontFamily: "'Orbitron'",
          fontWeight: 900,
          fontSize: '22px',
          color,
          textShadow: `0 0 20px ${color}`,
          position: 'relative',
          zIndex: 2,
        }}>
          {handle.slice(0, 2)}
        </span>
      </div>
    </div>
  )
}

export default function TeamModal({ member, onClose }) {
  const [typed, setTyped] = useState('')
  const fullText = `$ whoami\n> ${member.handle}\n$ cat profile.json\n> Loading...`

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      if (i < fullText.length) {
        setTyped(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(t)
      }
    }, 25)
    return () => clearInterval(t)
  }, [fullText])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const c = member.color

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="member-modal-overlay"
        onClick={onClose}
        style={{ zIndex: 8000 }}
      >
        {/* Full screen dark BG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.97)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Grid lines on background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${c}08 1px, transparent 1px), linear-gradient(90deg, ${c}08 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Modal card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ scale: 0.9, opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#030303',
            border: `1px solid ${c}40`,
            boxShadow: `0 0 60px ${c}20, 0 0 120px ${c}08`,
            borderRadius: '4px',
          }}
        >
          {/* Modal header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: `1px solid ${c}20`,
            background: `${c}06`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffe600' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff41' }} />
            <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '11px', color: `${c}80`, letterSpacing: '0.2em', marginLeft: '8px' }}>
              PROFILE_{member.handle} — CODEX_TC
            </span>
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: `1px solid rgba(255,255,255,0.1)`,
                color: 'rgba(255,255,255,0.5)',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontFamily: "'Share Tech Mono'",
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff003c'; e.currentTarget.style.borderColor = '#ff003c' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '32px 28px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap' }}>
              <GlitchAvatar handle={member.handle} color={c} />

              <div style={{ flex: 1, minWidth: '200px' }}>
                {/* Vibe badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    display: 'inline-block',
                    padding: '3px 12px',
                    border: `1px solid ${c}50`,
                    background: `${c}10`,
                    fontFamily: "'Orbitron'",
                    fontSize: '9px',
                    fontWeight: 700,
                    color: c,
                    letterSpacing: '0.3em',
                    marginBottom: '10px',
                  }}
                >
                  {member.vibe}
                </motion.div>

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    fontFamily: "'Orbitron'",
                    fontWeight: 900,
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    color: '#fff',
                    marginBottom: '4px',
                    lineHeight: 1.1,
                  }}
                >
                  {member.name}
                </motion.div>

                {/* Handle + role */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}
                >
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '13px', color: c }}>@{member.github}</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{member.role}</span>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
                >
                  {[
                    { k: 'COMMITS', v: member.commits.toLocaleString() },
                    { k: 'STREAK', v: `${member.streak}d` },
                    { k: 'STATUS', v: 'ONLINE' },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>{k}</div>
                      <div style={{ fontFamily: "'Orbitron'", fontSize: '16px', fontWeight: 700, color: c }}>{v}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

              {/* Left: Bio terminal */}
              <div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: `${c}60`, marginBottom: '12px' }}>
                  ▸ BIO.TXT
                </div>
                <div style={{
                  background: '#000',
                  border: `1px solid ${c}20`,
                  padding: '16px',
                  borderRadius: '2px',
                  fontFamily: "'Share Tech Mono'",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                  minHeight: '100px',
                }}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {member.bio}
                  </motion.span>
                </div>

                {/* Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: '16px',
                    padding: '14px 16px',
                    borderLeft: `3px solid ${c}`,
                    background: `${c}06`,
                    fontFamily: "'Share Tech Mono'",
                    fontSize: '12px',
                    color: c,
                    fontStyle: 'italic',
                  }}
                >
                  "{member.quote}"
                </motion.div>
              </div>

              {/* Right: Skills */}
              <div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: '10px', letterSpacing: '0.4em', color: `${c}60`, marginBottom: '12px' }}>
                  ▸ SKILLS.JSON
                </div>
                <div style={{
                  background: '#000',
                  border: `1px solid ${c}20`,
                  padding: '16px',
                  borderRadius: '2px',
                }}>
                  {member.skills.map((skill, i) => (
                    <SkillBar
                      key={skill}
                      label={skill}
                      level={member.skillLevels[i]}
                      color={c}
                      delay={0.4 + i * 0.1}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* GitHub link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}
            >
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ boxShadow: `0 0 20px ${c}50` }}
                  style={{
                    padding: '10px 24px',
                    border: `1px solid ${c}40`,
                    background: `${c}08`,
                    color: c,
                    fontFamily: "'Share Tech Mono'",
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ▸ GITHUB PROFILE
                </motion.div>
              </a>
              <motion.div
                whileHover={{ boxShadow: '0 0 20px rgba(255,0,60,0.3)' }}
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  border: '1px solid rgba(255,0,60,0.3)',
                  background: 'rgba(255,0,60,0.06)',
                  color: '#ff003c',
                  fontFamily: "'Share Tech Mono'",
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ✕ CLOSE
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
