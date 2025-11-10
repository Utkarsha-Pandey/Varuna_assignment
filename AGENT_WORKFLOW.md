# AI Agent Workflow Log

## Agents Used
- GitHub Copilot (inline completions, refactoring, boilerplate)
- Claude Code (for domain modeling, algorithmic logic, and refactoring)
- Cursor Agent (for multi-file code generation and tasks.md planning)
- OpenAI Codex (for quick code snippets and test generation)

## Prompts & Outputs

### Example 1: Route Tab Table & Filtering
**Prompt:**
"Create a React component for the Routes tab. It should fetch route data from `/routes`, display a table with filters for vesselType, fuelType, and year, and include a 'Set Baseline' button that calls `POST /routes/:routeId/baseline`."
**Agent Output:**
Copilot generated the initial table and filter dropdowns. Claude Code helped refactor the filter logic to dynamically populate options from the fetched data.
**Refinement:**
Cursor Agent was used to split the logic into a core domain model and UI adapter, ensuring hexagonal separation.

---

### Example 2: CreatePool Use Case
**Prompt:**
"Write a TypeScript function for the 'CreatePool' use case. It should take an array of members with their CBs. It must validate Sum(CB) >= 0 and then perform a greedy allocation by sorting members and transferring surplus to deficits, ensuring no member exits in a worse state. Return the list with cb_before and cb_after."
**Agent Output:**
Claude Code generated the initial greedy allocation algorithm.
Copilot suggested edge-case handling for negative CBs and over-application.
Codex was used to generate unit tests for the function.
**Refinement:**
Manual review revealed a bug in the allocation loop (deficit ship could exit worse). Fixed by adding a post-allocation validation step.

---

### Example 3: Chart Visualization in Compare Tab
**Prompt:**
"Add a bar chart to the Compare tab using Recharts. The chart should compare ghgIntensity values for baseline and other routes, with reference lines for baseline and target."
**Agent Output:**
Copilot generated the chart and reference lines.
Cursor Agent helped with legend placement and label styling to avoid overlap.
**Refinement:**
Manual adjustment of barSize and legend order for better UI clarity.

---

## Validation / Corrections
- **Unit Tests:** Used Codex and Copilot to generate and refine tests for all core use-cases (ComputeComparison, CreatePool, Banking).
- **Manual Review:** Each agent output was reviewed for correctness, edge cases, and architectural fit. Refactored code to ensure strict separation of domain, application, and adapters.
- **UI Testing:** Used React Testing Library to validate tab switching, filter logic, and error handling.
- **API Integration:** Verified all frontend API calls against backend endpoints using Supertest and manual browser testing.

## Observations
- **Agent Strengths:**
  - Copilot excels at boilerplate and repetitive UI code.
  - Claude Code is best for domain modeling and complex algorithms.
  - Cursor Agent is ideal for multi-file refactoring and planning.
  - Codex is fast for generating tests and small utility functions.
- **Agent Weaknesses:**
  - Occasional hallucinations (e.g., wrong prop names, missing imports).
  - Sometimes agents suggest code that violates hexagonal boundaries (e.g., direct API calls in domain).
  - UI styling suggestions can be inconsistent.
- **Efficiency Gains:**
  - Agents reduced development time by ~60%, especially for repetitive tasks and test generation.
  - Manual review and correction still required for edge cases and architectural enforcement.
- **Best Practices Followed:**
  - Used Cursor’s `tasks.md` for planning and tracking.
  - Used Copilot for inline completions and quick refactors.
  - Used Claude Code for domain logic and algorithmic tasks.
  - Combined agent outputs, always validating and correcting as needed.
