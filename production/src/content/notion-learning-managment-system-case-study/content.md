# Gloria LMS: Analysis, Requirements and MVP Definition

Gloria's course delivery relied on Google Drive, Excel and Microsoft Teams. The project examined where this setup failed, used the findings to define product requirements and reduced the planned scope to an MVP that users could test.

## Resources

- [Case Study Documentation](https://docs.google.com/document/d/1yZKA9m3UxxT4IYslVLQsFBzLTBvoIj95by8kfbIhqsM/edit?usp=sharing)
- Source PDF: `source/Gloria_LMS_case_study_narrative_draft_v3.pdf`

![Gloria LMS case study cover](images/slides-v3/01-cover.png)

## Operational Problem

### Understanding the operational problem

The work began with Gloria's operating model and the recurring problems reported by the Course Manager. The team first established which course activities belonged within the LMS scope.

![Fragmented operations made course status unreliable](images/slides-v3/03-business-need.png)

The business problem did not yet define which course activities belonged within the LMS scope.

![The LMS scope covers course operations for each course edition](images/slides-v3/05-system-boundary.png)

After setting the boundary, the team mapped the current process to identify where the same problems occurred repeatedly.

![AS-IS process evidence](images/slides-v3/07-as-is-process-evidence.png)

![Current-state diagnosis](images/slides-v3/08-current-state-diagnosis.png)

## Evidence and Requirements

### From evidence to requirements

The interview first suggested a problem with tools. Process analysis showed that teams lacked shared responsibility for course information and a reliable current status. The team recorded both the user need and the strength of the supporting evidence.

![User requirements and evidence status](images/slides-v3/10-user-needs.png)

Rather than combine all needs into one feature list, the team recorded the source, evidence status and purpose of each requirement.

![Requirements traceability](images/slides-v3/12-requirements-traceability.png)

![Requirements catalogue evidence](images/slides-v3/13-requirements-catalogue.png)

After defining system behaviour, the team set the quality conditions that would make that behaviour dependable in daily work.

![Quality requirements](images/slides-v3/15-quality-requirements.png)

## Product Response

### Defining the product response

The requirements baseline covered business goals, user needs, system behaviour and quality constraints. The next task was to combine these layers into one coherent operating model for the product.

![Target product behaviour](images/slides-v3/17-target-product-behaviour.png)

![Use case model](images/slides-v3/18-use-case-model.png)

The use case model assigned actions to each role. The team then used the TO-BE process to specify how each action changes the recorded course status.

![TO-BE process evidence](images/slides-v3/20-to-be-process-evidence.png)

![Target product model](images/slides-v3/21-target-product-model.png)

![Domain model](images/slides-v3/22-domain-model.png)

## Testable MVP

### Reducing the solution to a testable MVP

Together, the requirements, TO-BE process and domain model described how the LMS stores current course information. The team then selected the smallest complete workflow involving all three roles.

![MVP prioritization](images/slides-v3/24-mvp-prioritization.png)

![MVP selection](images/slides-v3/25-mvp-selection.png)

After selecting the assignment lifecycle, the team defined the functional and quality scope required to test it end to end.

![MVP scope](images/slides-v3/27-mvp-scope.png)

## Product Definition and UX

### From product definition to UX

After defining the MVP scope, the team still needed to test how each role would use it. Each role had to complete the assignment workflow and understand the current course status without coordinating through other tools.

![Core user flows](images/slides-v3/29-core-user-flows.png)

The team can now use these flows to prepare the Information Architecture, Screen Inventory, wireframes and prototype scenarios.

![Information architecture](images/slides-v3/31-information-architecture.png)

![Screen inventory](images/slides-v3/32-screen-inventory.png)
