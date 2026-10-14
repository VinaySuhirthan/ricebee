# Instructions for AI Agents (Ricebee CRM)

## Why these guidelines exist
Multiple AI agents and human developers collaborate on this repository at the same time. To prevent Git merge conflicts, broken builds, and code clashes, work is divided into isolated folders. Following these guidelines ensures your work merges cleanly without interfering with others.

## Core Rules

### 1. Work inside your module folder
- Keep all your screen code, subcomponents, and local types inside your assigned folder: `src/modules/<feature-name>/`.
- Export your screen from `src/modules/<feature-name>/index.ts` so the main router can import it cleanly.
- Avoid modifying other modules' folders.

### 2. Stay inside src/
- 100% of standard app development belongs in `src/`.
- Do not edit `windows/`, `android/`, or `ios/` native folders.
- Do not edit `package.json` or install new packages without the user asking for it.

### 3. Central files are reserved for integration
- Files like `App.tsx`, `src/app/`, `src/navigation/`, and `src/layout/` connect the whole application together.
- Avoid editing them during standard feature tasks unless the user explicitly asks you to register a new screen or update navigation.

### 4. Shared components (Recommended)
- Ready-to-use UI components live in `src/shared/components/` (such as AppButton, AppCard, AppBadge, AppInput, AppTable, AppIcon, PageHeader).
- You can use them to save time and keep styling consistent, but you are free to build custom module-specific components inside your module folder whenever needed.

## Verification before completing
Before finishing your task, run:
- `npx tsc --noEmit` to confirm there are no TypeScript errors.
- `npm test` to make sure existing tests pass.
