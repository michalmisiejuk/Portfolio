import slide01 from './images/slides-v10/slide-01.png';
import slide02 from './images/slides-v10/slide-02.png';
import slide03 from './images/slides-v10/slide-03.png';
import slide04 from './images/slides-v10/slide-04.png';
import slide05 from './images/slides-v10/slide-05.png';
import slide06 from './images/slides-v10/slide-06.png';
import slide07 from './images/slides-v10/slide-07.png';
import slide08 from './images/slides-v10/slide-08.png';
import slide09 from './images/slides-v10/slide-09.png';
import slide10 from './images/slides-v10/slide-10.png';
import slide11 from './images/slides-v10/slide-11.png';
import slide12 from './images/slides-v10/slide-12.png';
import slide13 from './images/slides-v10/slide-13.png';
import slide14 from './images/slides-v10/slide-14.png';
import slide15 from './images/slides-v10/slide-15.png';
import slide16 from './images/slides-v10/slide-16.png';
import slide17 from './images/slides-v10/slide-17.png';
import slide18 from './images/slides-v10/slide-18.png';
import slide19 from './images/slides-v10/slide-19.png';
import slide20 from './images/slides-v10/slide-20.png';
import slide21 from './images/slides-v10/slide-21.png';

const slide = (src: string, alt: string) => ({
  type: 'image' as const,
  src,
  alt,
  aspectRatio: '16 / 9',
});

export const learningManagementSystemCaseStudyProject = {
  slug: 'learning-management-system-case-study',
  title: 'Gloria LMS: Analysis, Requirements and MVP Definition',
  category: 'Business Analysis',
  categories: ['Product Design', 'Business Analysis'],
  summary:
    'Gloria is a training company that plans and delivers instructor-led courses for individual learners and corporate teams. Its course materials, schedules, assignments and reporting were managed across Google Drive, Excel and Microsoft Teams. This case study explains how we analysed that process and defined the requirements and MVP for a dedicated LMS.',
  description:
    'The project examined where the existing setup failed, defined the product boundary and requirements, and reduced the planned solution to a complete workflow that users could test.',
  tags: ['Case Study', 'Product Design', 'Business Analysis', 'LMS'],
  thumbnail: slide01,
  thumbnailAlt: 'Gloria LMS case study cover',
  projectLinks: [
    {
      label: 'Case Study Documentation',
      url: 'https://docs.google.com/document/d/1yZKA9m3UxxT4IYslVLQsFBzLTBvoIj95by8kfbIhqsM/edit?usp=sharing',
    },
  ],
  sections: [
    slide(slide01, 'Gloria LMS case study cover'),
    slide(slide02, 'Business need and project context'),
    slide(slide03, 'Business problem and operational impact'),
    slide(slide04, 'System boundary and course lifecycle scope'),
    slide(slide05, 'AS-IS process overview'),
    slide(slide06, 'AS-IS process evidence'),
    slide(slide07, 'Current-state diagnosis'),
    slide(slide08, 'Stakeholder overview'),
    slide(slide09, 'User needs and evidence status'),
    slide(slide10, 'Requirements structure'),
    slide(slide11, 'Requirements traceability'),
    slide(slide12, 'Requirements catalogue'),
    slide(slide13, 'Quality requirements'),
    slide(slide14, 'Target product behaviour'),
    slide(slide15, 'Use case model'),
    slide(slide16, 'TO-BE process evidence'),
    slide(slide17, 'Target product model'),
    slide(slide18, 'Domain model'),
    slide(slide19, 'MVP prioritization'),
    slide(slide20, 'MVP scope and core user flows'),
    slide(slide21, 'Information architecture and screen inventory'),
  ],
};
