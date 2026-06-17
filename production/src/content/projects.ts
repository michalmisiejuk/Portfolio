export type ProjectSection =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      aspectRatio: string;
    };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  thumbnail: string;
  thumbnailAlt: string;
  heroImage: string;
  heroImageAlt: string;
  sections: ProjectSection[];
};

export const projectsContent: Project[] = [
  {
    slug: 'product-strategy-workshop',
    title: 'Product Strategy Workshop',
    summary: 'Warsztaty i synteza priorytetow dla zespolu rozwijajacego nowy produkt cyfrowy.',
    description: 'Projekt obejmowal uporzadkowanie potrzeb interesariuszy, zmapowanie ryzyk i ulozenie planu kolejnych iteracji produktu.',
    tags: ['Product', 'Strategy', 'Workshop'],
    thumbnail: '/images/projects/product-strategy/thumb.svg',
    thumbnailAlt: 'Miniatura projektu Product Strategy Workshop',
    heroImage: '/images/projects/product-strategy/hero.svg',
    heroImageAlt: 'Hero projektu Product Strategy Workshop',
    sections: [
      { type: 'text', content: 'Efektem byla wspolna rama decyzyjna dla zespolu i prostszy proces ustalania zakresu kolejnych sprintow.' },
      { type: 'image', src: '/images/projects/product-strategy/board.svg', alt: 'Schemat warsztatowy', aspectRatio: '16 / 9' },
      { type: 'text', content: 'Najwieksza wartosc dala redukcja chaosu komunikacyjnego pomiedzy biznesem, designem i developmentem.' },
    ],
  },
  {
    slug: 'game-onboarding-flow',
    title: 'Game Onboarding Flow',
    summary: 'Przebudowa pierwszych minut gry pod retencje i czytelnosc zasad.',
    description: 'Zakres obejmowal diagnoze odplywu graczy, nowy onboarding oraz porzadkowanie sygnalow UX w kluczowych momentach wejscia.',
    tags: ['Game UX', 'Onboarding', 'Research'],
    thumbnail: '/images/projects/game-onboarding/thumb.svg',
    thumbnailAlt: 'Miniatura projektu Game Onboarding Flow',
    heroImage: '/images/projects/game-onboarding/hero.svg',
    heroImageAlt: 'Hero projektu Game Onboarding Flow',
    sections: [
      { type: 'image', src: '/images/projects/game-onboarding/flow.svg', alt: 'Schemat nowego flow', aspectRatio: '16 / 9' },
      { type: 'text', content: 'Zmiana polegala na uproszczeniu sekwencji startowej i wyrazniejszym prowadzeniu gracza przez pierwsze sukcesy.' },
      { type: 'image', src: '/images/projects/game-onboarding/detail.svg', alt: 'Widok ekranu onboardingowego', aspectRatio: '4 / 3' },
    ],
  },
  {
    slug: 'analytics-dashboard-redesign',
    title: 'Analytics Dashboard Redesign',
    summary: 'Redesign dashboardu dla szybszego odczytu KPI i lepszego priorytetyzowania dzialan.',
    description: 'Projekt laczyl research potrzeb uzytkownikow, porzadkowanie informacji i przygotowanie struktury pod dalszy rozwoj produktu.',
    tags: ['UX', 'Dashboard', 'B2B'],
    thumbnail: '/images/projects/analytics-dashboard/thumb.svg',
    thumbnailAlt: 'Miniatura projektu Analytics Dashboard Redesign',
    heroImage: '/images/projects/analytics-dashboard/hero.svg',
    heroImageAlt: 'Hero projektu Analytics Dashboard Redesign',
    sections: [
      { type: 'text', content: 'Glowne decyzje dotyczyly hierarchii informacji, ograniczenia szumu i lepszego eksponowania danych wymagajacych reakcji.' },
      { type: 'image', src: '/images/projects/analytics-dashboard/layout.svg', alt: 'Makieta dashboardu', aspectRatio: '16 / 9' },
      { type: 'text', content: 'Docelowo dashboard mial pomagac w decyzjach operacyjnych, a nie tylko prezentowac dane.' },
    ],
  },
];

export function getProjectBySlug(slug?: string) {
  return projectsContent.find((project) => project.slug === slug);
}
