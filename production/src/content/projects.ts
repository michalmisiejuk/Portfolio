import { mobileProductDesignSurvivalGameProject } from './behance-mobile-product-design-survival-game/project';
import { undergroundGarageUserExperienceRedesignProject } from './behance-undeground-garage-user-experience-redesign/project';
import { learningManagementSystemCaseStudyProject } from './notion-learning-managment-system-case-study/project';
import { kleksAcademyReleasedProductDemoProject } from './notion-kleks-academy-released-product-demo/project';
import { raccoonsStudioRequirementsAndImplementationProject } from './raccoons-studio-requirements-and-implementation/project';

export const projectCategories = ['All', 'Game UX', 'Business Analysis', 'Product Design'] as const;

export type ProjectCategory = (typeof projectCategories)[number];

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
  category: Exclude<ProjectCategory, 'All'>;
  summary: string;
  description: string;
  tags: string[];
  thumbnail: string;
  thumbnailAlt: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroAspectRatio?: string;
  projectLinks?: {
    label: string;
    url: string;
  }[];
  sections: ProjectSection[];
};

export const projectsContent: Project[] = [
  mobileProductDesignSurvivalGameProject,
  learningManagementSystemCaseStudyProject,
  undergroundGarageUserExperienceRedesignProject,
  kleksAcademyReleasedProductDemoProject,
  raccoonsStudioRequirementsAndImplementationProject,
];

export function getProjectBySlug(slug?: string) {
  return projectsContent.find((project) => project.slug === slug);
}
