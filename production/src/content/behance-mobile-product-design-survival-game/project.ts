import image01 from './images/01.png';
import image02 from './images/02.png';
import image03 from './images/03.png';
import image04 from './images/04.png';
import image05 from './images/05.png';
import image06 from './images/06.png';
import image07 from './images/07.png';
import image08 from './images/08.png';
import decayCover from './images/Decay_cover.png';

export const mobileProductDesignSurvivalGameProject = {
  slug: 'mobile-product-design-survival-game',
  title: 'Mobile Product Design Survival Game',
  summary: 'Mobile survival game case study: UX, systemy, eksploracja i decyzje moralne.',
  description:
    'Decay to survival and management game na mobile. Case pokazuje projektowanie core loopa, ekonomii, eksploracji i interfejsu wspierajacego decyzje gracza.',
  tags: ['Mobile UX', 'Game UX', 'Product Design'],
  thumbnail: decayCover,
  thumbnailAlt: 'Okladka projektu Decay',
  heroImage: image01,
  heroImageAlt: 'Ekran eksploracji w projekcie Mobile Product Design Survival Game',
  heroAspectRatio: '1280 / 338',
  projectLinks: [
    {
      label: 'Business Analysis Plan',
      url: 'https://docs.google.com/document/d/1MJ7V4jpOxj-_vzXpU0pklFwasL8elmdxT1HwzeHDSOM/edit?usp=sharing',
    },
    {
      label: 'Case Study Documentation',
      url: 'https://docs.google.com/document/d/15zeO6TtC_wGXV7k0uzWpwYxEMyE6AIz7vtqR_7jQCoM/edit?usp=sharing',
    },
    {
      label: 'Behance',
      url: 'https://www.behance.net/gallery/233870289/Mobile-Product-Design-Survival-Game',
    },
  ],
  sections: [
    {
      type: 'text' as const,
      content: 'Zakres: business analysis, system design, UX/UI prototyping, walidacja core loopa i player testing.',
    },
    {
      type: 'text' as const,
      content: 'Rola: business analysis, gameplay system modeling, UX research i interactive UI design.',
    },
    {
      type: 'text' as const,
      content: 'Obszary pracy: market analysis, stakeholder mapping, use case design i iteracyjne planowanie MVP.',
    },
    {
      type: 'image' as const,
      src: image02,
      alt: 'Widok kolejnego ekranu gry survivalowej na mobile',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image03,
      alt: 'Interfejs survival game na mobile',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image04,
      alt: 'Ekran rozgrywki w projekcie Mobile Product Design Survival Game',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image05,
      alt: 'Widok walki lub eksploracji w projekcie Mobile Product Design Survival Game',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image06,
      alt: 'Kolejny ekran rozgrywki survivalowej na mobile',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image07,
      alt: 'Interfejs systemowy gry survivalowej na mobile',
      aspectRatio: '1280 / 338',
    },
    {
      type: 'image' as const,
      src: image08,
      alt: 'Mapa wypraw w projekcie Mobile Product Design Survival Game',
      aspectRatio: '1280 / 338',
    },
  ],
};
