import { motion } from 'motion/react';
import { linksContent } from '@/content/links';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';
import pageBg from '@/imports/image-9.png';

export function LinksPage() {
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

      <div className="px-6 pt-16 max-w-5xl mx-auto pb-24">
        <div className="h-16" />
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
              className="flex items-baseline justify-between gap-10 py-7 no-underline text-black border-b border-black/10 group"
            >
              <span
                style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 500, lineHeight: 'normal', transition: 'opacity 0.2s' }}
                className="group-hover:opacity-50"
              >
                {link.label}
              </span>
              <span
                style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 300, lineHeight: '1.45', textAlign: 'right', maxWidth: '260px', opacity: 0.5 }}
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
