# UX Logic Thread — Official Style Guide
## The Monochromatic Engineering Standard (Linear · Raycast · Clapet)

> **Document Status:** Active Standard  
> **Target Product:** UX Logic Thread (Traceability Mapper)  
> **Benchmark Standard:** Linear, Raycast, Clapet  
> **Author:** Frontend Design Lead  
> **Revision:** 2.0 (Strict Monochromatic Reset)

---

## 1. Executive Philosophy & The Anti-UI Slop Manifesto

UX Logic Thread is not a marketing dashboard, a gaming portal, or a consumer toy. It is a **high-velocity reasoning instrument** built for product architects and design engineers who move straight from research observations to production-ready design tokens and AI vibe-coding prompts in under 15 minutes.

### 1.1 The Problem with "AI-Generated Slop"
Previous iterations succumbed to the typical clichés of amateur AI code:
- Multi-colored cards (purple research, sky blue features, emerald sitemaps, amber tokens) resembling a preschool flashcard kit.
- Over-saturated radial glows (`shadow-purple-500/20`, `shadow-indigo-500/25`) that blur readability.
- Gratuitous gradients (`bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500`) that scream "marketing landing page" rather than "developer IDE".

### 1.2 The Monochromatic Precision Rule
In tools like **Linear**, **Raycast**, and **Clapet**, color is not used for decoration. Color is strictly reserved for actionable signals (e.g. system status, fatal error). The entire information architecture is delivered through **monochromatic tonal contrast**, **exquisite typographic scale**, and **hairline geometry**.

Every pixel in UX Logic Thread must adhere to:
1. **Obsidian Void as Foundation:** Surfaces are cut from deep neutral obsidian, not navy, purple-tinted, or washed slate.
2. **Matte Surfaces:** Panels and cards are flat and matte. Never use background gradients.
3. **1px Hairline Borders:** Optical hierarchy is created with crisp 1px borders (`#27272A`), never bulky drop shadows or colored borders.
4. **Pure White Primary Contrast:** The primary call-to-action is solid pure white (`#FFFFFF`) on black (`#09090B`), providing maximum clarity and confidence.
5. **Subtle Dot Lineage Identification:** Tiers are differentiated by subtle 1px dot indicators and clean typographic taxonomy, never whole-card rainbow tints.

---

## 2. Canonical Color Palette

The color system is distilled into **8 precise monochromatic tokens**. Every component must map to one of these tokens.

| Token Identifier | Hex Code | Purpose & Semantic Role | Tailwind Utility |
| :--- | :--- | :--- | :--- |
| `canvas-base` | `#09090B` | Deep neutral obsidian. Canvas plane, viewport base, infinite graph background. | `bg-[#09090B]` / `bg-obsidian` |
| `surface-panel` | `#121214` | Matte card surface, floating dock background, modal & drawer background. | `bg-[#121214]` / `bg-surface` |
| `surface-elevated` | `#18181B` | Hovered cards, dropdown menus, elevated utility toolbars, active tab states. | `bg-[#18181B]` / `bg-surface-elevated` |
| `border-subtle` | `#27272A` | Default 1px crisp hairline border for cards, docks, dividers, and table rows. | `border-zinc-800` / `border-[#27272A]` |
| `border-hover` | `#3F3F46` | Hover state for interactive cards and secondary controls. | `hover:border-zinc-700` / `border-[#3F3F46]` |
| `border-active` | `#52525B` | Active / focused / selected node border state (paired with subtle ring). | `border-zinc-600` / `border-zinc-400` |
| `text-primary` | `#FAFAFA` | High-contrast, sharp typography for headers, active text, card titles. | `text-[#FAFAFA]` / `text-zinc-100` |
| `text-secondary` | `#A1A1AA` | Body copy, node insight descriptions, labels, input values. | `text-[#A1A1AA]` / `text-zinc-400` |
| `text-muted` | `#71717A` | Metadata, timestamps, tier indices, shortcut hints, placeholder text. | `text-[#71717A]` / `text-zinc-500` |
| `action-primary` | `#FFFFFF` | Solid white high-contrast fill for primary actions (Export AI Context, Add Root). | `bg-white text-zinc-950` |

### 2.1 Functional Status Indicators (Micro-Accents Only)
To preserve the calm monochromatic atmosphere, status lights are restricted to tiny 1.5px/6px circular dots:
- **Live Database Sync Active:** `#10B981` (Emerald dot, `bg-emerald-500 h-1.5 w-1.5 rounded-full`)
- **Local Cache / Standalone Mode:** `#71717A` (Muted zinc dot, `bg-zinc-500 h-1.5 w-1.5 rounded-full`)
- **Destructive / Delete Action:** `#EF4444` (Muted red hover only, never persistent background)

---

## 3. Strict Prohibitions & Anti-Patterns

Any code review that detects any of the following items must reject the pull request immediately:

| ❌ BANNED PRACTICE | WHY IT IS BANNED | ✅ MANDATORY REPLACEMENT |
| :--- | :--- | :--- |
| `bg-gradient-to-...` | Looks like a marketing landing page or consumer hype app. Destroys technical credibility. | Flat matte surface: `bg-[#121214]` or `bg-[#18181B]`. |
| `shadow-purple-...` / `shadow-indigo-...` / colored glow | Blurred colored glows cause visual vibration on dark backgrounds and reduce text legibility. | Clean 1px hairline border (`border-[#27272A]`) with subtle matte depth (`shadow-lg shadow-black/50`). |
| Rainbow cards (purple, sky, emerald, amber) | Causes visual fatigue and looks like an uncoordinated prototype. | Uniform matte card background (`bg-[#121214]`) across all 4 tiers. |
| Purple/Pink Gradient AI Export Button | Distracting, toy-like gimmick. Primary action should be authoritative. | Solid white high-contrast button: `bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-3.5 py-1.5 rounded-lg text-xs`. |
| Colored canvas edge wires | Confusing rainbow spiderwebs across complex multi-branch graphs. | Neutral refined wire: `#52525B` default, `#FAFAFA` when selected. |
| ALL-CAPS eyebrow labels with high contrast | Creates unnecessary noise and repeats information. | Clean mono metadata tag: `text-[10px] font-mono text-zinc-400` with subtle dot indicator. |

---

## 4. Node Differentiation System: Subtle Dot & Typographic Hierarchy

Instead of tinting the entire card body with rainbow colors, the 4 relational tiers are distinguished with **absolute elegance**:

```
+──────────────────────────────────────────────────────────+
|  ●  01 / RESEARCH                             [🗑]       |  <-- Header: 1.5px neutral dot + mono tag
+──────────────────────────────────────────────────────────+
|  "Checkout drop-off occurs on address confirmation..."   |  <-- Body: text-secondary, editorial quote
|                                                          |
|  src: User Interview Session #4                          |  <-- Meta: text-muted mono
+──────────────────────────────────────────────────────────+
|  Root Lineage                         [ + Map Feature ]  |  <-- Footer: minimal action button
+──────────────────────────────────────────────────────────+
```

### 4.1 The 4 Tiers Specification

#### Tier 01: Research Insight (Hulu / Root)
- **Header Dot:** `w-1.5 h-1.5 rounded-full bg-zinc-400`
- **Label:** `01 / RESEARCH` in `text-[10px] font-mono tracking-wider text-zinc-400`
- **Body Styling:** Editorial quote format, `text-xs text-zinc-200 leading-relaxed font-sans`
- **Source Meta:** `text-[10px] font-mono text-zinc-500`
- **Quick Action:** Secondary button `+ Map Feature`

#### Tier 02: Feature Mapper (Solution Tier)
- **Header Dot:** `w-1.5 h-1.5 rounded-full bg-zinc-400`
- **Label:** `02 / FEATURE` in `text-[10px] font-mono tracking-wider text-zinc-400`
- **Body Styling:** Feature title `text-sm font-semibold text-zinc-100` + rationale description `text-xs text-zinc-400`
- **Quick Action:** Secondary button `+ Add Screen`

#### Tier 03: Sitemap Console (Architecture Tier)
- **Header Dot:** `w-1.5 h-1.5 rounded-full bg-zinc-400`
- **Label:** `03 / SITEMAP` in `text-[10px] font-mono tracking-wider text-zinc-400`
- **Body Styling:** Page identifier `text-sm font-semibold text-zinc-100` + hierarchy zone badge (`Header`, `Hero`, `Body`, `Floating`) in `bg-zinc-800 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded`
- **Quick Action:** Secondary button `+ Bind Token`

#### Tier 04: UI Component & Token Definer (Hilir / Output)
- **Header Dot:** `w-1.5 h-1.5 rounded-full bg-zinc-400`
- **Label:** `04 / TOKEN` in `text-[10px] font-mono tracking-wider text-zinc-400`
- **Body Styling:** Component name `<Button />` / `<Card />` in `text-sm font-semibold text-zinc-100`
- **Token Spec:** Monospace code block `font-mono text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded`

---

## 5. Typography Scale & Hierarchy

We pair **Inter** (for natural humanist readability) with **JetBrains Mono** (for structural data, IDs, and tokens).

| Role | Font Family | Size / Leading | Weight | Tracking | Sample Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **App Title** | Inter | 14px / 20px | 600 (Semibold) | `tracking-tight` | `text-sm font-semibold tracking-tight text-zinc-100` |
| **Modal / Drawer Title**| Inter | 16px / 24px | 600 (Semibold) | `tracking-tight` | `text-base font-semibold tracking-tight text-zinc-100` |
| **Node Title** | Inter | 14px / 20px | 600 (Semibold) | `tracking-snug` | `text-sm font-semibold text-zinc-100 leading-snug` |
| **Body / Quote** | Inter | 12px / 18px | 400 (Regular) | `normal` | `text-xs text-zinc-200 leading-relaxed` |
| **Secondary Description** | Inter | 12px / 16px | 400 (Regular) | `normal` | `text-xs text-zinc-400 leading-normal` |
| **Tier Metadata Tag** | JetBrains Mono| 10px / 14px | 500 (Medium) | `tracking-wider` | `text-[10px] font-mono tracking-wider uppercase text-zinc-400` |
| **Token / Code String** | JetBrains Mono| 11px / 16px | 400 (Regular) | `normal` | `text-[11px] font-mono text-zinc-300` |
| **Status / Timestamp** | JetBrains Mono| 10px / 14px | 400 (Regular) | `normal` | `text-[10px] font-mono text-zinc-500` |

---

## 6. Component Specifications

### 6.1 Primary Action Button: "Export AI Context"
The jewel of the interface. Must never be rendered with gradients. It is a solid, tactile, high-contrast block that commands focus without screaming.

```tsx
<button
  onClick={onOpenExport}
  className="bg-white text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm select-none"
>
  <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
  <span>Export AI Context</span>
</button>
```

### 6.2 Secondary / Utility Button
Used for toolbar buttons, node actions, view toggles, and modal dismissals.

```tsx
<button
  className="bg-[#121214] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 select-none"
>
  <span>Auto Layout</span>
</button>
```

### 6.3 Icon Button
Used for window actions, zoom, reset, and node deletion.

```tsx
<button
  className="h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-lg border border-transparent hover:border-zinc-800 transition-colors"
  title="Action"
>
  <Maximize2 className="h-3.5 w-3.5" />
</button>
```

### 6.4 Floating Canvas Bottom Dock
Positioned floating at the bottom center of the viewport, styled like Raycast and Clapet docks.

```tsx
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#121214]/90 backdrop-blur-md border border-zinc-800 px-2.5 py-1.5 rounded-xl shadow-2xl shadow-black/80">
  {/* Node Creators */}
  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 transition-colors">
    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
    <Quote className="h-3 w-3 text-zinc-400" />
    <span>Research</span>
  </button>
  {/* ... other node types */}
</div>
```

### 6.5 The AI Context Export Drawer
A slide-over panel on the right side of the canvas displaying generated Claude / Cursor system prompts.
- **Backdrop:** `bg-black/60 backdrop-blur-sm`
- **Surface:** `bg-[#121214] border-l border-zinc-800`
- **Code Container:** `bg-[#09090B] border border-zinc-800/90 rounded-xl font-mono text-xs text-zinc-300 p-4`
- **Target Agent Segmented Switch:** Solid white active button (`bg-white text-zinc-950`), inactive text (`text-zinc-400 hover:text-zinc-200`) inside a `bg-zinc-900 border border-zinc-800` pill container.

---

## 7. Quality & Review Checklist for Engineers

Before submitting any UI component or canvas update, verify every point on this checklist:

1. [ ] **Canvas Color:** Is the root background `#09090B`? (No `#08080A`, no `#0F0F12`, no blues).
2. [ ] **Card Surface:** Are all canvas nodes and panels `#121214` matte?
3. [ ] **Zero Gradients:** Does `grep -r "bg-gradient"` return zero results in `src/`?
4. [ ] **Zero Colored Shadows:** Does `grep -r "shadow-purple\|shadow-indigo\|shadow-sky"` return zero results?
5. [ ] **Zero Rainbow Node Tiers:** Are all 4 node tiers using the same matte `#121214` surface and differentiated only by subtle dot indicators and clear typography?
6. [ ] **Export AI Context Button:** Is it solid white (`bg-white text-zinc-950 hover:bg-zinc-200`)?
7. [ ] **Wire Connections:** Are ReactFlow edge paths colored `#52525B` (normal) and `#FAFAFA` (selected), rather than purple/green/amber?
8. [ ] **Hover/Focus State:** Are interactive states using crisp borders (`hover:border-zinc-700`, `ring-1 ring-zinc-400/20`) rather than colored glows?

---
*UX Logic Thread Design System — Built for speed, precision, and zero-wireframe cognitive flow.*
