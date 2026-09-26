const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.jsx', 'utf8');

// 1. Fix the main section paddingTop
content = content.replace(
  "paddingTop: isMobile ? 'env(safe-area-inset-top, 40px)' : '100px',",
  "paddingTop: isMobile ? 'calc(env(safe-area-inset-top, 20px) + 80px)' : '100px',"
);

// 2. Fix the left side justifyContent
content = content.replace(
  "justifyContent: 'center',",
  "justifyContent: isMobile ? 'flex-start' : 'center',"
);

fs.writeFileSync('src/components/HeroSection.jsx', content);
console.log('Successfully fixed mobile overlapping navbar issue');
