@AGENTS.md

# Execution Guideline

This file is the contract for how work gets done in this repo. Every task —
whether it's a new feature, a bug fix, or a refactor — is judged against
these standards before it's considered finished.

## Priorities, in order

1. **Correctness.** The feature works end-to-end, not just in the happy path
   shown in a demo. Run `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`
   before calling anything done.
2. **Clean separation.** Data fetching lives in `src/services/` and
   `src/hooks/`. Presentation lives in `src/components/`. Endpoints live in
   `src/lib/api-paths.ts`. Animation variants live in
   `src/config/motion-variants.ts`. Theme tokens live in `src/app/globals.css`.
   Never duplicate a concern across layers — extend the existing one.
3. **Minimum token consumption.** Read only the files a task actually
   touches. Don't re-read files already open in context. Don't regenerate
   whole files when an `Edit` covers the change. Don't narrate intermediate
   steps that don't change the outcome — show the result.

## Non-negotiables

- No hardcoded hex/rgb colors in components — every color is a Tailwind
  token sourced from `globals.css`.
- No component does two jobs. If a component fetches data _and_ renders a
  complex layout, split it.
- No comment explains _what_ code does. A comment only exists to explain a
  _why_ that isn't obvious from reading the code itself.
- No new dependency for something 20 lines of plain code already solves
  (see: masonry via CSS columns, not a grid library).

## Before marking a task complete

- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm build` succeeds
- [ ] New UI has been exercised in a running `pnpm dev` session, not just
      typechecked
