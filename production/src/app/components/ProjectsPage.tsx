import { Link } from 'react-router';
import { projectsContent } from '@/content/projects';
import { Nav } from './Nav';
import { WipBanner } from './WipBanner';

export function ProjectsPage() {
  return (
    <div className="bg-white min-h-screen relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      <WipBanner />
      <Nav />

      <div className="px-6 md:px-16 lg:px-28 pt-4 max-w-5xl mx-auto pb-16 flex flex-col gap-10">
        {projectsContent.map((project) => (
          <div key={project.slug} className="flex flex-col gap-3">
            <div className="flex flex-row gap-4 items-start">
              <Link to={`/projects/${project.slug}`} className="shrink-0 bg-[#d9d9d9] block overflow-hidden" style={{ width: '80px', height: '70px' }}>
                <img src={project.thumbnail} alt={project.thumbnailAlt} className="w-full h-full object-cover" />
              </Link>
              <div>
                <Link to={`/projects/${project.slug}`} className="no-underline text-black">
                  <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: 'normal', marginBottom: '4px' }}>{project.title}</p>
                </Link>
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
          </div>
        ))}
      </div>
    </div>
  );
}
