import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { projectCategories, projectsContent, type ProjectCategory } from '@/content/projects';
import { Nav } from './Nav';
import { ScrollIndicator } from './ScrollIndicator';
import { WipBanner } from './WipBanner';

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projectsContent)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.06 }}
    >
      <Link to={`/projects/${project.slug}`} className="no-underline text-black block">
        <div
          className="flex flex-col gap-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: '12px',
            borderRadius: '6px',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            boxShadow: hovered ? '0 4px 8px -4px rgba(0,0,0,0.12)' : '0 0 0 rgba(0,0,0,0)',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          <div className="flex flex-row gap-4 items-start">
            <div className="shrink-0 relative" style={{ width: '120px', height: '100px', borderRadius: '3px' }}>
              <img src={project.thumbnail} alt={project.thumbnailAlt} className="w-full h-full object-cover" style={{ borderRadius: '3px' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '3px',
                  border: `1.5px solid ${hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.22)'}`,
                  transition: 'border-color 0.2s',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div style={{ maxWidth: '380px' }}>
              <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 'normal', marginBottom: '6px' }}>{project.title}</p>
              <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.5', opacity: 0.6 }}>{project.summary}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-black" style={{ fontSize: '11px', fontWeight: 400, padding: '3px 8px', borderRadius: '3px', background: 'rgba(0,0,0,0.055)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-transparent border-none cursor-pointer p-0 text-black"
      style={{
        fontSize: '14px',
        fontWeight: active ? 800 : 400,
        lineHeight: 'normal',
        fontFamily: 'Inter, sans-serif',
        transition: 'opacity 0.18s ease',
        opacity: active ? 1 : hovered ? 0.7 : 0.45,
      }}
    >
      {label}
    </button>
  );
}

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const visible =
    activeCategory === 'All'
      ? projectsContent
      : projectsContent.filter((project) => project.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="px-6 max-w-5xl mx-auto pb-2 flex flex-wrap justify-center gap-x-8 gap-y-2" style={{ paddingTop: '46px' }}>
        {projectCategories.map((category) => (
          <FilterButton key={category} label={category} active={activeCategory === category} onClick={() => setActiveCategory(category)} />
        ))}
      </div>

      <div className="flex flex-col mx-auto" style={{ width: '100%', maxWidth: '640px', padding: '24px 24px 64px', gap: '24px' }}>
        {visible.map((project, index) => (
          <ProjectCard key={`${activeCategory}-${project.slug}`} project={project} index={projectsContent.indexOf(project)} />
        ))}
      </div>

      <ScrollIndicator />
    </div>
  );
}
