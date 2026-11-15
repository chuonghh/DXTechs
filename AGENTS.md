# AGENTS.md

Instructions for AI coding agents working on the DXTechs codebase.

## Design System Enforcement
- Follow the design system defined in [DESIGN.md](file:///Users/admin/Downloads/Projects/DXTechs/DESIGN.md).
- Use the curated color palette: Primary `#0062FF`, Dark Ink `#070E24`, Accent `#00C2FF`, Surface `#FFFFFF` / `#F8FAFC`.
- Do not introduce AI-cliché purple gradients or un-styled components.
- Ensure 100% native Vietnamese diacritic support using `Be Vietnam Pro` and `Inter`.
- Product cards must always be vertical stacks with full unclipped text.

## Tech Stack & Commands
- **Framework**: Vue 3 (Composition API with `<script setup>`), Vue Router, Pinia
- **Styling**: Vanilla CSS in [src/style.css](file:///Users/admin/Downloads/Projects/DXTechs/src/style.css) with CSS variables matching [DESIGN.md](file:///Users/admin/Downloads/Projects/DXTechs/DESIGN.md)
- **Dev server**: `npm run dev`
- **Type check & Build**: `npm run build`
