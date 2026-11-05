# UI Quality Audit & Anti-Slop Remediation Plan
**Product:** UX Logic Thread (Traceability Mapper)  
**Reviewer:** UI Quality Reviewer (Skill: `ui-taste` by Uizze)  
**Stakeholder:** Head of Product & Engineering Lead  
**Audit Date:** November 2, 2026  
**Status:** ACTIONABLE REMEDIATION SPECIFICATION — READY FOR IMPLEMENTATION

---

## 1. Executive Summary & Audit Context

### 1.1 Direct Response to Owner Feedback
> *"Padahal sudah menggunakan komponen shadcn ui tapi kenapa masih penuh gradient dan warna warna yang seperti itu? Gunakan design system, style guide, apakah seperti ini cocok disebut product?"*

**Verdict: The Owner's criticism is 100% correct, precise, and urgently needed.**

While the project adopted shadcn/UI structural primitives (`button`, `badge`, `card`, `dialog`, `sheet`), the visual execution fell directly into the notorious **"AI Slop" syndrome**:
1. **Consumer-SaaS Gradient Slop:** Buttons and drawer headers were slathered in cheap tri-color gradients (`bg-gradient-to-r from-purple-600 to-indigo-600` and `from-purple-600 to-pink-600`) reminiscent of low-tier AI wrapper landing pages.
2. **Colored Fuzzy Drop Shadows:** Indiscriminate use of `shadow-purple-500/20`, `shadow-[0_0_20px_-3px_rgba(168,85,247,0.35)]`, and `shadow-sky-500/20` which smear muddy neon blur across the canvas rather than providing optical elevation.
3. **Rainbow Colored Nodes:** Instead of a cohesive, matte obsidian canvas suitable for a high-focus developer/architect tool (like **Linear**, **Raycast**, or **Clapet**), the nodes were styled as a carnival of distinct candy-colored tinted containers (`#121118` purple tint, `#0F141E` sky tint, `#0D1815` emerald tint, and `#1A140B` amber tint).
4. **Toy-Like Segmented Controls & Clashing Focus Rings:** Buttons in modals and drawers toggled between hot pink, neon blue, and bright purple, while form inputs changed border colors arbitrarily between purple, sky, emerald, and amber.

### 1.2 Target Benchmark: B2B Editorial Engineering Console
UX Logic Thread is an internal cognitive mapping console for Senior Product Designers and Frontend Architects to derive code specifications directly from qualitative research. It must embody:
- **Matte Obsidian Plane:** Deep, quiet, monochromatic void (`#08080A` to `#09090B`).
- **Unified Neutral Surfaces:** All cards, containers, and dialogs share a single, disciplined dark surface (`#121214` to `#18181B`).
- **Micro-Indicators Over Surface Slop:** Relational lineage tiers (Research, Feature, Sitemap, Token) are conveyed via **1px hairline rules and 1.5px calm micro-pips**, never by flooding entire containers with tinted pastel washes or neon glow halos.
- **Deep Occlusion Shadows:** Pure neutral ambient drop shadows (`rgba(0,0,0,0.6)` to `rgba(0,0,0,0.85)`), zero colored blur.

---

## 2. Comprehensive Inventory of "AI Slop" Findings

### 2.1 Slop Pattern Classification

| Category | Pattern Description | Visual Consequence | Severity |
| :--- | :--- | :--- | :--- |
| **A. Decorative Gradients** | `bg-gradient-to-r from-purple-600 to-indigo-600`, `bg-gradient-to-tr from-purple-600 to-indigo-500` | Looks like a cheap AI prompt wrapper; destroys visual seriousness. | **CRITICAL** |
| **B. Colored Glow Shadows** | `shadow-[0_0_20px_-3px_rgba(168,85,247,...)]`, `shadow-*-500/20` | Muddy neon halos around badges, cards, and buttons; ruins contrast. | **CRITICAL** |
| **C. Rainbow Node Fills** | Tinted card surfaces (`#121118`, `#0F141E`, `#0D1815`, `#1A140B`) + tinted headers/footers | Looks like a toy mindmap, visual noise overwhelms relational logic. | **CRITICAL** |
| **D. Neon Wires & Arrows** | Saturated colored edge arrows (`#818CF8`, `#34D399`, `#F59E0B`) | Cluttered canvas with jarring arrow contrast competing with nodes. | **MAJOR** |
| **E. Arbitrary Color Controls** | Pink, purple, and blue tab buttons; mismatched rainbow input focus rings | Lacks systemic design grammar; feels like disparate templates glued together. | **MAJOR** |
| **F. Cliché Arrow Icons** | Ubiquitous `→` (`ArrowRight`) on modal submit buttons | Empty decorative directional cliché violating minimalist UI guidelines. | **MINOR** |

---

### 2.2 File-by-File Line-Item Slop Log

#### 1. `src/components/ui/button.tsx`
- **Line 23–24 (CRITICAL):**
  ```tsx
  glow:
    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_-3px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_-3px_rgba(168,85,247,0.5)]',
  ```
  *Issue:* Multi-stop gradient combined with an aggressive double purple glow shadow. Total AI slop.
- **Lines 28–35 (CRITICAL):**
  ```tsx
  research: '... shadow-[0_0_12px_-2px_rgba(168,85,247,0.25)]',
  feature: '... shadow-[0_0_12px_-2px_rgba(14,165,233,0.25)]',
  sitemap: '... shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]',
  token: '... shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]',
  ```
  *Issue:* Colored fuzzy glow shadows on every tier action button.

#### 2. `src/components/ui/badge.tsx`
- **Lines 19–26 (CRITICAL):**
  ```tsx
  research: 'bg-purple-950/40 text-purple-300 border-purple-800/50 hover:bg-purple-900/40 shadow-[0_0_12px_-2px_rgba(168,85,247,0.25)]',
  feature: 'bg-sky-950/40 text-sky-300 border-sky-800/50 hover:bg-sky-900/40 shadow-[0_0_12px_-2px_rgba(14,165,233,0.25)]',
  sitemap: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]',
  token: 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40 shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]',
  ```
  *Issue:* Every status badge carries a radioactive colored box-shadow that creates visual fuzz on dark backgrounds.

#### 3. `src/components/ui/card.tsx`
- **Lines 20–26 (CRITICAL):**
  ```tsx
  research: 'bg-[#121118]/90 border-purple-900/40 hover:border-purple-700/60 shadow-[0_4px_24px_-4px_rgba(168,85,247,0.15)]',
  feature: 'bg-[#0C121E]/90 border-sky-900/40 hover:border-sky-700/60 shadow-[0_4px_24px_-4px_rgba(14,165,233,0.15)]',
  sitemap: 'bg-[#0C1714]/90 border-emerald-900/40 hover:border-emerald-700/60 shadow-[0_4px_24px_-4px_rgba(16,185,129,0.15)]',
  token: 'bg-[#17140D]/90 border-amber-900/40 hover:border-amber-700/60 shadow-[0_4px_24px_-4px_rgba(245,158,11,0.15)]',
  ```
  *Issue:* Four divergent tinted dark surfaces (`#121118`, `#0C121E`, `#0C1714`, `#17140D`) with colored borders and colored glow shadows.

#### 4. `src/components/canvas/nodes/ResearchNode.tsx`
- **Line 23–27 (CRITICAL):**
  ```tsx
  className={`... bg-[#121118]/90 ... ${
    selected
      ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-purple-500/20'
      : 'border-purple-900/40 hover:border-purple-700/60'
  }`}
  ```
  *Issue:* Purple-tinted background, neon purple border on selection, ring glow, and `shadow-purple-500/20`.
- **Line 30 & 69 (HIGH):**
  `bg-purple-950/20 border-purple-900/30` (header) and `bg-purple-950/10 border-purple-900/20` (footer) tinting the entire container.
- **Line 79 (HIGH):** `<Button variant="research">` introducing colored glow button.
- **Line 93 (MAJOR):** `!bg-purple-500` handle dot.

#### 5. `src/components/canvas/nodes/FeatureNode.tsx`
- **Line 23–27 (CRITICAL):**
  ```tsx
  className={`... bg-[#0F141E]/90 ... ${
    selected
      ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-sky-500/20'
      : 'border-sky-900/40 hover:border-sky-700/60'
  }`}
  ```
  *Issue:* Sky-tinted card background, neon sky active border, and `shadow-sky-500/20`.
- **Line 37 & 76 (HIGH):** Blue tinted header (`bg-sky-950/20`) and footer (`bg-sky-950/10`).
- **Line 33 & 100 (MAJOR):** `!bg-sky-500` handles.

#### 6. `src/components/canvas/nodes/SitemapNode.tsx`
- **Line 37–41 (CRITICAL):**
  ```tsx
  className={`... bg-[#0D1815]/90 ... ${
    selected
      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-emerald-500/20'
      : 'border-emerald-900/40 hover:border-emerald-700/60'
  }`}
  ```
  *Issue:* Emerald-green tinted background, neon green border, and `shadow-emerald-500/20`.
- **Line 51 & 98 (HIGH):** Green tinted header and footer.
- **Line 47 & 122 (MAJOR):** `!bg-emerald-500` handles.

#### 7. `src/components/canvas/nodes/TokenNode.tsx`
- **Line 22–26 (CRITICAL):**
  ```tsx
  className={`... bg-[#1A140B]/90 ... ${
    selected
      ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-amber-500/20'
      : 'border-amber-900/40 hover:border-amber-700/60'
  }`}
  ```
  *Issue:* Amber/brown muddy tinted background, neon amber selection border, and `shadow-amber-500/20`.
- **Line 36 & 79 (HIGH):** Amber tinted header and footer.
- **Line 73 (MAJOR):** `border-amber-900/30 text-amber-300/90` code box.
- **Line 83 (MAJOR):** `bg-amber-500 animate-pulse` pulsing yellow pip.

#### 8. `src/components/canvas/AIPromptExportDrawer.tsx`
- **Line 122–124 (CRITICAL):**
  ```tsx
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20">
    <Sparkles className="h-5 w-5" />
  </div>
  ```
  *Issue:* Archetypal AI Slop gradient icon tile with purple fuzzy glow.
- **Lines 153, 163, 173 (CRITICAL):**
  ```tsx
  targetTool === 'claude' ? 'bg-purple-600 text-white shadow-sm' : ...
  targetTool === 'cursor' ? 'bg-sky-600 text-white shadow-sm' : ...
  targetTool === 'figma'  ? 'bg-pink-600 text-white shadow-sm' : ...
  ```
  *Issue:* Saturated candy-colored tab buttons (purple, sky blue, hot pink) completely violating neutral developer tools design standards.
- **Lines 216, 225, 234 (MINOR):** `text-purple-400`, `selection:bg-purple-900/50`, `text-purple-400`.

#### 9. `src/components/canvas/AddNodeModal.tsx`
- **Lines 169, 183, 203, 215, 230, 251, 261, 285, 305, 318 (MAJOR):**
  ```tsx
  focus-visible:border-purple-500 focus-visible:ring-purple-500
  focus:border-sky-500 focus:ring-sky-500
  focus:border-emerald-500 focus:ring-emerald-500
  focus:border-amber-500 focus:ring-amber-500
  ```
  *Issue:* Arbitrary rainbow focus rings per form entity type, resulting in inconsistent form ergonomics.
- **Line 339 (MINOR):**
  `<ArrowRight className="h-3.5 w-3.5" />` decorative arrow slop.

#### 10. `src/components/canvas/MindMapCanvas.tsx`
- **Lines 166, 200, 233, 284 (MAJOR):**
  Edge Arrow Marker colors: `#818CF8` (indigo), `#34D399` (emerald), `#F59E0B` (amber).
  *Issue:* Rainbow edge arrows adding visual chaos.
- **Lines 414–422 (MAJOR):**
  MiniMap saturated color overrides (`#A855F7`, `#38BDF8`, `#34D399`, `#F59E0B`).

#### 11. `tailwind.config.js`
- **Lines 47–51 (CRITICAL):**
  Explicit definition of colored glow shadows:
  `glow-purple`, `glow-sky`, `glow-emerald`, `glow-amber`, `glow-sm`.

#### 12. `design/shadcn-design-system.md`
- **Lines 52–55 & 124–125 (CRITICAL):**
  Specification document legitimized `Glow Shadow` and `glow` gradient button variant, originating the implementation drift.

---

## 3. Strict Anti-Slop Design System Specification

### 3.1 The Matte Obsidian Foundation (Zinc Scale)

We transition 100% of the canvas chrome, containers, inputs, and overlays to a disciplined, low-chroma **Matte Obsidian** palette based on the Tailwind Zinc scale:

| Level | Token Role | Hex Code | Tailwind Class | Usage / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | **Void / Canvas Ground** | `#09090B` | `bg-zinc-950` / `bg-[#09090B]` | The deepest infinite backdrop plane. Pure matte, zero gradient. |
| **L1** | **Matte Obsidian Surface** | `#121214` | `bg-[#121214]` | **Universal node container background**. All 4 node types use this EXACT same surface. |
| **L2** | **Elevated Panels & Toolbars** | `#18181B` | `bg-zinc-900` / `bg-[#18181B]` | Top bar, bottom dock, modal dialogs, slide-over drawer body. |
| **L3** | **Interactive Elements** | `#27272A` | `bg-zinc-800` | Segmented tab active state, hover fills, subtle button backgrounds. |
| **B1** | **Structural Hairline Border** | `#27272A` | `border-zinc-800` | Standard 1px crisp rule for all idle cards, inputs, and dividers. |
| **B2** | **Hover / Focused Border** | `#3F3F46` | `border-zinc-700` | 1px hover feedback on cards, interactive buttons, and inactive tabs. |
| **B3** | **Selected Node Ring** | `#FAFAFA` | `border-zinc-100` / `ring-1 ring-zinc-400` | **High-contrast monochrome focus**. Never neon colored blur! |
| **T1** | **Primary Typography** | `#FAFAFA` | `text-zinc-50` / `text-zinc-100` | Node titles, header brand, high-contrast action text. |
| **T2** | **Secondary Typography** | `#A1A1AA` | `text-zinc-400` | Node descriptions, quotes, form labels. |
| **T3** | **Muted Metadata** | `#71717A` | `text-zinc-500` | IDs, timestamps, lineage depth indicators. |

---

### 3.2 Pure Ambient Occlusion Shadows (Zero Colored Blur)

All colored box shadows (`rgba(168, 85, 247, ...)`, `shadow-*-500/*`) are strictly abolished. We use purely physical optical ambient occlusion:

```css
/* Card resting shadow */
box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.7);

/* Dialog & Drawer elevated shadow */
box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.85);

/* Selected node focus */
box-shadow: 0 0 0 1px #3F3F46, 0 8px 30px -4px rgba(0, 0, 0, 0.8);
```

---

### 3.3 The 1px Functional Micro-Indicator System

Rather than slathering the entire card in colored tints, lineage tiering is conveyed through **quiet 1px micro-indicators**:

```
+--------------------------------------------------------------+
| [●] 01 · RESEARCH                        [src: interview-04] | <── 1px hairline border-b border-zinc-800/80
+--------------------------------------------------------------+     Header is bg-zinc-900/40 (neutral dark)
|                                                              |
|   "Users abandon checkout because sticky banner covers..."   | <── Surface is matte #121214 (identical on all nodes)
|                                                              |
+--------------------------------------------------------------+
| [Root Lineage]                          [ + Map Feature ]    | <── Footer is neutral bg-zinc-950/40
+--------------------------------------------------------------+
```

#### Micro-Indicator Tier Rules:
1. **01 · Research:**
   - Indicator Pip: `w-1.5 h-1.5 rounded-full bg-purple-400`
   - Badge: `bg-zinc-900 text-zinc-300 border-zinc-800` (neutral badge containing the colored pip)
   - Connection Handle: `bg-zinc-400 hover:bg-purple-400 border-2 border-[#09090B]`
2. **02 · Feature:**
   - Indicator Pip: `w-1.5 h-1.5 rounded-full bg-sky-400`
   - Badge: `bg-zinc-900 text-zinc-300 border-zinc-800`
   - Connection Handle: `bg-zinc-400 hover:bg-sky-400 border-2 border-[#09090B]`
3. **03 · Sitemap:**
   - Indicator Pip: `w-1.5 h-1.5 rounded-full bg-emerald-400`
   - Badge: `bg-zinc-900 text-zinc-300 border-zinc-800`
   - Connection Handle: `bg-zinc-400 hover:bg-emerald-400 border-2 border-[#09090B]`
4. **04 · UI Token:**
   - Indicator Pip: `w-1.5 h-1.5 rounded-full bg-amber-400`
   - Badge: `bg-zinc-900 text-zinc-300 border-zinc-800`
   - Code Token Box: `bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px]` (neutral dark container with mono styling)

---

## 4. Remediation Action Plan & Code Blueprints

### Blueprint 1: Cleaned Base Primitives

#### A. `src/components/ui/button.tsx`
- **Action:** Delete `glow` variant entirely. Strip all colored drop shadows from `research`, `feature`, `sitemap`, `token`.
- **Replacement Code:**
```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-all duration-150 outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 focus-visible:ring-1 focus-visible:ring-zinc-400',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-950 font-medium hover:bg-white active:bg-zinc-200 shadow-sm',
        subtle:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700',
        secondary:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700',
        outline:
          'bg-transparent border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white',
        ghost:
          'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
        icon:
          'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
        destructive:
          'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/50 hover:text-red-100',
        // Clean Micro-Buttons for Canvas Actions (Monochrome with subtle border)
        research:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white',
        feature:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white',
        sitemap:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white',
        token:
          'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white',
      },
      size: {
        default: 'h-9 px-4 py-2 gap-2',
        sm: 'h-7 px-2.5 text-[11px] rounded-md gap-1.5',
        lg: 'h-10 px-5 text-sm rounded-xl gap-2.5',
        icon: 'h-8 w-8 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

#### B. `src/components/ui/badge.tsx`
- **Action:** Strip all `shadow-[0_0_12px_-2px_rgba(...)]`. Standardize on matte zinc badge with 1.5px color pip.
- **Replacement Code:**
```tsx
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide border transition-colors select-none',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-800 text-zinc-100 border-zinc-700',
        secondary:
          'bg-zinc-900 text-zinc-400 border-zinc-800',
        outline:
          'border-zinc-800 text-zinc-400 bg-transparent',
        destructive:
          'bg-red-950/40 text-red-300 border-red-800/50',
        // Matte badges with high optical clarity
        research:
          'bg-zinc-900 text-zinc-300 border-zinc-800',
        feature:
          'bg-zinc-900 text-zinc-300 border-zinc-800',
        sitemap:
          'bg-zinc-900 text-zinc-300 border-zinc-800',
        token:
          'bg-zinc-900 text-zinc-300 border-zinc-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

#### C. `src/components/ui/card.tsx`
- **Action:** Unify all card variants to `#121214` surface and pure black drop shadow.
- **Replacement Code:**
```tsx
const cardVariants = cva(
  'rounded-xl border transition-all duration-150 text-zinc-100',
  {
    variants: {
      variant: {
        default:
          'bg-[#121214] border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)]',
        elevated:
          'bg-[#18181B] border-zinc-700/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.85)]',
        subtle:
          'bg-zinc-950 border-zinc-800/60',
        interactive:
          'bg-[#121214] border-zinc-800 hover:border-zinc-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)] cursor-pointer',
        // All nodes share identical matte obsidian surface with neutral 1px border
        research:
          'bg-[#121214] border-zinc-800 hover:border-zinc-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)]',
        feature:
          'bg-[#121214] border-zinc-800 hover:border-zinc-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)]',
        sitemap:
          'bg-[#121214] border-zinc-800 hover:border-zinc-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)]',
        token:
          'bg-[#121214] border-zinc-800 hover:border-zinc-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

---

### Blueprint 2: Node Components Remediation

All 4 node components (`ResearchNode`, `FeatureNode`, `SitemapNode`, `TokenNode`) share the unified anti-slop node container structure:

```tsx
<div
  className={`group relative min-w-[280px] max-w-[340px] rounded-xl bg-[#121214] border transition-all duration-150 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.7)] ${
    selected
      ? 'border-zinc-400 ring-1 ring-zinc-400/30'
      : 'border-zinc-800 hover:border-zinc-700'
  }`}
>
  {/* Header: Neutral bg-zinc-900/50 with 1px hairline border */}
  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/40 rounded-t-xl">
    <Badge variant="research" className="gap-1.5 border-zinc-800">
      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
      <span className="font-mono text-[10px] uppercase text-zinc-300">01 · Research Insight</span>
    </Badge>
    {/* Clean ghost delete button */}
  </div>

  {/* Body */}
  <div className="p-3.5">
    ...
  </div>

  {/* Footer: Neutral bg-zinc-950/40 */}
  <div className="px-3.5 py-2 border-t border-zinc-800/60 bg-zinc-950/40 rounded-b-xl flex items-center justify-between">
    <span className="text-[10px] font-mono text-zinc-500">Root Lineage</span>
    <Button variant="subtle" size="sm" className="h-6 px-2 text-[10px]">
      <Plus className="h-3 w-3" />
      <span>Map Feature</span>
    </Button>
  </div>

  {/* Handles: Crisp monochrome pin with high contrast */}
  <Handle
    type="source"
    position={Position.Right}
    className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-[#09090B] hover:!bg-white !transition-colors"
  />
</div>
```

---

### Blueprint 3: AIPromptExportDrawer Remediation

- **Header Icon Tile (Line 122):**
  - *Current Slop:* `bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20`
  - *Remediation:* `bg-zinc-800 border border-zinc-700/80 text-zinc-100 rounded-lg shadow-sm`
- **Target Agent Segmented Tabs (Lines 148–179):**
  - *Current Slop:* Rainbow buttons (`bg-purple-600`, `bg-sky-600`, `bg-pink-600`).
  - *Remediation:* Modern monochrome segmented control:
    ```tsx
    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
      {(['claude', 'cursor', 'figma'] as const).map((tool) => (
        <button
          key={tool}
          onClick={() => setTargetTool(tool)}
          className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
            targetTool === tool
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {tool === 'claude' && 'Claude 3.7 / 3.5'}
          {tool === 'cursor' && 'Cursor IDE'}
          {tool === 'figma' && 'Figma MCP'}
        </button>
      ))}
    </div>
    ```
- **Terminal Icon & Footer Bot Icon:** Change `text-purple-400` to `text-zinc-400`.
- **Text Selection:** Change `selection:bg-purple-900/50` to `selection:bg-zinc-700/60`.

---

### Blueprint 4: AddNodeModal Form Controls Remediation

- **Input & Textarea Focus Rings (Lines 169, 183, 203, etc.):**
  - *Current Slop:* Mismatched per-type rainbow rings (`ring-purple-500`, `ring-sky-500`, `ring-emerald-500`, `ring-amber-500`).
  - *Remediation:* Standardize 100% of inputs to our zero-shift architecture:
    `focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30`
- **Modal Header Badge:** Neutral badge with the 1.5px tier pip.
- **Action Buttons:** Remove `ArrowRight` icon from "Add Node to Canvas". Keep copy concise: "Add to Canvas".

---

### Blueprint 5: MindMapCanvas Edge Lines & MiniMap Remediation

- **Marker Arrow Colors (Lines 166, 200, 233, 284):**
  - Change saturated rainbow arrows (`#818CF8`, `#34D399`, `#F59E0B`) to unified calm monochromatic arrows:
    `color: '#71717A'` (Zinc-500).
- **MiniMap Node Colors (Lines 414–422):**
  - Use calm, de-saturated tones:
    - Research: `#A855F7`
    - Feature: `#38BDF8`
    - Sitemap: `#34D399`
    - Token: `#F59E0B`
  - MiniMap background: `!bg-[#121214] !border !border-zinc-800`.

---

### Blueprint 6: Tailwind Configuration Cleanup (`tailwind.config.js`)

Remove all `glow-*` shadow utilities from `theme.extend.boxShadow`:
```javascript
boxShadow: {
  'surface-card': '0 4px 20px -4px rgba(0, 0, 0, 0.7)',
  'surface-elevated': '0 12px 32px -8px rgba(0, 0, 0, 0.85)',
},
```

---

## 5. Verification Checklist & Implementation Phasing

| Phase | Target Scope | Key Verification Gate |
| :--- | :--- | :--- |
| **Phase 1** | Base Design System & Primitives (`tailwind.config.js`, `button.tsx`, `badge.tsx`, `card.tsx`) | Zero `bg-gradient-to-*`, zero `shadow-*-500`, zero colored glow strings remaining in base primitives. |
| **Phase 2** | Canvas Nodes (`ResearchNode`, `FeatureNode`, `SitemapNode`, `TokenNode`) | All 4 nodes render with identical `#121214` surface; tiering distinguished solely by 1px micro-pips; selection uses high-contrast monochrome border. |
| **Phase 3** | Canvas Wires & MiniMap (`MindMapCanvas.tsx`, `ThreadEdge.tsx`) | Edge arrows render in uniform `#71717A`; canvas grid dots sit cleanly on `#09090B`. |
| **Phase 4** | Overlays & Controls (`AIPromptExportDrawer.tsx`, `AddNodeModal.tsx`) | Export drawer segmented buttons render in matte zinc; form inputs have uniform `zinc-500` focus ring; zero decorative arrow icons. |

---

## 6. Handoff Summary to Head of Product
This audit and specification report provides the exact, file-by-file blueprint required to eradicate all "AI Slop" from UX Logic Thread. Upon approval, our engineering and design team can execute this remediation plan in under 30 minutes, elevating the application to the high-density, matte obsidian benchmark set by **Linear** and **Raycast**.
