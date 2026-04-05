# AGENTS.md

This file defines the coding style, conventions, and architecture rules for this project.
Follow these rules precisely and consistently. Do not deviate unless explicitly asked.

---

## General Philosophy

- Write clean, minimal, readable code.
- No unnecessary comments. Code should be self-explanatory.
- No over-engineering. Solve the problem at hand, nothing more.
- Never add unrequested code, files, refactors, or abstractions.
- When in doubt, do less.
- Use blank lines to separate logical blocks everywhere: between functions, between inner blocks inside a function, between switch cases, between groups of related statements. Breathing room is part of readability.
- In arrays of objects or function calls, add a blank line between each entry only when the entries themselves are multiline. Single-line entries stay together with no blank lines between them.
- In JSX, add a blank line between sibling elements at the same level (e.g. two `<span>` next to each other must have a blank line between them).
- In JSX templates, avoid `if` statements and complex logic inline. Extract that logic into a named function and call it in the template instead.
- Ternary operators are allowed in JSX for simple conditional rendering or conditional class/style values. For anything more complex, extract to a function.
- Nested ternary chains (e.g. `a ? x : b ? y : c ? z : w`) are never allowed. Replace them with a lookup map (`Record<K, V>`) defined in the component's frontmatter or function body.
- When a `style` prop object has two or more properties whose values depend on the same condition, extract the entire style object into a named function (e.g. `filterButtonStyle(active, color)`) that returns a `CSSProperties` object. Never scatter multiple ternaries on the same condition across adjacent style properties.
- When a JSX map callback renders more than one element variant or contains non-trivial conditions, extract named predicate functions (e.g. `isLink`, `isLast`) into the frontmatter or component body. Each branch in the template must then be a simple `{condition && <element>}` — no inline ternaries between structurally different elements.
- Complex conditions — those involving multiple boolean operators (`&&`, `||`), optional-chaining combined with other checks, repeated `?? fallback` patterns, or conditions whose intent is not immediately obvious — must be extracted into a named function with a descriptive name. The function name should make the intent self-evident without needing a comment.

---

## Imports

- Sort all import statements by **string length**, shortest first.
- One import per line. No barrel-style inline grouping.
- Separate third-party imports from internal imports with a blank line only when it significantly aids readability — otherwise keep them together sorted by length.
- Use `@/` path aliases for internal imports.

**Example:**

```ts
import { useState } from 'react';
import { PAGE_SIZE } from '@/lib/config';
import type { LGTMEntry } from '@/lib/lgtm';
import { RARITY_LABELS } from '@/lib/lgtm';
import { Pagination } from '@/components/pagination';
import { CATEGORY_COLORS, RARITY_COLORS } from '@/lib/content';
```

---

## Naming

- **Variables and functions**: `camelCase`, always descriptive and concise.
- **Types and interfaces**: `PascalCase`.
- **Files and folders**: `kebab-case`.
- **Test helpers/factories**: short, lowercase, meaningful (e.g. `makeEntry`).
- Avoid abbreviations unless they are universally understood (e.g. `id`, `url`).
- Boolean variables should read as a question: `isOpen`, `hasError`, `isAnimating`.
- Hook files must be prefixed with `use-`: e.g. `use-entries.ts`.

---

## TypeScript

- Always type props explicitly with a named `export type` above the component or function. In `.astro` files use `type Props` (not exported) directly above `Astro.props` destructuring.
- Use `.d.ts` files for pure type definitions inside `types/`.
- Prefer `type` over `interface` unless declaration merging is needed.
- Do not use `any`. Use `unknown` and narrow when needed.
- Do not add types that were not asked for or are not strictly necessary.
- Use `import type` for type-only imports (enforced by ESLint).

---

## Astro

- `.astro` files are for static content. Use them for pages, layouts, and components that do not require client-side interactivity.
- `.tsx` files are React islands. Use them only when client-side state, effects, or event handlers are needed. Mount them from `.astro` files using `client:load` (immediate) or `client:visible` (deferred until in viewport).
- Every `.astro` component defines its props with `type Props` in the frontmatter. Destructure from `Astro.props` immediately after.
- Lookup maps, predicate functions, and derived values belong in the frontmatter (`---` block), not inline in the template.
- Use scoped `<style>` blocks inside `.astro` files for component-specific CSS that requires pseudo-selectors, keyframe animations, or media queries that Tailwind cannot express.
- Dynamic routes live in `src/pages/` as `[param].astro` and always export `getStaticPaths`.
- Inline event handlers in `.astro` templates (e.g. `onmouseover`, `onmouseout`) are acceptable for simple imperative style mutations that cannot be handled by Tailwind hover utilities.

**Example `.astro` component structure:**

```astro
---
import { RARITY_LABELS } from '@/lib/lgtm';
import type { LGTMEntry } from '@/lib/lgtm';

type Props = {
  entry: LGTMEntry;
  variant?: 'default' | 'compact';
};

const { entry, variant = 'default' } = Astro.props;

const variantPadding = {
  default: 'p-6',
  compact: 'py-4 px-5',
}[variant];

function showTags(): boolean {
  return variant !== 'compact' && (entry.tags?.length ?? 0) > 0;
}
---

<article class={`... ${variantPadding}`}>...</article>
```

---

## React Islands

- Use **named exports** for components: `export function MyComponent`.
- Export the prop type above the component: `export type MyComponentProps = { ... }`.
- Keep components focused and small. Split into dedicated files when a component grows.
- Internal helper functions (e.g. style factories, predicates) should be defined at module level if they do not close over component state, or inside the component if small and component-specific.
- Use early returns inside handlers to avoid nesting.
- Do not leave unused state, props, or imports.
- Sort JSX attributes by **string length**, shortest first, same rule as imports. Multiline attributes (i.e. attributes whose value spans multiple lines, like object literals or multiline arrow functions) always go last, after all single-line attributes, regardless of their length.

**Example structure:**

```tsx
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { PAGE_SIZE } from '@/lib/config';
import type { LGTMEntry } from '@/lib/lgtm';

export type MyComponentProps = {
  entries: LGTMEntry[];
};

function itemStyle(active: boolean): CSSProperties {
  return {
    color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
    background: active ? 'var(--color-surface-raised)' : 'var(--color-surface)',
  };
}

export function MyComponent({ entries }: MyComponentProps) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

---

## Styling

Apply styles in this order of preference — use the first option that solves the problem:

1. **Tailwind utility classes** — always try Tailwind first.
2. **Global CSS classes** (`.btn`, `.btn-primary`, `.btn-ghost`, `.badge-*`, `.container`) — check `src/styles/global.css` before writing new classes.
3. **Scoped `<style>` blocks** in `.astro` files — for pseudo-selectors, keyframes, or media queries Tailwind cannot handle.
4. **Inline `style` prop with `var(--token)`** — only for dynamic or condition-driven values (e.g. a color driven by data, hover state toggled imperatively).

CSS design tokens are defined in `src/styles/global.css` under `@theme {}`. Always reference them as `var(--color-*)`, `var(--font-*)` etc. Do not hardcode color values that have a corresponding token.

Never define a new global CSS class without first checking whether an existing class or Tailwind utility combination covers the need.

---

## Data Layer

- The sole data source is `data/lgtm.json`. There is no backend, API, or database.
- Never import `data/lgtm.json` directly from a component or page. All data access goes through the functions exported from `src/lib/lgtm.ts` (`getAllEntries`, `getEntryById`, `getEntriesByCategory`, etc.).
- Data is loaded at build time only — there are no runtime data fetches.

---

## Testing

- Use **Vitest**: `describe`, `test`, `expect`, `vi`, `beforeEach`.
- Import order follows the same length-sorting rule.
- Use `beforeEach(() => { vi.clearAllMocks(); })` in every describe block.
- Test descriptions follow the pattern: `'should [do something]'` and `'should throw if [something] fails'`. Always fully lowercase — no uppercase anywhere in the description, including acronyms (e.g. `'should return the entry id'`, not `'should return the entry ID'`).
- Use the `makeEntry(overrides?)` factory from `src/test/fixtures.ts` to create test entries — do not repeat object literals inline.
- Fixtures live in `src/test/fixtures.ts` and are imported as named exports.
- Test files live in `src/test/` and follow the glob `src/test/**/*.test.{ts,tsx}`.
- Group tests with `describe('feature', () => { ... })`. Nest a second `describe` level only when a file tests multiple distinct functions.
- Every happy path test has a corresponding failure test.

**Example:**

```ts
import { makeEntry } from '@/test/fixtures';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getEntryById, getAllEntries } from '@/lib/lgtm';

describe('get entry by id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return the correct entry', () => {
    const entry = getEntryById(1);
    expect(entry).toBeDefined();
    expect(entry!.id).toBe(1);
  });

  test('should return undefined for unknown id', () => {
    expect(getEntryById(9999)).toBeUndefined();
  });
});
```

---

## Folder Structure

```
lgtm/
├── data/             # Raw data source (lgtm.json) — read-only at runtime
├── public/           # Static assets (favicon, etc.)
├── src/
│   ├── components/   # .astro static components and .tsx React islands
│   ├── layouts/      # Shared HTML shells (base-layout.astro)
│   ├── lib/          # config.ts, lgtm.ts, content.ts, random.ts, helpers
│   ├── pages/        # Astro file-based routes (index, browse, lgtm/, categories/, rarities/)
│   ├── styles/       # global.css (Tailwind v4 entry + CSS design tokens)
│   └── test/         # fixtures.ts, setup.ts, *.test.{ts,tsx}
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## What NOT to Do

- Do not add comments explaining what the code does.
- Do not add `console.log` statements.
- Do not create extra abstraction layers that were not asked for.
- Do not refactor files that are not part of the current task.
- Do not change import style, formatting, or naming in files you are only partially editing.
- Do not use default exports.
- Do not sort imports alphabetically — sort by string length.
- Do not add `index.ts` barrel files unless explicitly asked.
- Do not drop into plain CSS for a styling problem if it can be solved with Tailwind utility classes. Always try Tailwind first.
- Do not import `data/lgtm.json` directly — always go through `src/lib/lgtm.ts`.
- Do not add `'use client'` to `.tsx` files — this is an Astro project, not Next.js, and the directive has no effect here.
