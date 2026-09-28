import cover from './images/slides-v3/01-cover.png';
import businessNeed from './images/slides-v3/03-business-need.png';
import systemBoundary from './images/slides-v3/05-system-boundary.png';
import asIsEvidence from './images/slides-v3/07-as-is-process-evidence.png';
import currentStateDiagnosis from './images/slides-v3/08-current-state-diagnosis.png';
import userNeeds from './images/slides-v3/10-user-needs.png';
import requirementsTraceability from './images/slides-v3/12-requirements-traceability.png';
import requirementsCatalogue from './images/slides-v3/13-requirements-catalogue.png';
import qualityRequirements from './images/slides-v3/15-quality-requirements.png';
import targetProductBehaviour from './images/slides-v3/17-target-product-behaviour.png';
import useCaseModel from './images/slides-v3/18-use-case-model.png';
import toBeProcessEvidence from './images/slides-v3/20-to-be-process-evidence.png';
import targetProductModel from './images/slides-v3/21-target-product-model.png';
import domainModel from './images/slides-v3/22-domain-model.png';
import mvpPrioritization from './images/slides-v3/24-mvp-prioritization.png';
import mvpSelection from './images/slides-v3/25-mvp-selection.png';
import mvpScope from './images/slides-v3/27-mvp-scope.png';
import coreUserFlows from './images/slides-v3/29-core-user-flows.png';
import informationArchitecture from './images/slides-v3/31-information-architecture.png';
import screenInventory from './images/slides-v3/32-screen-inventory.png';

const slide = (src: string, alt: string) => ({
  type: 'image' as const,
  src,
  alt,
  aspectRatio: '16 / 9',
});

const transition = (content: string) => ({
  type: 'text' as const,
  content,
  variant: 'transition' as const,
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
  sections: [
    slide(cover, 'Gloria LMS case study cover'),
    {
      type: 'heading' as const,
      eyebrow: 'Operational Problem',
      content: 'Understanding the operational problem',
    },
    {
      type: 'text' as const,
      content:
        "The work began with Gloria's operating model and the recurring problems reported by the Course Manager. The team first established which course activities belonged within the LMS scope.",
    },
    slide(businessNeed, 'Fragmented operations made course status unreliable'),
    transition('The business problem did not yet define which course activities belonged within the LMS scope.'),
    slide(systemBoundary, 'The LMS scope covers course operations for each course edition'),
    transition('After setting the boundary, the team mapped the current process to identify where the same problems occurred repeatedly.'),
    slide(asIsEvidence, 'AS-IS process evidence and recurring coordination problems'),
    slide(currentStateDiagnosis, 'Current-state diagnosis and recurring operational problems'),
    {
      type: 'heading' as const,
      eyebrow: 'Evidence and Requirements',
      content: 'From evidence to requirements',
    },
    {
      type: 'text' as const,
      content:
        'The interview first suggested a problem with tools. Process analysis showed that teams lacked shared responsibility for course information and a reliable current status. The team recorded both the user need and the strength of the supporting evidence.',
    },
    slide(userNeeds, 'User requirements and their evidence status'),
    transition('Rather than combine all needs into one feature list, the team recorded the source, evidence status and purpose of each requirement.'),
    slide(requirementsTraceability, 'Requirements traceability from business problem to quality constraint'),
    slide(requirementsCatalogue, 'Requirements catalogue evidence and validation status'),
    transition('After defining system behaviour, the team set the quality conditions that would make that behaviour dependable in daily work.'),
    slide(qualityRequirements, 'Quality requirements for the MVP baseline'),
    {
      type: 'heading' as const,
      eyebrow: 'Product Response',
      content: 'Defining the product response',
    },
    {
      type: 'text' as const,
      content:
        'The requirements baseline covered business goals, user needs, system behaviour and quality constraints. The next task was to combine these layers into one coherent operating model for the product.',
    },
    slide(targetProductBehaviour, 'Target product behaviour connecting user needs and system requirements'),
    slide(useCaseModel, 'Use case model for the three course lifecycle roles'),
    transition('The use case model assigned actions to each role. The team then used the TO-BE process to specify how each action changes the recorded course status.'),
    slide(toBeProcessEvidence, 'TO-BE process evidence and recorded course status changes'),
    slide(targetProductModel, 'Target product model and shared course records'),
    slide(domainModel, 'Domain model for shared course information'),
    {
      type: 'heading' as const,
      eyebrow: 'Testable MVP',
      content: 'Reducing the solution to a testable MVP',
    },
    {
      type: 'text' as const,
      content:
        'Together, the requirements, TO-BE process and domain model described how the LMS stores current course information. The team then selected the smallest complete workflow involving all three roles.',
    },
    slide(mvpPrioritization, 'MVP prioritization and selection criteria'),
    slide(mvpSelection, 'Assignment workflow selected for the first MVP'),
    transition('After selecting the assignment lifecycle, the team defined the functional and quality scope required to test it end to end.'),
    slide(mvpScope, 'Scope of the first MVP assignment workflow'),
    {
      type: 'heading' as const,
      eyebrow: 'Product Definition and UX',
      content: 'From product definition to UX',
    },
    {
      type: 'text' as const,
      content:
        'After defining the MVP scope, the team still needed to test how each role would use it. Each role had to complete the assignment workflow and understand the current course status without coordinating through other tools.',
    },
    slide(coreUserFlows, 'Core user flows included in the MVP'),
    transition('The team can now use these flows to prepare the Information Architecture, Screen Inventory, wireframes and prototype scenarios.'),
    slide(informationArchitecture, 'Information architecture for shared and role-specific pages'),
    slide(screenInventory, 'Screen inventory for the first design and validation set'),
  ],
};
