import { Link, Navigate, useParams } from 'react-router';
import { getProjectBySlug } from '@/content/projects';
import { WipBanner } from './WipBanner';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />

      <div className="px-6 md:px-16 lg:px-28 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <Link to="/projects" className="text-black no-underline shrink-0" style={{ fontSize: '18px', lineHeight: 1 }}>
            ←
          </Link>
          <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>{project.title}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-[#e4e4e4] text-black" style={{ fontSize: '13px', fontWeight: 400, padding: '4px 10px' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-28 max-w-5xl mx-auto pb-24 flex flex-col gap-8">
        {project.heroImage ? (
          <img src={project.heroImage} alt={project.heroImageAlt ?? project.title} className="w-full h-auto bg-[#d9d9d9]" />
        ) : null}

        <div>
          <p style={{ fontSize: '16px', fontWeight: 300, lineHeight: '1.7', maxWidth: '640px' }}>{project.description}</p>
        </div>

        {project.projectLinks?.length ? (
          <div className="flex flex-wrap gap-3">
            {project.projectLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-black border border-black/15 px-3 py-2"
                style={{ fontSize: '13px', fontWeight: 400, lineHeight: 'normal' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}

        {project.sections.map((section, i) => {
          if (section.type === 'image') {
            return <img key={i} src={section.src} alt={section.alt} className="w-full h-auto bg-[#d9d9d9]" />;
          }

          return (
            <p key={i} style={{ fontSize: '16px', fontWeight: 300, lineHeight: '1.7', maxWidth: '640px' }}>
              {section.content}
            </p>
          );
        })}
      </div>
    </div>
  );
}
