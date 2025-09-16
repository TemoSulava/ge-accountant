# Coding Guidelines Reference

This project relies on the following guardrails whenever new code is authored or existing functionality is extended:

1. **Single Source of Truth** – Never duplicate files, modules, or logic. Always extend or refactor the existing implementation within the established monorepo structure (`apps/`, `packages/`, `infra/`, etc.).
2. **Respect Folder Structure** – New code must live inside the prescribed directories for each app/module; avoid creating parallel or ad-hoc folders.
3. **Stay Current** – Before introducing or modifying API usage, consult the latest official documentation and ecosystem guidance to ensure modern, recommended patterns are followed.
4. **Accuracy First** – Do not invent behaviour or configuration details. All changes must align with validated sources (product spec, existing code, or verified docs).
5. **Document Decisions** – When deviating from the spec or taking notable implementation decisions, record the rationale in the appropriate doc/task tracker.

This reference is a quick checklist to consult before each implementation step.
