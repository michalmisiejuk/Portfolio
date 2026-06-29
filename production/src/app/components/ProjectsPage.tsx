import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { projectCategories, projectsContent, type ProjectCategory } from '@/content/projects';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';
import pageBg from '@/imports/image-9.png';

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projectsContent)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.06 }}
    >
      <Link to={`/projects/${project.slug}`} className="no-underline text-black block">
        <motion.div
          className="flex flex-col gap-3"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid transparent' }}
        >
          <div className="flex flex-row gap-4 items-start group">
            <div
              className="shrink-0 bg-[#d9d9d9] transition-transform duration-200 group-hover:scale-[1.02] overflow-hidden"
              style={{ width: '80px', height: '70px' }}
            >
              <img src={project.thumbnail} alt={project.thumbnailAlt} className="w-full h-full object-cover" />
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: 'normal', marginBottom: '4px' }}>{project.title}</p>
              <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: '1.5' }}>{project.summary}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-[#e4e4e4] text-black" style={{ fontSize: '13px', fontWeight: 400, lineHeight: 'normal', padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');

  const filteredProjects =
    activeCategory === 'All'
      ? projectsContent
      : projectsContent.filter((project) => project.category === activeCategory);

  return (
    <div
      className="min-h-screen relative"
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

      <div className="px-6 pt-20 max-w-4xl mx-auto pb-16 flex flex-col gap-16">
        <div className="flex w-full flex-wrap justify-center gap-x-14 gap-y-4">
          {projectCategories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                style={{
                  fontSize: 'clamp(14px, 1.7vw, 18px)',
                  lineHeight: 'normal',
                  fontWeight: isActive ? 700 : 400,
                  opacity: isActive ? 1 : 0.45,
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
