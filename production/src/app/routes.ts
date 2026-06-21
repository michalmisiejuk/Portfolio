import { createHashRouter } from 'react-router';
import { HeroPage } from './components/HeroPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { LinksPage } from './components/LinksPage';

export const router = createHashRouter([
  { path: '/', Component: HeroPage, ErrorBoundary: HeroPage },
  { path: '/projects', Component: ProjectsPage },
  { path: '/projects/:slug', Component: ProjectDetailPage },
  { path: '/about', Component: HeroPage },
  { path: '/links', Component: LinksPage },
  { path: '*', Component: HeroPage },
]);
