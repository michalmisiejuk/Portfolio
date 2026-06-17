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

      <div className="px-6 md:px-20 lg:px-36 pt-16 max-w-5xl mx-auto">
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

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <motion.img
            {...fadeUp(0.3)}
            src={siteContent.heroImage}
            alt={siteContent.name}
            className="shrink-0 bg-[#d9d9d9] w-full md:w-48 lg:w-60 object-cover"
            style={{ aspectRatio: '1 / 1' }}
          />
          <motion.p
            {...fadeUp(0.38)}
            style={{ fontSize: 'clamp(13px, 1.6vw, 18px)', fontWeight: 300, lineHeight: '1.7' }}
          >
            {siteContent.bio}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
