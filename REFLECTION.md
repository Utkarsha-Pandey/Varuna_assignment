# Reflection on AI-Agent Usage

## What I Learned
Using AI agents for this project highlighted the strengths and limitations of current code-generation tools. Agents like Copilot and Claude Code are invaluable for rapid prototyping, boilerplate generation, and even complex algorithmic tasks. However, they require careful guidance and validation, especially for architectural boundaries and edge-case handling.

## Efficiency Gains vs Manual Coding
- **Speed:** Agents reduced development time by more than half for repetitive tasks, UI scaffolding, and test generation.
- **Quality:** The initial agent output was often 80% correct, but the final 20% (edge cases, domain separation, error handling) required manual review and correction.
- **Learning:** Agents provided useful suggestions for unfamiliar libraries (e.g., Recharts, Prisma) and helped enforce best practices.

## Improvements for Next Time
- **Prompt Engineering:** More precise, context-rich prompts yield better results. I would invest more time in crafting prompts and iteratively refining them.
- **Validation:** Integrate automated linting and type-checking earlier in the workflow to catch agent mistakes faster.
- **Documentation:** Maintain a running log of agent actions and corrections for easier review and grading.
- **Testing:** Use agents to generate not just unit tests but also integration and edge-case tests.

## Final Thoughts
AI agents are powerful collaborators, but not replacements for thoughtful engineering. The best results come from combining agent speed with human judgment, especially for architecture, validation, and documentation.
