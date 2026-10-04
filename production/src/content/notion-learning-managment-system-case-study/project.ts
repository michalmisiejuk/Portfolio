import cover from './images/case-study-v2/assets/main-01.png';

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
  thumbnail: cover,
  thumbnailAlt: 'Gloria LMS case study cover',
  projectLinks: [
    {
      label: 'Case Study Documentation',
      url: 'https://docs.google.com/document/d/1yZKA9m3UxxT4IYslVLQsFBzLTBvoIj95by8kfbIhqsM/edit?usp=sharing',
    },
  ],
  sections: [slide(cover, 'Wprowadzenie do Gloria LMS')],
};
