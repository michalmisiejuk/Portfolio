import { siteContent } from '@/content/site';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';

export function HeroPage() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="px-6 md:px-16 lg:px-28 pt-4 max-w-5xl mx-auto">
        <p style={{ fontSize: 'clamp(32px, 7vw, 64px)', fontWeight: 700, lineHeight: 'normal', marginBottom: '16px' }}>
          {siteContent.name}
        </p>
        <div style={{ marginBottom: '32px' }}>
          {siteContent.roles.map((line) => (
            <p key={line} style={{ fontSize: 'clamp(16px, 3vw, 28px)', fontWeight: 300, lineHeight: '1.4', margin: 0 }}>
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={siteContent.heroImage}
            alt={siteContent.name}
            className="shrink-0 bg-[#d9d9d9] w-full md:w-64 lg:w-80 object-cover"
            style={{ aspectRatio: '1 / 1' }}
          />
          <p style={{ fontSize: 'clamp(14px, 2vw, 24px)', fontWeight: 300, lineHeight: '1.5' }}>
            {siteContent.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
