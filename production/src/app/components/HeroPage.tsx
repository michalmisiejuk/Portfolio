import { motion } from 'motion/react';
import { siteContent } from '@/content/site';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
});

export function HeroPage() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="flex justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <motion.p
            {...fadeUp(0.05)}
            style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 700, lineHeight: 'normal', marginBottom: '12px' }}
          >
            {siteContent.name}
          </motion.p>
          <div style={{ marginBottom: '48px' }}>
            {siteContent.roles.map((line, i) => (
              <motion.p
                key={line}
                {...fadeUp(0.1 + i * 0.07)}
                style={{ fontSize: 'clamp(14px, 2.2vw, 22px)', fontWeight: 300, lineHeight: '1.5', margin: 0 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.p
            {...fadeUp(0.3)}
            style={{ fontSize: 'clamp(13px, 1.6vw, 18px)', fontWeight: 300, lineHeight: '1.7', maxWidth: '560px' }}
          >
            {siteContent.bio}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
