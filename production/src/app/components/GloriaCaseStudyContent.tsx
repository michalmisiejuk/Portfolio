const modules = import.meta.glob(
  '../../content/notion-learning-managment-system-case-study/images/case-study-v2/**/*.{png,jpg}',
  { eager: true, import: 'default' },
) as Record<string, string>;

const base = '../../content/notion-learning-managment-system-case-study/images/case-study-v2/';
const asset = (path: string) => modules[`${base}${path}`];

function Figure({ src, alt, variant = 'default' }: { src: string; alt: string; variant?: 'default' | 'artifact' | 'portrait' }) {
  return (
    <figure className={`gloria-figure gloria-${variant}`}>
      <img src={asset(src)} alt={alt} loading="lazy" />
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

function SectionTitle({ children }: { children: string }) {
  return <h2 className="gloria-section-title">{children}</h2>;
}

export function GloriaCaseStudyContent() {
  return (
    <div className="gloria-case-study">
      <style>{`
        .gloria-case-study { width: min(1320px, calc(100% - 40px)); margin: 0 auto; padding: 0 0 120px; color: #111827; }
        .gloria-case-study section { margin: 0 0 112px; }
        .gloria-section-title { margin: 0 0 32px; font-size: 18px; font-weight: 600; letter-spacing: .01em; color: #6b7280; }
        .gloria-figure { margin: 0 0 48px; }
        .gloria-figure img { display: block; width: 100%; height: auto; }
        .gloria-artifact { width: min(1780px, calc(100vw - 32px)); margin-left: 50%; transform: translateX(-50%); }
        .gloria-artifact img { border: 1px solid #e5e7eb; }
        .gloria-portrait { width: min(1050px, 100%); margin-left: auto; margin-right: auto; }
        .gloria-explanation { max-width: 920px; margin: -18px 0 56px; }
        .gloria-explanation h3 { margin: 0 0 10px; font-size: 22px; line-height: 1.25; }
        .gloria-explanation p, .gloria-label { margin: 0; color: #4b5563; font-size: 18px; line-height: 1.55; }
        .gloria-label { max-width: 920px; margin: -18px 0 56px; }
        @media (max-width: 720px) {
          .gloria-case-study { width: calc(100% - 24px); padding-bottom: 72px; }
          .gloria-case-study section { margin-bottom: 72px; }
          .gloria-figure { margin-bottom: 28px; }
          .gloria-explanation { margin-top: -6px; margin-bottom: 40px; }
          .gloria-explanation h3 { font-size: 19px; }
          .gloria-explanation p, .gloria-label { font-size: 16px; }
        }
      `}</style>

      <section>
        <SectionTitle>Organizacja i kontekst biznesowy</SectionTitle>
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

      <section>
        <SectionTitle>Zakres produktu i procesy AS-IS</SectionTitle>
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

      <section>
        <SectionTitle>Użytkownicy i wymagania</SectionTitle>
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

      <section>
        <SectionTitle>Zachowanie produktu i procesy TO-BE</SectionTitle>
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

      <section>
        <SectionTitle>Model produktu</SectionTitle>
        <Figure src="assets/main-14.png" alt="Docelowy model produktu" />
        <Figure src="assets/ba-artifacts/domain-model-ddd.png" alt="Konceptualny model domeny Gloria LMS w ujęciu DDD" />
      </section>

      <section>
        <SectionTitle>MVP</SectionTitle>
        <Figure src="assets/main-16.png" alt="Priorytetyzacja MVP" />
        <Figure src="assets/main-17.png" alt="Logika wyboru MVP" />
        <Figure src="assets/main-18.png" alt="Zakres MVP" />
      </section>

      <section>
        <SectionTitle>Przejście do projektu UX</SectionTitle>
        <Figure src="assets/main-19.png" alt="Główne przepływy użytkowników" />
        <Figure src="assets/ba-artifacts/ux-decisions.png" alt="Założenia i decyzje przed architekturą informacji" />
        <Figure src="assets/main-20.png" alt="Architektura informacji" />
        <Figure src="assets/main-21.png" alt="Lista ekranów" />
      </section>
    </div>
  );
}
