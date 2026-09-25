import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function MemberModal({ member, onClose }) {
  if (!member) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }} onClick={onClose} />
        
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{ 
            position: 'relative', width: '100%', maxWidth: '600px', 
            background: '#111', border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '16px', overflow: 'hidden'
          }}
        >
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>{member.name}</h3>
                <div style={{ color: 'var(--text-secondary)' }}>{member.role}</div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', opacity: 0.5 }}>✕</button>
            </div>
            
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '32px' }}>
              {member.bio}
            </p>

            <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Commits</div>
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{member.commits}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Handle</div>
                <div style={{ fontSize: '16px', marginTop: '8px' }}>@{member.github}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function RosterSection({ data }) {
  const [activeMember, setActiveMember] = useState(null)
  const members = data?.members || []

  return (
    <section id="roster" style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 700, lineHeight: 1 }}>
            THE<br />COLLECTIVE
          </h2>
          <div style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
            Meet the architects of the Codex Technical Committee.
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {members.map((member, i) => (
            <motion.div
              key={member.github}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="agency-card clickable"
              onClick={() => setActiveMember(member)}
              style={{ padding: '32px', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px' }}>
                {member.role}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                {member.name}
              </h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>@{member.github}</div>
            </motion.div>
          ))}
        </div>

      </div>

      {activeMember && <MemberModal member={activeMember} onClose={() => setActiveMember(null)} />}
    </section>
  )
}
