import { motion } from 'motion/react';
import { linksContent } from '@/content/links';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';

export function LinksPage() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="px-6 pt-16 max-w-3xl mx-auto pb-24">
        <div className="mb-10">
          <p style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, lineHeight: 'normal', marginBottom: '10px' }}>
            {linksContent.title}
          </p>
        </div>
        <div className="flex flex-col">
          {linksContent.items.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.07 }}
              className="flex items-baseline justify-between gap-8 py-5 no-underline text-black border-b border-black/10 group"
            >
              <span
                style={{ fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 500, lineHeight: 'normal', transition: 'opacity 0.2s' }}
                className="group-hover:opacity-50"
              >
                {link.label}
              </span>
              <span
                style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.5', textAlign: 'right', maxWidth: '320px', opacity: 0.5 }}
              >
                {link.desc}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
