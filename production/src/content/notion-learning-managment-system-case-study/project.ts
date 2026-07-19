import image02 from './images/02.png';
import slide01 from './images/01-context-problem-v3.png';
import slide02 from './images/02-business-case-hybrid-direction.png';
import slide03 from './images/03-as-is-to-to-be.png';
import slide04 from './images/04-core-use-cases.png';
import slide05 from './images/05-mvp-scope.png';
import slide06 from './images/06-solution-concept.png';
import slide07 from './images/07-key-learner-flow.png';
import slide08 from './images/08-low-fi-screens.png';
import slide09 from './images/09-outcome.png';

export const learningManagementSystemCaseStudyProject = {
  slug: 'learning-management-system-case-study',
  title: 'LMS for Gloria Training Company - Case Study',
  category: 'Business Analysis',
  summary: 'Case study analizy biznesowej LMS dla firmy szkoleniowej Gloria, rozwinięty z projektu kursowego LABA.',
  description:
    'Projekt pokazuje, jak analiza biznesowa dla firmy szkoleniowej Gloria została przełożona na spójny koncept LMS: od diagnozy problemów operacyjnych, przez model docelowy i zakres MVP, po pierwsze artefakty UX. Case study powstało na bazie pracy rozpoczętej podczas kursu LABA Analiza Biznesowa prowadzonego przez Magdalenę Straś.',
  tags: ['Business Analysis', 'LMS', 'Product Design'],
  thumbnail: image02,
  thumbnailAlt: 'Ilustracja Learning Management System case study',
  projectLinks: [
    {
      label: 'Case Study Documentation',
      url: 'https://docs.google.com/document/d/1yZKA9m3UxxT4IYslVLQsFBzLTBvoIj95by8kfbIhqsM/edit?usp=sharing',
    },
  ],
  sections: [
    {
      type: 'text' as const,
      content:
        'Gloria prowadzi kursy online i hybrydowe, a wraz ze wzrostem skali jej operacje zaczęły opierać się na rozproszonym zestawie narzędzi: Google Drive, Microsoft Teams i Excelu. To utrudniało koordynację, raportowanie i utrzymanie jednego spójnego przebiegu kursu.',
    },
    {
      type: 'text' as const,
      content:
        'Projekt został rozpoczęty w ramach kursu LABA Analiza Biznesowa prowadzonego przez Magdalenę Straś, a następnie rozwinięty do pełniejszego case study. Celem było uporządkowanie decyzji biznesowych i przełożenie ich na kierunek produktowy oraz pierwsze materiały projektowe.',
    },
    {
      type: 'image' as const,
      src: slide01,
      alt: 'Gloria LMS context problem slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide02,
      alt: 'Gloria LMS business case hybrid direction slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide03,
      alt: 'Gloria LMS as-is to to-be slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide04,
      alt: 'Gloria LMS core use cases slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide05,
      alt: 'Gloria LMS MVP scope slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide06,
      alt: 'Gloria LMS solution concept slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide07,
      alt: 'Gloria LMS key learner flow slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide08,
      alt: 'Gloria LMS low-fi screens slide',
      aspectRatio: '16 / 9',
    },
    {
      type: 'image' as const,
      src: slide09,
      alt: 'Gloria LMS outcome slide',
      aspectRatio: '16 / 9',
    },
  ],
};
