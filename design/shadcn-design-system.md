# UX Logic Thread — Editorial Dark Minimalist Design System
## Custom Shadcn/UI Specification & Implementation Guide

> **Product:** UX Logic Thread (Traceability Mapper)  
> **Aesthetic Archetype:** Editorial Dark Minimalist (Anti-UI Slop)  
> **Target Users:** Senior Product Designers & Frontend Architects moving directly from research insights to code without manual wireframes.  
> **Target Surfaces:** Relational MindMap Canvas, Node Panels, Quick Inputs, Context Drawer.  
> **Status:** Approved for Implementation.

---

## 1. Design Plan & Philosophy (Pass 1)

### 1.1 The Subject Matter & The "Anti-UI Slop" Manifesto
UX Logic Thread is not a generic consumer SaaS tool or a marketing dashboard. It is a high-velocity reasoning console for product makers. Every pixel must serve cognitive clarity.

**Strict Anti-Cliché Rules:**
1. **No Warm Cream + Terracotta:** Strictly banned. The canvas is pure Obsidian (`#08080A`).
2. **No Acid Green / Vermilion Shock Accents:** Accents are reserved strictly for the **4 Lineage Tiers** to convey data hierarchy, not random decoration.
3. **No Generic SaaS Card Kit:** Banished are the squircle cards with blurry `box-shadow: 0 10px 25px rgba(0,0,0,0.08)`. Instead, cards use razor-sharp 1px subtle borders (`zinc-800/80` or `18%` tier borders) backed by optical backdrop blur (`backdrop-blur-md`).
4. **No Ubiquitous Arrow Icons (`→`):** Buttons describe real actions ("Map Feature", "Copy System Prompt"), not empty direction arrows.
5. **No Eyebrow Labels Over Every Heading:** Metadata tags are used solely when indicating systemic data tiering (e.g. `01 · RESEARCH`), never for decorative filler.
6. **Spend Boldness in One Place:** The relational thread graph and active glowing nodes are the heroes. The chrome, toolbars, and inputs remain quiet, ultra-precise, and subterranean.

---

### 1.2 Core Color Palette (6 Essential Values)

| Token Name | Hex Code | Visual Role | Tailwind Mapping |
| :--- | :--- | :--- | :--- |
| **Obsidian Void** | `#08080A` | Primary background, canvas plane, deepest layer | `bg-[#08080A]` / `bg-obsidian` |
| **Graphite Surface** | `#121217` | Card backgrounds, dialog bodies, elevated toolbars | `bg-[#121217]` / `bg-surface-elevated` |
| **Subtle Border** | `#27272A` | Crisp 1px structure rules (at 60%–80% opacity) | `border-zinc-800/80` |
| **Editorial White** | `#EDEDED` | Primary typography, maximum optical contrast | `text-zinc-100` / `#EDEDED` |
| **Muted Metadata** | `#71717A` | Labels, lineage timestamps, secondary context | `text-zinc-400` / `text-zinc-500` |
| **Tier Glows** | *Tiered* | Semantic lineage identification (4 Tiers) | *See 1.3 below* |

---

### 1.3 The 4 Relational Lineage Tiers (Color & Glow System)

Every node, badge, and edge in UX Logic Thread belongs to exactly one of 4 tiers. These colors are functional state markers:

```
[01 Research] ───────► [02 Feature] ───────► [03 Sitemap] ───────► [04 Token]
  #A855F7                #0EA5E9               #10B981               #F59E0B
  Purple-500             Sky-500               Emerald-500           Amber-500
```

| Tier | Semantic Meaning | Foreground | Border | Surface Tint | Glow Shadow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01 · Research** | Ground Truth / User Insight | `text-purple-300` | `border-purple-800/40` | `bg-purple-950/20` | `0 0 20px -3px rgba(168, 85, 247, 0.20)` |
| **02 · Feature** | Solution & Rationale | `text-sky-300` | `border-sky-800/40` | `bg-sky-950/20` | `0 0 20px -3px rgba(14, 165, 233, 0.20)` |
| **03 · Sitemap** | Information Architecture | `text-emerald-300` | `border-emerald-800/40` | `bg-emerald-950/20` | `0 0 20px -3px rgba(16, 185, 129, 0.20)` |
| **04 · Token** | UI Component & Token Spec | `text-amber-300` | `border-amber-800/40` | `bg-amber-950/20` | `0 0 20px -3px rgba(245, 158, 11, 0.20)` |

---

### 1.4 Typography Roles

| Typeface | Class | Weight | Tracking | Usage Role |
| :--- | :--- | :--- | :--- | :--- |
| **Inter** | `font-sans` | 400 (Regular) | `tracking-normal` | Insight quotes, node descriptions, dialog body |
| **Inter** | `font-sans` | 500 (Medium) | `tracking-tight` | Button text, form labels, card headings |
| **Inter** | `font-sans` | 600 (Semibold) | `tracking-tight` | Header title, modal title, primary action |
| **JetBrains Mono** | `font-mono` | 500 (Medium) | `tracking-wider` | Tier badges, IDs (`#res-88a1`), code tokens |
| **JetBrains Mono** | `font-mono` | 400 (Regular) | `tracking-normal` | Export prompt preview, JSON preview, source path |

---

### 1.5 Layout Architecture (ASCII Wireframe)

```
+---------------------------------------------------------------------------------------------+
| [UX LOGIC THREAD] [● Live Sync]  [4 Res · 3 Feat · 3 Site · 4 Tok]   [Auto-Layout] [Export] |
|                                                                                             |
|   +-------------------+        +--------------------+        +--------------------+         |
|   | 01 · RESEARCH     |        | 02 · FEATURE       |        | 03 · SITEMAP       |         |
|   | #b92e             |───────►| #fe12              |───────►| Screen: Dashboard  |         |
|   | "Users abandon..."|        | Quick Search Bar   |        | Zone: Header       |         |
|   +-------------------+        +--------------------+        +--------------------+         |
|             │                                                          │                    |
|             │                                                          ▼                    |
|             │                                                +--------------------+         |
|             │                                                | 04 · UI TOKEN      |         |
|             └───────────────────────────────────────────────►| <SearchBar />      |         |
|                                                              | bg-surface text-...|         |
|                                                              +--------------------+         |
|                                                                                             |
| [ + Insight ]  [ + Feature ]  [ + Sitemap ]  [ + Token ]     [ 100% ] [Fit Canvas] [Matrix] |
+---------------------------------------------------------------------------------------------+
```

---

## 2. Review vs. Brief & Quality Checklist (Pass 2)

| Criteria | Standard | Audit Result | Action Taken |
| :--- | :--- | :--- | :--- |
| **Background Tone** | Deep Obsidian (`#08080A`), not grayish blue or washed slate. | Pass | Standardized on `#08080A` across body, canvas, and overlay masks. |
| **Border Refinement** | Crisp 1px `border-zinc-800/80` without thick heavy outlines. | Pass | Eliminated all 2px borders except on active node selection rings. |
| **Button States** | Tactile feedback with active scale-down (`active:scale-[0.98]`). | Pass | Baked into `buttonVariants` via Tailwind and Framer-grade CSS. |
| **Input Precision** | Zero layout shift on focus (`outline-none ring-1`). | Pass | Replaced jarring outline jumps with smooth subtle ring transitions. |
| **Card Atmosphere** | High density, backdrop blur, no generic blurred shadows. | Pass | Handled with `bg-[#121118]/85 backdrop-blur-md border border-zinc-800/80`. |
| **Tone of Voice** | Direct, active verbs, no apologies, engineer-friendly. | Pass | Standardized copy: "Save changes", "Delete node", "Copy prompt". |

---

## 3. Shadcn/UI Component Customization Specifications

### 3.1 Button Component (`src/components/ui/button.tsx`)

#### Variant Definitions:
1. **`default` (Primary Action):**
   - High contrast editorial white: `bg-zinc-100 text-zinc-950 font-medium hover:bg-white active:bg-zinc-200`
   - Shadow: `shadow-sm hover:shadow-zinc-200/10`
   - Active micro-animation: `active:scale-[0.98]`
2. **`subtle` (Secondary Action):**
   - Muted dark surface: `bg-zinc-900/90 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:text-white active:scale-[0.98]`
3. **`outline`:**
   - Crisp rule: `bg-transparent border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-white active:scale-[0.98]`
4. **`ghost`:**
   - Quiet click target: `bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 active:scale-[0.98]`
5. **`glow` (Accent Highlight):**
   - Gradient glow: `bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_-3px_rgba(168,85,247,0.35)] active:scale-[0.98]`
6. **`destructive`:**
   - Precision red: `bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/50 hover:text-red-100 active:scale-[0.98]`

#### Sizes:
- `sm`: `h-8 px-3 text-xs rounded-lg gap-1.5`
- `default`: `h-9 px-4 py-2 text-xs rounded-lg gap-2`
- `lg`: `h-10 px-5 text-sm rounded-xl gap-2.5`
- `icon`: `h-8 w-8 rounded-lg`

---

### 3.2 Badge Component (`src/components/ui/badge.tsx`)

Badges are formatted with uppercase JetBrains Mono, tight letter spacing, and subtle glowing background tints.

#### 4 Tier Variants:
1. **`research`:**
   - Class: `bg-purple-950/40 text-purple-300 border-purple-800/50 hover:bg-purple-900/50`
   - Monospace label: `01 · RESEARCH`
2. **`feature`:**
   - Class: `bg-sky-950/40 text-sky-300 border-sky-800/50 hover:bg-sky-900/50`
   - Monospace label: `02 · FEATURE`
3. **`sitemap`:**
   - Class: `bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/50`
   - Monospace label: `03 · SITEMAP`
4. **`token`:**
   - Class: `bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/50`
   - Monospace label: `04 · TOKEN`
5. **`neutral` & `outline`:**
   - Class: `bg-zinc-900/80 text-zinc-400 border-zinc-800`

---

### 3.3 Card Component (`src/components/ui/card.tsx`)

#### Specifications:
- Container: `rounded-xl border border-zinc-800/80 bg-[#121118]/85 backdrop-blur-md text-zinc-100 transition-all duration-150`
- Anti-Slop Rule: No `shadow-2xl` with generic soft gray blur. Shadow is strict: `shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6)]` with border luminosity.
- Header: `flex flex-col space-y-1.5 p-4 border-b border-zinc-800/40`
- Title: `text-sm font-semibold tracking-tight text-zinc-100`
- Description: `text-xs text-zinc-400 font-normal leading-relaxed`
- Content: `p-4 pt-3 text-xs text-zinc-200`
- Footer: `flex items-center justify-between p-3.5 pt-2 border-t border-zinc-800/40 bg-zinc-950/30 rounded-b-xl`

---

### 3.4 Input & Textarea (`src/components/ui/input.tsx` & `textarea.tsx`)

#### Zero-Shift Focus Architecture:
Traditional forms cause 1px layout pop when borders toggle from 1px to 2px. Our editorial specification uses:
```html
className="w-full bg-[#0C0C0E] border border-zinc-800/90 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 transition-colors duration-150 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 disabled:cursor-not-allowed disabled:opacity-50"
```
- Background: Solid dark `#0C0C0E` prevents transparency bleeding on canvas.
- Typography: Crisp 12px (`text-xs`) with `text-zinc-100`.
- Placeholder: Quiet zinc-600 so prompt text never competes with user input.

---

### 3.5 Dialog & Sheet Modal Components (`dialog.tsx` & `sheet.tsx`)

#### Backdrop & Entrance Choreography:
- **Overlay:** `fixed inset-0 z-50 bg-[#08080A]/80 backdrop-blur-sm transition-opacity duration-200`
- **Dialog Content:**
  - Placed at center: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50`
  - Container: `w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#101014] p-6 shadow-2xl`
  - Entrance Animation: `animate-in fade-in-0 zoom-in-95 duration-150`
- **Sheet (Drawer) Content:**
  - Anchored to right edge: `fixed inset-y-0 right-0 z-50 h-full w-full max-w-md border-l border-zinc-800 bg-[#0E0E12] p-6 shadow-2xl`
  - Entrance Animation: `animate-in slide-in-from-right duration-200 ease-out`

---

## 4. Writing & Microcopy Standards

| Context | Forbidden Slop | Mandatory Editorial Copy | Reason |
| :--- | :--- | :--- | :--- |
| **Save Action** | "Submit" / "Confirm →" | "Save changes" | Explicit active statement. |
| **Add Node** | "Create new item" | "Add Research Node" | Tells designer exactly what entity is spawned. |
| **Delete Action** | "Oops! Are you sure?" | "Delete Node & Descendants" | Direct warning without false politeness. |
| **Export Context** | "Click here to generate AI" | "Export System Prompt" | Concrete deliverable output for Claude/Cursor. |
| **Empty State** | "No data found, please add some." | "Canvas is empty. Add a research insight to begin tracing." | Contextual instruction. |

---

## 5. File Inventory & Implementation Plan

The following component suite is structured under `src/components/ui/` for instant import across canvas nodes and panels:

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx       # Button with variants (default, ghost, outline, subtle, glow) & scale animation
│   │   ├── badge.tsx        # Badges with 4 lineage tiers & JetBrains Mono tracking
│   │   ├── card.tsx         # Anti-slop card with backdrop blur & crisp 1px borders
│   │   ├── input.tsx        # High-precision zero-shift input
│   │   ├── textarea.tsx     # High-precision zero-shift textarea
│   │   ├── dialog.tsx       # Modal dialog with backdrop blur & smooth entrance
│   │   ├── sheet.tsx        # Slide-over drawer for prompt export & inspect
│   │   └── index.ts         # Clean barrel export
```

---

## 6. Handover Note to Lead React Engineer

All components are written in React 19 + TypeScript, using `clsx` + `tailwind-merge` (`cn` helper from `@/lib/utils`), and leverage `class-variance-authority` (cva) for type-safe variant selection.

To replace raw HTML elements in existing canvas files:
```tsx
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Input } from '@/components/ui';

// Example:
<Badge variant="research">01 · RESEARCH</Badge>
<Button variant="glow" size="sm" onClick={handleGenerate}>
  Generate Prompt
</Button>
```
Document finalized by **Frontend Designer**. Ready for deployment.
