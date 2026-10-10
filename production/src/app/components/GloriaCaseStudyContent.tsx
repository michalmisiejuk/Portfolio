import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const modules = import.meta.glob(
  '../../content/notion-learning-managment-system-case-study/images/case-study-v2/**/*.{png,jpg}',
  { eager: true, import: 'default' },
) as Record<string, string>;

const base = '../../content/notion-learning-managment-system-case-study/images/case-study-v2/';
const asset = (path: string) => modules[`${base}${path}`];
const prototypeUrl = '/Portfolio/demos/gloria-lms/';
const stages = [
  ['gloria-context', 'Kontekst'], ['gloria-diagnosis', 'Diagnoza'], ['gloria-requirements', 'Wymagania'],
  ['gloria-target', 'Model docelowy'], ['gloria-product', 'Struktura'], ['gloria-mvp', 'MVP'],
  ['gloria-ux', 'UX'], ['gloria-prototype', 'Prototyp'],
] as const;

function Figure({ src, alt, variant = 'default' }: { src: string; alt: string; variant?: 'default' | 'artifact' | 'portrait' }) {
  return (
    <figure className={`gloria-figure gloria-${variant}`}>
      <img src={asset(src)} alt={alt} loading="lazy" />
      <figcaption>{alt}</figcaption>
    </figure>
  );
}

function Explanation({ title, children }: { title: string; children: string }) {
  return (
    <div className="gloria-explanation">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function SectionTitle({ number, label, children, description }: { number: string; label: string; children: string; description: string }) {
  return (
    <div className="gloria-section-heading">
      <span>{number} / {label}</span>
      <h2>{children}</h2>
      <p>{description}</p>
    </div>
  );
}

export function GloriaCaseStudyContent() {
  const [activeStage, setActiveStage] = useState(stages[0][0]);
  const [railLeft, setRailLeft] = useState(0);

  useEffect(() => {
    const updateRailPosition = () => {
      const anchor = document.querySelector<HTMLElement>('[data-scroll-anchor]');
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const paddingLeft = Number.parseFloat(window.getComputedStyle(anchor).paddingLeft) || 0;
      setRailLeft(Math.max(0, Math.round(rect.left + paddingLeft - 32)));
    };

    updateRailPosition();
    const frame = window.requestAnimationFrame(updateRailPosition);
    window.addEventListener('resize', updateRailPosition, { passive: true });
    const observer = new ResizeObserver(updateRailPosition);
    observer.observe(document.documentElement);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateRailPosition);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStage(visible.target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, .1, .4] },
    );
    stages.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="gloria-case-study px-6 md:px-16 lg:px-28 max-w-5xl mx-auto">
      <style>{`
        .gloria-case-study { width: 100%; box-sizing: border-box; padding-top: 24px; padding-bottom: 120px; color: #111; }
        .gloria-case-study section { margin: 0 0 104px; padding-top: 48px; border-top: 1px solid rgba(0,0,0,.1); }
        .gloria-case-study section:first-of-type { padding-top: 16px; border-top: 0; }
        .gloria-section-heading { margin: 0 0 40px; max-width: 760px; }
        .gloria-section-heading > span { display: block; margin-bottom: 14px; color: #0057ff; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .11em; text-transform: uppercase; }
        .gloria-section-heading h2 { margin: 0 0 12px; color: #111; font-size: clamp(28px, 4vw, 42px); font-weight: 650; line-height: 1.08; letter-spacing: -.035em; }
        .gloria-section-heading p { margin: 0; max-width: 680px; color: rgba(0,0,0,.58); font-size: 15px; font-weight: 300; line-height: 1.7; }
        .gloria-figure { margin: 0 0 32px; overflow: hidden; border: 1px solid rgba(0,0,0,.12); border-radius: 3px; background: #f7f8fa; box-shadow: 0 12px 32px rgba(0,0,0,.035); }
        .gloria-figure img { display: block; width: 100%; height: auto; background: #fff; }
        .gloria-figure figcaption { padding: 10px 14px; border-top: 1px solid rgba(0,0,0,.08); color: rgba(0,0,0,.46); background: #fafafa; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .035em; text-transform: uppercase; }
        .gloria-artifact { width: 100%; }
        .gloria-portrait { width: min(760px, 100%); margin-left: auto; margin-right: auto; }
        .gloria-explanation { display: grid; grid-template-columns: minmax(190px, .7fr) 1.6fr; gap: 28px; margin: -12px 0 48px; padding: 24px 26px; border-left: 3px solid #0057ff; background: #f5f7fa; }
        .gloria-explanation h3 { margin: 0; font-size: 18px; font-weight: 600; line-height: 1.35; }
        .gloria-explanation p, .gloria-label { margin: 0; color: rgba(0,0,0,.62); font-size: 14px; font-weight: 300; line-height: 1.7; }
        .gloria-label { margin: -12px 0 48px; padding: 22px 24px; border-left: 3px solid #0057ff; background: #f5f7fa; }
        .gloria-stage-nav { position: fixed; z-index: 35; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 9px; width: 24px; }
        .gloria-stage-link { position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; border: 0; background: transparent; color: #111; cursor: pointer; }
        .gloria-stage-dot { width: 5px; height: 5px; border: 1px solid #111; border-radius: 50%; background: #fff; transition: .18s ease; }
        .gloria-stage-link.active .gloria-stage-dot, .gloria-stage-link:hover .gloria-stage-dot { width: 9px; height: 9px; background: #111; }
        .gloria-stage-label { position: absolute; right: 28px; padding: 5px 8px; border: 1px solid rgba(0,0,0,.12); border-radius: 2px; background: #fff; color: #111; box-shadow: 0 5px 18px rgba(0,0,0,.08); font: 600 9px/1 'JetBrains Mono', monospace; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; opacity: 0; transform: translateX(5px); pointer-events: none; transition: .18s ease; }
        .gloria-stage-link:hover .gloria-stage-label, .gloria-stage-link:focus-visible .gloria-stage-label { opacity: 1; transform: translateX(0); }
        .gloria-prototype-gallery { display: grid; grid-template-columns: 1.35fr 1fr; gap: 16px; margin-bottom: 24px; }
        .gloria-prototype-shot { margin: 0; overflow: hidden; border: 1px solid rgba(0,0,0,.12); border-radius: 3px; background: #f4f7fc; }
        .gloria-prototype-shot:first-child { grid-row: span 2; }
        .gloria-prototype-shot img { display: block; width: 100%; height: 100%; min-height: 180px; object-fit: cover; object-position: top left; }
        .gloria-prototype-cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 24px 26px; border-radius: 3px; background: #101828; color: #fff; }
        .gloria-prototype-cta h3 { margin: 0 0 6px; font-size: 20px; }
        .gloria-prototype-cta p { margin: 0; color: rgba(255,255,255,.68); font-size: 13px; font-weight: 300; line-height: 1.5; }
        .gloria-prototype-cta a { display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0; padding: 11px 15px; border: 1px solid rgba(255,255,255,.82); border-radius: 3px; background: #fff; color: #101828; font-size: 12px; font-weight: 650; text-decoration: none; transition: .18s ease; }
        .gloria-prototype-cta a:hover { background: #f1f1f1; transform: translateY(-1px); }
        html { scroll-behavior: smooth; }
        @media (max-width: 1279px) { .gloria-stage-nav { display: none; } }
        @media (max-width: 720px) {
          .gloria-case-study { padding-top: 8px; padding-bottom: 72px; }
          .gloria-case-study section { margin-bottom: 72px; padding-top: 36px; }
          .gloria-section-heading { margin-bottom: 28px; }
          .gloria-section-heading h2 { font-size: 29px; }
          .gloria-figure { margin-bottom: 24px; border-radius: 2px; }
          .gloria-figure figcaption { font-size: 8px; }
          .gloria-explanation { display: block; margin-top: -4px; margin-bottom: 36px; padding: 20px; }
          .gloria-explanation h3 { margin-bottom: 10px; font-size: 18px; }
          .gloria-prototype-gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; padding-bottom: 8px; }
          .gloria-prototype-shot { min-width: 86%; aspect-ratio: 16/10; scroll-snap-align: start; }
          .gloria-prototype-cta { display: block; padding: 21px; }
          .gloria-prototype-cta a { margin-top: 18px; justify-content: center; }
        }
      `}</style>

      <nav className="gloria-stage-nav" aria-label="Case study stages" style={{ left: `${railLeft}px` }}>
        {stages.map(([id, label], index) => (
          <button
            key={id}
            type="button"
            className={`gloria-stage-link ${activeStage === id ? 'active' : ''}`}
            aria-label={`${index + 1}. ${label}`}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            <span className="gloria-stage-label">{String(index + 1).padStart(2, '0')} / {label}</span>
            <span className="gloria-stage-dot" />
          </button>
        ))}
      </nav>

      <section id="gloria-context">
        <SectionTitle number="01" label="Kontekst" description="Punkt wyjścia: organizacja, model działania oraz otoczenie, w którym powstaje i jest dostarczana usługa szkoleniowa.">Organizacja i kontekst biznesowy</SectionTitle>
        <Figure src="assets/ba-artifacts/operating-context.png" alt="Kontekst operacyjny Gloria LMS" />
        <Figure src="assets/ba-artifacts/organization-context.png" alt="Struktura współpracy wokół cyklu życia kursu" />
        <Figure src="assets/ba-artifacts/business-model-canvas.png" alt="Business Model Canvas Gloria" />
        <Figure src="assets/ba-artifacts/analysis-plan.png" alt="Plan analizy biznesowej" />
        <Figure src="assets/ba-artifacts/value-chain.png" alt="Łańcuch wartości usługi szkoleniowej" />
        <Figure src="assets/ba-artifacts/benchmark-research.png" alt="Benchmarki rynkowe dobrane do przypadków użycia" />
        <Figure src="assets/main-02.png" alt="Obecny sposób obsługi kursów" />
        <Figure src="assets/main-03.png" alt="Potrzeba biznesowa" />
        <Figure src="presentations/Gloria_LMS_artefakt_01_uzasadnienie_biznesowe_PL_v2.png" alt="Uzasadnienie biznesowe" />
        <Figure src="presentations/Gloria_LMS_artefakt_02_ocena_wariantow_PL_v1.png" alt="Ocena wariantów rozwiązania" />
        <Figure src="presentations/Gloria_LMS_artefakt_03_wybrany_kierunek_PL_v1.png" alt="Wybrany kierunek rozwiązania" />
      </section>

      <section id="gloria-diagnosis">
        <SectionTitle number="02" label="Diagnoza" description="Granica produktu oraz procesy pokazujące, gdzie rozproszona praca generowała ręczne handoffy i utratę aktualnego statusu.">Zakres produktu i procesy AS-IS</SectionTitle>
        <Figure src="assets/main-04.png" alt="Granica produktu" />
        <Figure src="assets/main-05.png" alt="Analiza procesu AS-IS" />
        <Figure src="diagrams/as-is-course-planning.png" alt="AS-IS - planowanie kursu" variant="artifact" />
        <Explanation title="AS-IS: planowanie kursu">Proces pokazuje przygotowanie edycji kursu, wybór wykładowcy, uzgadnianie zakresu i budowanie harmonogramu. Informacje przechodzą pomiędzy osobami i narzędziami, dlatego każda zmiana wymaga ręcznego potwierdzenia. Wniosek: kurs potrzebuje jednego rekordu ze wspólnym statusem, harmonogramem i odpowiedzialnością.</Explanation>
        <Figure src="diagrams/as-is-enrollment_v5.png" alt="AS-IS - zapis i przygotowanie uczestnika" variant="artifact" />
        <Explanation title="AS-IS: zapis i przygotowanie uczestnika">Po zapisie dane uczestnika są sprawdzane, uzupełniane i przekazywane dalej, a dostęp do kursu jest testowany poza jednym spójnym przepływem. Obsługa błędów tworzy dodatkowe handoffy. Wniosek: onboarding powinien mieć widoczny stan gotowości oraz jednoznaczną obsługę brakujących danych i problemów z dostępem.</Explanation>
        <Figure src="diagrams/as-is-assignment-feedback.png" alt="AS-IS - zadania i informacja zwrotna" variant="artifact" />
        <Explanation title="AS-IS: zadania i informacja zwrotna">Zadanie, termin, oddanie pracy, ocena i feedback są obsługiwane w różnych kanałach. Uczestnik i wykładowca nie korzystają z jednego stanu zadania ani wspólnej historii. Wniosek: cały cykl powinien być utrzymywany przez system jako jeden powiązany przepływ.</Explanation>
        <Figure src="assets/main-06.png" alt="Diagnoza stanu obecnego" />
        <Figure src="assets/ba-artifacts/sipoc-delivery.png" alt="SIPOC course delivery i assignment feedback" />
      </section>

      <section id="gloria-requirements">
        <SectionTitle number="03" label="Wymagania" description="Potrzeby trzech ról zostały połączone z dowodami, odpowiedzialnościami i wymaganiami funkcjonalnymi oraz jakościowymi.">Użytkownicy i wymagania</SectionTitle>
        <Figure src="assets/main-07.png" alt="Potrzeby użytkowników" />
        <Explanation title="Proto-persony: trzy role w jednym lifecycle kursu">Proto-persony porządkują hipotezy o sposobie pracy, celach i problemach użytkowników. Nie zastępują badań z użytkownikami i nie definiują trzech osobnych produktów - pokazują trzy perspektywy na te same materiały, terminy, zadania i statusy.</Explanation>
        <Figure src="personas/LMS_Persona_Learner.jpg" alt="Persona uczestniczki kursu" />
        <Figure src="personas/LMS_Persona_Lecturer.jpg" alt="Persona wykładowcy" />
        <Figure src="personas/LMS_Persona_PM.jpg" alt="Persona project managera" />
        <Figure src="assets/ba-artifacts/rasci.png" alt="Macierz RASCI stakeholderów" />
        <Figure src="presentations/Gloria_LMS_artefakty_robocze_PL_v1_slide_04.png" alt="Profile użytkowania produktu" />
        <Figure src="assets/main-08.png" alt="Śledzenie pochodzenia wymagań" />
        <Figure src="assets/main-09.png" alt="Katalog wymagań" />
        <Figure src="assets/ba-artifacts/traceability.png" alt="Macierz śledzenia wymagań" />
        <Figure src="assets/main-10.png" alt="Wymagania jakościowe" />
      </section>

      <section id="gloria-target">
        <SectionTitle number="04" label="Model docelowy" description="Docelowe zachowanie systemu i procesy pokazują, jak wspólny stan kursu zastępuje koordynację prowadzoną poza LMS.">Zachowanie produktu i procesy TO-BE</SectionTitle>
        <Figure src="assets/main-11.png" alt="Docelowe zachowanie produktu" />
        <Figure src="assets/main-12.png" alt="Model przypadków użycia" />
        <Figure src="diagrams/LMS_UML_UseCase.jpg" alt="Pełny diagram przypadków użycia" variant="portrait" />
        <p className="gloria-label"><strong>Diagram przypadków użycia.</strong> Pokazuje działania dostępne dla uczestnika, wykładowcy, course managera i zespołów wspierających oraz miejsca, w których ich odpowiedzialności spotykają się w systemie.</p>
        <Figure src="assets/ba-artifacts/use-case-scenario.png" alt="Scenariusz przypadku użycia: oddanie zadania" />
        <Figure src="assets/ba-artifacts/event-storming.png" alt="Event storming dla cyklu zadanie-oddanie-feedback" />
        <Figure src="presentations/Gloria_LMS_artefakty_robocze_PL_v1_slide_06.png" alt="Zmiany stanu pomiędzy rolami" />
        <Figure src="assets/main-13.png" alt="Docelowe procesy kursu" />
        <Figure src="diagrams/to-be-course-setup.png" alt="TO-BE - przygotowanie edycji kursu" variant="artifact" />
        <Explanation title="TO-BE: przygotowanie edycji kursu">System utrzymuje rekord edycji, wspiera wybór wykładowcy, waliduje harmonogram i zapisuje potwierdzenia. Zmiany nie muszą być rekonstruowane z wiadomości. Wniosek: course manager zarządza przebiegiem, a system pilnuje spójności danych i stanu przygotowania.</Explanation>
        <Figure src="diagrams/to-be-onboarding.png" alt="TO-BE - onboarding uczestnika" variant="artifact" />
        <Explanation title="TO-BE: onboarding uczestnika">Dane, dostęp i pierwszy kontakt z kursem tworzą jeden kontrolowany przepływ. System pokazuje, czy uczestnik jest gotowy, a wyjątki trafiają do obsługi zamiast pozostawać w prywatnej komunikacji. Wniosek: gotowość uczestnika staje się widocznym stanem procesu.</Explanation>
        <Figure src="diagrams/to-be-assignment-feedback.png" alt="TO-BE - zadania, ocena i informacja zwrotna" variant="artifact" />
        <Explanation title="TO-BE: zadania, ocena i informacja zwrotna">Publikacja zadania, oddanie pracy, ocena i feedback aktualizują ten sam obiekt oraz jego historię. Każda rola widzi właściwy następny krok. Wniosek: assignment lifecycle jest dobrym przekrojem MVP, ponieważ sprawdza współdzielony stan, terminy, uprawnienia i komunikację.</Explanation>
        <Figure src="assets/ba-artifacts/change-analysis.png" alt="Porównanie procesów AS-IS i TO-BE" />
      </section>

      <section id="gloria-product">
        <SectionTitle number="05" label="Struktura" description="Model produktu porządkuje współdzielone rekordy i relacje potrzebne do obsługi pełnego cyklu kursu.">Model produktu</SectionTitle>
        <Figure src="assets/main-14.png" alt="Docelowy model produktu" />
        <Figure src="assets/ba-artifacts/domain-model-ddd.png" alt="Konceptualny model domeny Gloria LMS w ujęciu DDD" />
      </section>

      <section id="gloria-mvp">
        <SectionTitle number="06" label="Priorytety" description="Zakres pierwszej wersji został ograniczony do najmniejszego kompletnego przepływu, który angażuje wszystkie kluczowe role.">MVP</SectionTitle>
        <Figure src="assets/main-16.png" alt="Priorytetyzacja MVP" />
        <Figure src="assets/main-17.png" alt="Logika wyboru MVP" />
        <Figure src="assets/main-18.png" alt="Zakres MVP" />
      </section>

      <section id="gloria-ux">
        <SectionTitle number="07" label="UX" description="Wymagania i procesy zostały przełożone na przepływy użytkowników, architekturę informacji i pierwszy zestaw ekranów.">Przejście do projektu UX</SectionTitle>
        <Figure src="assets/main-19.png" alt="Główne przepływy użytkowników" />
        <Figure src="assets/ba-artifacts/ux-decisions.png" alt="Założenia i decyzje przed architekturą informacji" />
        <Figure src="assets/main-20.png" alt="Architektura informacji" />
        <Figure src="assets/main-21.png" alt="Lista ekranów" />
      </section>

      <section id="gloria-prototype">
        <SectionTitle number="08" label="Prototyp" description="Klikalny prototyp sprawdza wspólny stan kursu z perspektywy uczestnika, wykładowcy i course managera.">Interaktywny prototyp Gloria LMS</SectionTitle>
        <div className="gloria-prototype-gallery">
          <figure className="gloria-prototype-shot"><img src={asset('prototype/learner-dashboard.png')} alt="Panel uczestnika w prototypie Gloria LMS" loading="lazy" /></figure>
          <figure className="gloria-prototype-shot"><img src={asset('prototype/login.png')} alt="Logowanie do prototypu Gloria LMS" loading="lazy" /></figure>
          <figure className="gloria-prototype-shot"><img src={asset('prototype/account.png')} alt="Panel operacyjny course managera" loading="lazy" /></figure>
        </div>
        <div className="gloria-prototype-cta">
          <div><h3>Explore the working prototype</h3><p>Prototype opens in a new tab and includes role switching and the core assignment workflow.</p></div>
          <a href={prototypeUrl} target="_blank" rel="noopener noreferrer">Open prototype <ArrowUpRight size={16} strokeWidth={2} /></a>
        </div>
      </section>
    </div>
  );
}
