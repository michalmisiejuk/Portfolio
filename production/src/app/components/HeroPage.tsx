import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import { siteContent } from '@/content/site';
import { Nav } from './Nav';
import { ScrollIndicator } from './ScrollIndicator';
import { WipBanner } from './WipBanner';

const MONO = "'JetBrains Mono', monospace";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45, ease: 'easeOut', delay },
});

function SectionLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'block',
        marginBottom: '24px',
        fontFamily: MONO,
        fontSize: '9px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.34)',
      }}
    >
      {children}
    </span>
  );
}

function SelectedWorkLink() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div whileHover={reduceMotion ? undefined : { x: 4 }} transition={{ duration: 0.18 }} style={{ display: 'inline-block' }}>
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 no-underline text-black"
        style={{ fontSize: '14px', fontWeight: 600, paddingBottom: '5px', borderBottom: '1px solid #111' }}
      >
        View selected work
        <motion.span
          aria-hidden
          animate={reduceMotion ? undefined : { x: [0, 3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex' }}
        >
          <ArrowRight size={15} strokeWidth={1.8} />
        </motion.span>
      </Link>
    </motion.div>
  );
}

export function HeroPage() {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif', color: '#111' }}>
      <WipBanner />
      <Nav />

      <main className="px-6 md:px-16 lg:px-28 max-w-5xl mx-auto pb-28">
        <section className="pt-16 md:pt-24 pb-20 md:pb-28">
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ marginBottom: '22px' }}>
            <span style={{ fontSize: 'clamp(30px, 3vw, 40px)', fontWeight: 650, lineHeight: 1.1 }}>{siteContent.name}</span>
            <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(0,0,0,0.5)' }}>Product Designer</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            style={{
              maxWidth: '760px',
              margin: 0,
              fontSize: 'clamp(22px, 2.2vw, 30px)',
              fontWeight: 500,
              lineHeight: 1.34,
            }}
          >
            {siteContent.headline}
          </motion.h1>

          <motion.div {...fadeUp(0.1)} className="flex flex-wrap gap-x-3 gap-y-2 mt-8" style={{ fontSize: '13px', color: 'rgba(0,0,0,0.58)' }}>
            {siteContent.experience.map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden style={{ color: 'rgba(0,0,0,0.22)' }}>/</span> : null}
                {item}
              </span>
            ))}
          </motion.div>

          <motion.p {...fadeUp(0.14)} style={{ maxWidth: '760px', margin: '16px 0 0', fontSize: '14px', lineHeight: 1.7, color: 'rgba(0,0,0,0.58)' }}>
            {siteContent.disciplines.join(' / ')}
          </motion.p>

          <motion.div {...fadeUp(0.18)} className="mt-9">
            <SelectedWorkLink />
          </motion.div>
        </section>

        <section className="border-t border-black/10 py-16 md:py-20">
          <SectionLabel>About</SectionLabel>
          <div className="max-w-3xl flex flex-col gap-5">
            {siteContent.introduction.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                {...fadeUp(index * 0.04)}
                style={{ margin: 0, fontSize: 'clamp(17px, 2.1vw, 22px)', fontWeight: 300, lineHeight: 1.62, color: 'rgba(0,0,0,0.76)' }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 py-16 md:py-20">
          <SectionLabel>What I Do</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {siteContent.capabilities.map((capability, index) => (
              <motion.div key={capability.title} {...fadeUp(index * 0.03)} className="border-t border-black/10 py-6">
                <h2 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 600, lineHeight: 1.35 }}>{capability.title}</h2>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(0,0,0,0.62)' }}>
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 py-16 md:py-20">
          <SectionLabel>Selected Experience</SectionLabel>
          <motion.p {...fadeUp(0)} style={{ maxWidth: '720px', margin: '0 0 42px', fontSize: '18px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(0,0,0,0.72)' }}>
            {siteContent.experienceIntro}
          </motion.p>

          <div>
            {siteContent.companies.map((company, index) => (
              <motion.div
                key={company.name}
                {...fadeUp(index * 0.03)}
                className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-8 border-t border-black/10 py-5"
              >
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{company.name}</h2>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(0,0,0,0.58)' }}>{company.scope}</p>
              </motion.div>
            ))}
          </div>

          <ol className="mt-12 p-0 list-none">
            {siteContent.highlights.map((highlight, index) => (
              <motion.li key={highlight} {...fadeUp(index * 0.03)} className="grid grid-cols-[32px_1fr] gap-4 py-4 border-t border-black/10">
                <span style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(0,0,0,0.3)', paddingTop: '4px' }}>{String(index + 1).padStart(2, '0')}</span>
                <span style={{ maxWidth: '700px', fontSize: '15px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(0,0,0,0.7)' }}>{highlight}</span>
              </motion.li>
            ))}
          </ol>
        </section>

        <section className="border-t border-black/10 py-16 md:py-20">
          <SectionLabel>How I Work</SectionLabel>
          <div className="max-w-3xl flex flex-col gap-5">
            {siteContent.approach.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                {...fadeUp(index * 0.04)}
                style={{ margin: 0, fontSize: index === 0 ? 'clamp(24px, 3vw, 34px)' : '16px', fontWeight: index === 0 ? 600 : 300, lineHeight: index === 0 ? 1.3 : 1.7, color: index === 0 ? '#111' : 'rgba(0,0,0,0.68)' }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 py-16 md:py-20">
          <SectionLabel>Skills & Tools</SectionLabel>
          <div>
            {siteContent.skills.map((skill, index) => (
              <motion.div key={skill.title} {...fadeUp(index * 0.03)} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-10 border-t border-black/10 py-5">
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{skill.title}</h2>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)' }}>{skill.items}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 pt-16 md:pt-20">
          <SectionLabel>Next</SectionLabel>
          <motion.p {...fadeUp(0)} style={{ maxWidth: '780px', margin: '0 0 30px', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 500, lineHeight: 1.35 }}>
            {siteContent.closing}
          </motion.p>
          <motion.div {...fadeUp(0.05)}>
            <SelectedWorkLink />
          </motion.div>
        </section>
      </main>

      <ScrollIndicator />
    </div>
  );
}
