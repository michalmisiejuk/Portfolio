import { createHashRouter } from 'react-router';
import { HeroPage } from './components/HeroPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectDetailPageV2 } from './components/ProjectDetailPageV2';
import { LinksPageV2 } from './components/LinksPageV2';

export const router = createHashRouter([
  { path: '/', Component: HeroPage, ErrorBoundary: HeroPage },
  { path: '/projects', Component: ProjectsPage },
  { path: '/projects/:slug', Component: ProjectDetailPageV2 },
  { path: '/about', Component: HeroPage },
  { path: '/links', Component: LinksPageV2 },
  { path: '*', Component: HeroPage },
]);
