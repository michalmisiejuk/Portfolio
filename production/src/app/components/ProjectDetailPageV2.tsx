import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { getProjectBySlug, type Project } from '@/content/projects';
import { ACCENT, FinalVisual, HeroVisual, ProcessVisual } from './ProjectVisuals';
import { ScrollIndicator } from './ScrollIndicator';
import { WipBanner } from './WipBanner';

const MONO = "'JetBrains Mono', monospace";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: 'easeOut', delay },
});

type LightboxImage = { node: ReactNode; label: string; lightboxNode?: ReactNode };
type DocResource = { kind: 'doc'; name: string; label: string; fmt: string; size: string; href: string };
type LinkResource = { kind: 'link'; name: string; desc: string; href: string };
type Resource = DocResource | LinkResource;
type ImageSection = Extract<Project['sections'][number], { type: 'image' }>;
type ProcessStep = { label: string; text: string; visual?: ImageSection };

function arrowStyle(side: 'left' | 'right', disabled: boolean): CSSProperties {
  return {
    position: 'absolute',
    [side]: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    color: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
    fontSize: '22px',
    lineHeight: 1,
    padding: '12px',
  };
}

function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const current = images[index];

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNav(1);
      if (event.key === 'ArrowLeft') onNav(-1);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 48) onNav(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', pointerEvents: 'none' }}>
        <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          {current.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'auto' }}>
          <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)' }}>
            {index + 1} / {images.length}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '20px', lineHeight: 1, padding: '4px' }} aria-label="Close">
            x
          </button>
        </div>
      </div>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '78vh', width: '100%', overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {current.lightboxNode ?? current.node}
      </motion.div>

      {images.length > 1 ? (
        <>
          <button onClick={(event) => { event.stopPropagation(); onNav(-1); }} disabled={index === 0} style={arrowStyle('left', index === 0)} aria-label="Previous">
            {'<'}
          </button>
          <button onClick={(event) => { event.stopPropagation(); onNav(1); }} disabled={index === images.length - 1} style={arrowStyle('right', index === images.length - 1)} aria-label="Next">
            {'>'}
          </button>
        </>
      ) : null}
    </motion.div>
  );
}

function GalleryImage({
  children,
  galleryIndex,
  onOpen,
  style,
}: {
  children: ReactNode;
  galleryIndex: number;
  onOpen: (index: number) => void;
  style?: CSSProperties;
}) {
  return (
    <div onClick={() => onOpen(galleryIndex)} style={{ cursor: 'zoom-in', ...style }} title="Click to enlarge">
      {children}
    </div>
  );
}

function ImageNode({ src, alt, aspectRatio, fit = 'contain' }: { src: string; alt: string; aspectRatio?: string; fit?: 'cover' | 'contain' }) {
  return <img src={src} alt={alt} style={{ width: '100%', height: '100%', maxHeight: '78vh', objectFit: fit, aspectRatio, display: 'block', background: fit === 'contain' ? 'transparent' : '#d9d9d9' }} />;
}

function getTextSections(project: Project) {
  return project.sections.filter((section) => section.type === 'text');
}

function getImageSections(project: Project) {
  return project.sections.filter((section) => section.type === 'image');
}

function cleanPrefix(text: string) {
  return text.replace(/^(Rola|Zakres|Obszary pracy):\s*/i, '');
}

function processLabel(text: string, index: number) {
  if (/^Rola:/i.test(text)) return 'Role';
  if (/^Zakres:/i.test(text)) return 'Scope';
  if (/^Obszary pracy:/i.test(text)) return 'Work Areas';
  return ['Discovery', 'Definition', 'Design'][index] ?? `Step ${index + 1}`;
}

function DownloadIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M5.5 1v6M2.5 5l3 3 3-3" stroke={ACCENT} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 9.5h9" stroke={ACCENT} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M4 2H2a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M6 1h3v3M9 1L5.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function linkDescription(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'External reference';
  }
}

function buildResources(project: Project): Resource[] {
  return (project.projectLinks ?? []).map((link) => {
    const isDoc = /docs\.google|document|documentation|case study|plan/i.test(`${link.url} ${link.label}`);
    if (isDoc) {
      return {
        kind: 'doc',
        name: link.label,
        label: /plan/i.test(link.label) ? 'Plan' : 'Documentation',
        fmt: /docs\.google/i.test(link.url) ? 'DOC' : 'URL',
        size: 'WEB',
        href: link.url,
      };
    }

    return {
      kind: 'link',
      name: link.label,
      desc: linkDescription(link.url),
      href: link.url,
    };
  });
}

function ResourceRow({ item }: { item: Resource }) {
  const [hovered, setHovered] = useState(false);
  const isDoc = item.kind === 'doc';

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '14px 1fr auto',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 6px',
        marginLeft: '-6px',
        marginRight: '-6px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '2px',
        textDecoration: 'none',
        color: 'inherit',
        background: hovered ? 'rgba(0,87,255,0.03)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ color: hovered ? ACCENT : 'rgba(0,0,0,0.3)', transition: 'color 0.12s' }}>
        {isDoc ? <DownloadIcon /> : <ExternalIcon />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', minWidth: 0 }}>
        <span style={{ fontSize: '12.5px', fontWeight: 400, color: hovered ? ACCENT : '#111', transition: 'color 0.12s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </span>
        {isDoc ? (
          <span style={{ fontFamily: MONO, fontSize: '7.5px', letterSpacing: '0.07em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', flexShrink: 0 }}>
            {(item as DocResource).label}
          </span>
        ) : (
          <span style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(0,0,0,0.38)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {(item as LinkResource).desc}
          </span>
        )}
      </div>
      {isDoc ? (
        <span style={{ fontFamily: MONO, fontSize: '8px', color: 'rgba(0,0,0,0.28)', letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {(item as DocResource).fmt} / {(item as DocResource).size}
        </span>
      ) : (
        <span style={{ color: hovered ? ACCENT : 'rgba(0,0,0,0.28)', transition: 'color 0.12s', flexShrink: 0 }}>
          <ExternalIcon />
        </span>
      )}
    </a>
  );
}

function ProjectResources({ resources, centered = false }: { resources: Resource[]; centered?: boolean }) {
  if (!resources.length) return null;

  return (
    <div className="flex flex-col gap-2 mb-10" style={{ alignItems: centered ? 'center' : 'flex-start' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.52)' }}>
        Resources
      </span>
      <div className="flex flex-wrap gap-2" style={{ justifyContent: centered ? 'center' : 'flex-start' }}>
        {resources.map((resource) => (
          <motion.a
            key={resource.href}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center gap-1.5"
            whileHover={{ y: -1, backgroundColor: 'rgba(0,0,0,0.045)', borderColor: 'rgba(0,0,0,0.46)' }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(0,0,0,0.78)',
              padding: '6px 11px',
              border: '1px solid rgba(0,0,0,0.28)',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
            }}
          >
            {resource.kind === 'doc' ? (
              /case|study|pdf/i.test(resource.name) ? <FileText size={14} strokeWidth={1.8} /> : <Download size={14} strokeWidth={1.8} />
            ) : (
              <ArrowUpRight size={14} strokeWidth={1.8} />
            )}
            {resource.name}
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailPageV2() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const textSections = getTextSections(project);
  const imageSections = getImageSections(project);
  const isGloria = project.slug === 'learning-management-system-case-study';
  const resources = buildResources(project);
  const processSource = textSections.length ? textSections : [{ type: 'text' as const, content: project.description }];
  const processSteps: ProcessStep[] = isGloria
    ? [
        {
          label: 'Decision',
          text: 'The analysis compared viable directions and selected a hybrid LMS model that fit Gloria operations, risk and time-to-value.',
          visual: imageSections[1],
        },
        {
          label: 'Transformation',
          text: 'The target model translated fragmented tools into one structured course lifecycle with clearer ownership and reporting.',
          visual: imageSections[2],
        },
      ].filter((step) => step.visual)
    : processSource.slice(0, 3).map((section, index) => ({
        label: processLabel(section.content, index),
        text: cleanPrefix(section.content),
      }));
  const outcomeText = isGloria
    ? 'The case study connected business analysis, product strategy and UX translation into one coherent product concept.'
    : textSections.find((section) => !/^Rola:|^Zakres:|^Obszary pracy:/i.test(section.content))?.content ?? project.description;
  const overview = isGloria
    ? ([
        ['Context', textSections[0]?.content ?? project.summary],
        ['Objective', textSections[1]?.content ?? project.description],
        ['Direction', 'Define a coherent LMS product direction: hybrid, structured around the full course lifecycle and realistic for Gloria operations.'],
      ] as const)
    : ([
        ['Challenge', project.summary],
        ['Approach', project.description],
        ['Outcome', cleanPrefix(outcomeText)],
      ] as const);
  const heroSection = isGloria ? imageSections[0] : undefined;
  const heroSrc = heroSection?.src ?? project.heroImage ?? project.thumbnail;
  const heroAlt = heroSection?.alt ?? project.heroImageAlt ?? project.thumbnailAlt ?? project.title;
  const heroAspectRatio = heroSection?.aspectRatio ?? '2/1';
  const heroNode = heroSrc ? <ImageNode src={heroSrc} alt={heroAlt} /> : <HeroVisual title={project.title} domain={project.category} dark={project.category === 'Game UX'} />;
  const heroLightboxNode = heroSrc ? <ImageNode src={heroSrc} alt={heroAlt} fit="contain" /> : heroNode;
  const resultImage = imageSections.at(-1);
  const resultNode = resultImage ? <ImageNode src={resultImage.src} alt={resultImage.alt} /> : <FinalVisual domain={project.category} />;
  const resultLightboxNode = resultImage ? <ImageNode src={resultImage.src} alt={resultImage.alt} fit="contain" /> : resultNode;
  const artefactSections = isGloria ? imageSections.slice(3, -1) : imageSections.slice(0, -1);
  const standardGallery: LightboxImage[] = [
    { node: heroNode, lightboxNode: heroLightboxNode, label: isGloria ? '01 Context / Gloria LMS' : `Hero / ${project.title}` },
    ...processSteps.map((step, index) => ({
      node: step.visual ? <ImageNode src={step.visual.src} alt={step.visual.alt} aspectRatio={step.visual.aspectRatio} /> : <ProcessVisual stepIndex={index} label={step.label} />,
      lightboxNode: step.visual ? <ImageNode src={step.visual.src} alt={step.visual.alt} aspectRatio={step.visual.aspectRatio} fit="contain" /> : undefined,
      label: `${String(index + 2).padStart(2, '0')} ${step.label} / ${project.title}`,
    })),
    ...artefactSections.map((section, index) => ({
      node: <ImageNode src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} />,
      lightboxNode: <ImageNode src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} fit="contain" />,
      label: `${String(index + processSteps.length + 2).padStart(2, '0')} Artefact / ${project.title}`,
    })),
    { node: resultNode, lightboxNode: resultLightboxNode, label: isGloria ? '09 Outcome / Gloria LMS' : `Result / ${project.category}` },
  ];
  const narrativeGallery: LightboxImage[] = imageSections.map((section, index) => ({
    node: <ImageNode src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} />,
    lightboxNode: <ImageNode src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} fit="contain" />,
    label: `${String(index + 1).padStart(2, '0')} / ${section.alt}`,
  }));
  const gallery = isGloria ? narrativeGallery : standardGallery;
  const galleryIndexBySrc = new Map(imageSections.map((section, index) => [section.src, index]));
  const artefactsStartIndex = 1 + processSteps.length;
  const resultGalleryIndex = gallery.length - 1;

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navLightbox = useCallback((dir: 1 | -1) => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0 || next >= gallery.length) return prev;
      return next;
    });
  }, [gallery.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const imgStyle = (aspectRatio: string): CSSProperties => ({
    borderRadius: '2px',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.12)',
    aspectRatio,
    width: '100%',
  });

  return (
    <div className="min-h-screen" style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />

      <div className="px-6 md:px-16 lg:px-28 pt-8 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-2">
          <Link to="/projects" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.01em', textDecoration: 'none' }}>
            {'<'} Projects
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.06)} style={{ textAlign: isGloria ? 'center' : 'left' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, lineHeight: 'normal', margin: '0 0 16px 0', color: '#111' }}>
            {project.title}
          </h1>
        </motion.div>

        <motion.div {...fadeUp(0.09)} className="flex flex-wrap gap-2 mb-4" style={{ justifyContent: isGloria ? 'center' : 'flex-start' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{ fontSize: '11px', fontWeight: 400, padding: '3px 8px', borderRadius: '3px', background: 'rgba(0,0,0,0.055)', lineHeight: 'normal' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.p {...fadeUp(0.1)} style={{ fontSize: '14px', fontWeight: 300, lineHeight: '1.65', maxWidth: '620px', margin: isGloria ? '0 auto 16px' : '0 0 12px 0', opacity: 0.72, textAlign: isGloria ? 'center' : 'left' }}>
          {project.summary}
        </motion.p>

        {resources.length ? (
          <motion.div {...fadeUp(0.16)}>
            <ProjectResources resources={resources} centered={isGloria} />
          </motion.div>
        ) : null}
      </div>

      <div className="px-6 md:px-16 lg:px-28 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: '40px' }}>
          <GalleryImage galleryIndex={0} onOpen={openLightbox} style={imgStyle(heroAspectRatio)}>
            {heroNode}
          </GalleryImage>
        </motion.div>
      </div>

      {isGloria ? (
        <div className="px-6 md:px-16 lg:px-28 max-w-5xl mx-auto pb-24 flex flex-col" style={{ gap: 'clamp(44px, 7vw, 76px)' }}>
          {project.sections.slice(1).map((section, index) => {
            if (section.type === 'heading') {
              return (
                <motion.div key={`${section.content}-${index}`} {...fadeUp(0)} style={{ textAlign: 'center', paddingTop: 'clamp(12px, 2vw, 28px)' }}>
                  {section.eyebrow ? (
                    <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: '14px' }}>
                      {section.eyebrow}
                    </span>
                  ) : null}
                  <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 650, lineHeight: 1.25, margin: 0, color: '#111' }}>
                    {section.content}
                  </h2>
                </motion.div>
              );
            }

            if (section.type === 'text') {
              const isTransition = section.variant === 'transition';
              return (
                <motion.p
                  key={`${section.content}-${index}`}
                  {...fadeUp(0)}
                  style={{
                    fontSize: isTransition ? 'clamp(18px, 2.2vw, 24px)' : '16px',
                    fontWeight: isTransition ? 500 : 300,
                    lineHeight: isTransition ? 1.45 : 1.75,
                    color: isTransition ? '#111' : 'rgba(0,0,0,0.68)',
                    textAlign: 'center',
                    maxWidth: isTransition ? '720px' : '660px',
                    margin: isTransition ? 'clamp(6px, 2vw, 20px) auto' : '-42px auto 0',
                  }}
                >
                  {section.content}
                </motion.p>
              );
            }

            const galleryIndex = galleryIndexBySrc.get(section.src);
            if (galleryIndex === undefined) return null;

            return (
              <motion.div key={`${section.src}-${index}`} {...fadeUp(0)}>
                <GalleryImage galleryIndex={galleryIndex} onOpen={openLightbox} style={imgStyle(section.aspectRatio)}>
                  <ImageNode src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} />
                </GalleryImage>
              </motion.div>
            );
          })}
        </div>
      ) : (
      <div className="px-6 md:px-16 lg:px-28 max-w-5xl mx-auto pb-24 flex flex-col gap-10">
        <motion.div {...fadeUp(0)}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.28, display: 'block', marginBottom: '18px' }}>Overview</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {overview.map(([label, text]) => (
              <div key={label}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#111', display: 'block', marginBottom: '8px' }}>{label}</span>
                <p style={{ fontSize: '12.5px', fontWeight: 300, lineHeight: '1.7', color: 'rgba(0,0,0,0.65)', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {processSteps.length ? (
          <motion.div {...fadeUp(0)}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.28, display: 'block', marginBottom: '18px' }}>{isGloria ? 'Case Flow' : 'Process'}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {processSteps.map((step, index) => (
                <motion.div key={step.label} {...fadeUp(index * 0.05)} className="flex gap-8 items-start" style={{ flexWrap: 'wrap' }}>
                  <GalleryImage galleryIndex={index + 1} onOpen={openLightbox} style={{ ...imgStyle(step.visual?.aspectRatio ?? '4/3'), width: 'clamp(180px, 32%, 260px)', flexShrink: 0 }}>
                    {step.visual ? <ImageNode src={step.visual.src} alt={step.visual.alt} /> : <ProcessVisual stepIndex={index} label={step.label} />}
                  </GalleryImage>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.35)' }}>{String(index + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: '15px', fontWeight: 400, color: '#111' }}>{step.label}</span>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: '1.75', color: 'rgba(0,0,0,0.68)', margin: 0 }}>{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {artefactSections.length ? (
          <motion.div {...fadeUp(0)}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.28, display: 'block', marginBottom: '18px' }}>{isGloria ? 'Supporting Artefacts' : 'Artefacts'}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {artefactSections.map((section, index) => (
                <GalleryImage key={`${section.alt}-${index}`} galleryIndex={artefactsStartIndex + index} onOpen={openLightbox} style={imgStyle(section.aspectRatio ?? '16/9')}>
                  <ImageNode src={section.src} alt={section.alt} />
                </GalleryImage>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.div {...fadeUp(0)}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.28, display: 'block', marginBottom: '18px' }}>Result</span>
          <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: '1.75', color: 'rgba(0,0,0,0.7)', margin: '0 0 24px', maxWidth: '600px' }}>
            {cleanPrefix(outcomeText)}
          </p>
          <GalleryImage galleryIndex={resultGalleryIndex} onOpen={openLightbox} style={imgStyle(resultImage?.aspectRatio ?? '16/9')}>
            {resultNode}
          </GalleryImage>
        </motion.div>

      </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null ? <Lightbox images={gallery} index={lightboxIndex} onClose={closeLightbox} onNav={navLightbox} /> : null}
      </AnimatePresence>
      <ScrollIndicator enabled={lightboxIndex === null} />
    </div>
  );
}
