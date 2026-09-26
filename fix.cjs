const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.jsx', 'utf8');

const replacement = `<motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: "'Orbitron'", fontWeight: 800, fontSize: isMobile ? '14px' : '20px',
            marginBottom: '20px', letterSpacing: isMobile ? '1px' : '2px',
            textAlign: isMobile ? 'center' : 'left'
          }}>
          <span style={{ color: '#00ff41' }}>BUILD. COMMIT. </span>
          <span style={{ color: '#ff003c' }}>BREAK. </span>
          <span style={{ color: '#a855f7' }}>RECOVER.</span>
        </motion.div>

        {/* Body Text */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '14px' : '16px', lineHeight: 1.7,
            maxWidth: '500px', marginBottom: '30px', textAlign: isMobile ? 'center' : 'left',
            fontFamily: "'Share Tech Mono'"
          }}>
          Learn Git & GitHub through hands-on practice, real workflows and collaborative development.
        </motion.p>

        {/* Grid Info Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: isMobile ? '20px' : '30px', marginBottom: isMobile ? '10px' : '40px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <div><div style={{ fontSize: '12px', fontWeight: 700 }}>26 SEP 2026</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>SATURDAY</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div><div style={{ fontSize: '12px', fontWeight: 700 }}>10:00 AM - 1:00 PM</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>3 HOURS</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start', marginTop: isMobile ? '10px' : '0' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}><div style={{ fontSize: '12px', fontWeight: 700 }}>ST. FRANCIS</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>INSTITUTE OF TECHNOLOGY</div></div>
          </div>
        </motion.div>

        {/* Mobile visual spacer for the 3D Laptop */}
        {isMobile && <div style={{ height: '40vh', width: '100%' }} />}

        {/* Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', marginBottom: '40px', pointerEvents: 'auto', width: isMobile ? '100%' : 'auto' }}>
          <button style={{ background: '#00ff41', color: '#000', padding: '14px 28px', fontWeight: 700, fontSize: '14px', fontFamily: "'Orbitron'", cursor: 'pointer', border: 'none', boxShadow: '0 0 15px rgba(0,255,65,0.4)', width: isMobile ? '100%' : 'auto' }}>
            &gt; REGISTER NOW
          </button>
          <button style={{ background: 'transparent', border: '1px solid #00ff41', color: '#00ff41', padding: '14px 28px', fontWeight: 700, fontSize: '14px', fontFamily: "'Orbitron'", cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
            &gt; VIEW DETAILS
          </button>
        </motion.div>

        {/* The Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          style={{ width: '100%', maxWidth: '540px', pointerEvents: 'auto' }} className="terminal-card"
        >
          <div className="terminal-header" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff003c' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffe600' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff41' }} />
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(0,255,65,0.5)', fontFamily: "'Share Tech Mono'" }}>terminal - bash</span>
          </div>
          <div style={{ padding: '20px', minHeight: '180px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            {typedLines.map`;

content = content.replace(/<motion\.div initial=\{\{ opacity: 0, filter: 'blur\(10px\)' \}\}[\s\S]*?\{typedLines\.map/, replacement);

fs.writeFileSync('src/components/HeroSection.jsx', content);
console.log('Successfully updated HeroSection');
