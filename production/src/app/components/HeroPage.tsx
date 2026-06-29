import { motion } from 'motion/react';
import { siteContent } from '@/content/site';
import pageBg from '@/imports/image-9.png';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
});

export function HeroPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <WipBanner />
      <Nav />

      <div className="flex justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <motion.p
            {...fadeUp(0.05)}
            style={{ fontSize: 'clamp(21px, 3.5vw, 34px)', fontWeight: 650, lineHeight: '1.05', letterSpacing: '-0.01em', marginBottom: '14px' }}
          >
            {siteContent.name}
          </motion.p>
          <div style={{ marginBottom: '56px' }}>
            {siteContent.roles.map((line, i) => (
              <motion.p
                key={line}
                {...fadeUp(0.1 + i * 0.07)}
                style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', fontWeight: 300, lineHeight: '1.55', letterSpacing: '0.01em', margin: 0 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            {...fadeUp(0.3)}
            style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 300, lineHeight: '1.8', maxWidth: '540px', opacity: 0.78 }}
          >
            {siteContent.bio}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
