import image02 from './images/02.png';

export const learningManagementSystemCaseStudyProject = {
  slug: 'learning-management-system-case-study',
  title: 'Learning Management System - Case Study',
  summary: 'Business analysis dla zintegrowanego LMS dla organizacji szkoleniowej.',
  description:
    'Case study pokazuje analize potrzeb, procesow i wymagan dla nowego Learning Management System, ktory zastapuje rozproszone narzedzia jednym spojnym produktem.',
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
        'Case Study Project Scope: The training company Gloria has been active in the professional education market for over five years. During this time, it has expanded its offer across multiple fields, including Marketing, IT, Finance, Presentation Skills, and Communication.',
    },
    {
      type: 'text' as const,
      content:
        'The company works with professional instructors who deliver thematic courses to end clients. Gloria prepares course-related materials such as photo sessions, marketing campaigns, and promotional content, while instructors create presentations and supplementary materials, evaluate assignments, answer questions, and provide feedback.',
    },
    {
      type: 'text' as const,
      content:
        'Training sessions are conducted mainly online, though some happen in physical training centers or rented classrooms. Participants use an online platform to review materials, complete assignments, check feedback, and communicate with instructors. Sessions are run through video conferencing, recorded, and sometimes broadcast live.',
    },
    {
      type: 'text' as const,
      content:
        'After five years of relying on commercial tools, Gloria decided to replace them with a unified LMS platform. The new system is meant to support participant registration and course management, including course sessions, materials publication, assignment management, grading, feedback, reporting, and automatic generation of certificates or diplomas.',
    },
    {
      type: 'text' as const,
      content:
        'Organizationally, Gloria is a compact company with strong marketing capabilities and close collaboration between instructors and course managers. Materials are currently managed in Google Drive, online sessions are conducted in Microsoft Teams, and courses usually gather between 20 and 100 participants depending on topic.',
    },
  ],
};
