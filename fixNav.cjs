const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.jsx', 'utf8');

// 1. Update import
content = content.replace(
  "import { motion, useScroll, useTransform } from 'framer-motion'",
  "import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'"
);

// 2. Add state
content = content.replace(
  "export default function HeroSection() {",
  "export default function HeroSection() {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)"
);

// 3. Replace Navbar
const navReplacement = `{/* NAVBAR */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '15px 20px' : '20px 40px', pointerEvents: 'auto', zIndex: 50,
        borderBottom: '1px solid rgba(0,255,65,0.1)',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 800, fontSize: isMobile ? '16px' : '20px', color: '#00ff41', letterSpacing: '2px' }}>
          [CODEX]
        </div>
        {!isMobile ? (
          <>
            <div style={{ display: 'flex', gap: '30px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
              <span style={{ color: '#00ff41', cursor: 'pointer' }}>• HOME</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>WORKSHOP</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>SCHEDULE</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>ABOUT</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.3s' }}>MENTORS</span>
            </div>
            <button style={{
              border: '1px solid #00ff41', color: '#00ff41',
              padding: '8px 24px', fontSize: '12px', fontWeight: 600,
              background: 'rgba(0,255,65,0.05)', cursor: 'pointer', transition: '0.3s'
            }}>
              REGISTER -&gt;
            </button>
          </>
        ) : (
          <div onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ cursor: 'pointer', padding: '5px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute', top: '56px', left: 0, right: 0,
              background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid rgba(0,255,65,0.2)',
              padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
              zIndex: 40, borderTop: '1px solid rgba(0,255,65,0.1)', backdropFilter: 'blur(10px)',
              pointerEvents: 'auto',
              fontFamily: "'Orbitron'"
            }}
          >
            <span style={{ color: '#00ff41', fontSize: '14px', fontWeight: 700 }}>• HOME</span>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>WORKSHOP</span>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>SCHEDULE</span>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>ABOUT</span>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>MENTORS</span>
            <button style={{
              border: '1px solid #00ff41', color: '#000', background: '#00ff41',
              padding: '12px', fontSize: '14px', fontWeight: 700, marginTop: '10px', cursor: 'pointer'
            }}>
              REGISTER -&gt;
            </button>
          </motion.div>
        )}
      </AnimatePresence>`;

content = content.replace(/\{\/\* NAVBAR \*\/\}[\s\S]*?<\/nav>/, navReplacement);

fs.writeFileSync('src/components/HeroSection.jsx', content);
console.log('Successfully updated Navbar');
