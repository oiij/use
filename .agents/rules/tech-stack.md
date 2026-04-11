# Tech Stack

## Build & Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| pnpm | workspaces | Package management |
| TypeScript | ^5.9.3 | Type checking |
| tsdown | ^0.21.4 | Bundling |
| Vite | - | Dev server |
| VitePress | ^1.6.4 | Documentation |
| Vitest | ^4.1.0 | Testing |
| ESLint | ^10.0.3 | Linting |
| UnoCSS | ^66.6.7 | Atomic CSS |
| PostCSS | ^8.5.8 | CSS processing |

## Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Vue | ^3.5.30 | Framework |
| naive-ui | ^2.44.1 | UI Component Library |
| three | ^0.183.2 | 3D Graphics |
| colord | ^2.9.3 | Color utilities |
| @vueuse/core | ^14.2.1 | Vue composables |
| vue-router | ^5.0.3 | Routing |
| vue-i18n | ^11.3.0 | Internationalization |

## Package-Specific Dependencies

### Charts & Visualization
- echarts ^6.0.0
- @visactor/vchart ^2.0.19

### Rich Text & Markdown
- @tiptap/core ^3.20.4
- markdown-it ^14.1.1
- shiki ^4.0.2
- prismjs ^1.30.0
- aieditor ^1.4.2

### File Handling
- jspdf ^4.2.1
- xlsx ^0.18.5
- file-saver ^2.0.5
- jszip ^3.10.1

### Graphics & 3D
- ogl ^1.0.11
- @splinetool/runtime ^1.12.69
- postprocessing ^6.38.3
- cannon-es ^0.20.0

### Other
- emoji-mart ^5.6.0
- dompurify ^3.3.3
- hucre ^0.3.0
- es-toolkit ^1.45.1

## Dev Tools

- @antfu/eslint-config ^7.7.3
- bumpp ^11.0.1 (version bumping)
- commitlint ^20.5.0
- cz-git ^1.12.0 (commitizen)
- simple-git-hooks ^2.13.1
- taze ^19.9.2 (dep management)
- vue-tsc ^3.2.6
- unplugin-vue ^7.1.1