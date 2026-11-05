import image04 from './images/04.jpg';

export const kleksAcademyReleasedProductDemoProject = {
  slug: 'kleks-academy-released-product-demo',
  title: 'Kleks Academy - Released Product (Demo)',
  category: 'Product Design',
  summary:
    'Product discovery dla wczesnego etapu rozwoju gry Kleks Academy: od wizji kreatywnej i celow biznesowych do wspolnego zakresu produktu.',
  description:
    'Projekt przekladal wizje kreatywna i cele biznesowe na czytelny zakres produktu, uporzadkowane wymagania i wspolne rozumienie kierunku rozwoju.',
  tags: ['Product Discovery', 'Game UX', 'Business Analysis'],
  thumbnail: image04,
  thumbnailAlt: 'Okladka projektu Kleks Academy',
  projectLinks: [
    {
      label: 'Steam Product Page',
      url: 'https://store.steampowered.com/app/3179870/Akademia_Pana_Kleksa/',
    },
  ],
  sections: [
    {
      type: 'text' as const,
      content: 'Kluczowa praca obejmowala zebranie i konsolidacje stakeholder requirements, aby zespoly kreatywne i produktowe pracowaly na wspolnym rozumieniu zakresu.',
    },
  ],
};
