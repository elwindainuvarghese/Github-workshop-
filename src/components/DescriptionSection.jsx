import { motion } from 'framer-motion'

export default function DescriptionSection() {
  return (
    <section id="about" style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px' }}>
            MASTER THE<br />WORKFLOW.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
            This isn't just about learning commands. It's about building a mental model of version control that empowers you to collaborate seamlessly and ship fearlessly.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { label: 'Duration', val: '3 Hours' },
              { label: 'Experience', val: 'Beginner' },
              { label: 'Format', val: 'Hands-on' },
              { label: 'Outcome', val: 'Deployed' }
            ].map((stat, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600 }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="agency-card"
          style={{ padding: '48px' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>Curriculum Highlights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              'Repository Architecture & Initialization',
              'Atomic Commits & Staging Mechanics',
              'Branching Strategies for Teams',
              'Conflict Resolution Tactics',
              'Continuous Deployment to Vercel'
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>0{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--text-primary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
