import { motion } from 'motion/react';
import { linksContent } from '@/content/links';
import { Nav } from './Nav';
import { ScrollIndicator } from './ScrollIndicator';
import { WipBanner } from './WipBanner';

export function LinksPageV2() {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="pt-16 pb-24 mx-auto" style={{ width: '100%', maxWidth: '480px', padding: '94px 24px' }}>
        <div className="flex flex-col">
          {linksContent.items.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
              className="flex items-baseline justify-between gap-8 py-4 no-underline text-black group"
              style={{ textDecoration: 'none' }}
            >
              <span style={{ fontSize: '15px', fontWeight: 500, lineHeight: 'normal', transition: 'opacity 0.2s' }} className="group-hover:opacity-50">
                {link.label}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.5', textAlign: 'right', maxWidth: '320px', opacity: 0.5 }}>
                {link.desc}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
      <ScrollIndicator />
    </div>
  );
}
