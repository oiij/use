# UI Guidelines

## Styling Approach

- **Primary**: UnoCSS (Atomic CSS engine with Wind3 preset)
- **Typography**: DM Sans, DM Serif Display, DM Mono (via presetWebFonts)
- **Icons**: Icon preset with scale 1.2

## Component Library

- **Primary**: Naive UI ^2.44.1
- Custom VitePress theme with rainbow colors

## Design Principles

1. Use UnoCSS utilities for layout and styling
2. Prefer Naive UI components when available
3. Use attributify mode (e.g., `flex`, `items-center`, `gap-4`)
4. Consistent spacing using Tailwind-style scale

## Document Theme

- Custom VitePress theme at `.vitepress/theme/`
- Rainbow accent colors
- Component demos with vitepress-demo-plugin

## Class Naming Convention

- Follow UnoCSS defaults (kebab-case)
- Use variant groups for related properties
- Example: `hover:bg-blue-500:hover:text-white`