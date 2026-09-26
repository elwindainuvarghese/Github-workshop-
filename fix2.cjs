const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.jsx', 'utf8');

// Replace the right side flex container and the top percentages
let replacement = `{/* RIGHT SIDE: Floating Glassmorphic Cards (over 3D Canvas) */}
      {!isMobile && (
        <div style={{ flex: 1, position: 'relative', pointerEvents: 'none', height: '100vh', alignSelf: 'stretch' }}>
           
           {/* Card 1: 12 Contributors */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
             style={{ position: 'absolute', top: '15vh', right: '5%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,255,65,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <svg width="30" height="30" viewBox="0 0 24 24" fill="#00ff41"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>12</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Contributors</div>
             </div>
           </motion.div>

           {/* Card 2: 48 Commits */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}
             style={{ position: 'absolute', top: '35vh', right: '15%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(245,166,35,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#f5a623' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>48</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Commits</div>
             </div>
           </motion.div>

           {/* Card 3: 5 Branches */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}
             style={{ position: 'absolute', top: '55vh', right: '2%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,245,255,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#00f5ff' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>5</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Branches</div>
             </div>
           </motion.div>
           
           {/* Card 4: 1 Community */}
           <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
             style={{ position: 'absolute', top: '75vh', right: '10%', padding: '15px 25px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '4px' }}>
             <div style={{ fontSize: '20px', color: '#a855f7' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: "'Space Grotesk'" }}>
               <div style={{ fontWeight: 700 }}>1</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Community</div>
             </div>
           </motion.div>
           
        </div>
      )}`;

content = content.replace(/\{\/\* RIGHT SIDE: Floating Glassmorphic Cards[\s\S]*?<\/section>/, replacement + '\n    </section>');

fs.writeFileSync('src/components/HeroSection.jsx', content);
console.log('Successfully fixed overlapping cards');
