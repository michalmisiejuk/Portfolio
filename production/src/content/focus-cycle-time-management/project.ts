import cover from './cover.svg';

export const focusCycleTimeManagementProject = {
  slug: 'focus-cycle-time-management',
  title: 'Focus Cycle: Personal Time Management App',
  category: 'Product Design',
  summary:
    'A focused workspace for planning tasks, running Pomodoro sessions and building a more deliberate relationship with time.',
  description:
    'Focus Cycle turns time management into a lightweight operating rhythm: choose the next task, start a focused session and review how time was actually spent.',
  tags: ['Product Design', 'Time Management', 'Web App'],
  thumbnail: cover,
  thumbnailAlt: 'Focus Cycle personal time management app',
  heroImage: cover,
  heroImageAlt: 'Focus Cycle focus timer dashboard',
  heroAspectRatio: '3 / 2',
  projectLinks: [
    {
      label: 'Open interactive app',
      url: '/Portfolio/demos/focus-cycle/',
    },
  ],
  sections: [
    {
      type: 'text' as const,
      content: 'A personal time management tool built around focused work sessions, task planning and lightweight progress tracking.',
    },
  ],
};
