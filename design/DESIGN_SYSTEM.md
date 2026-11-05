# UX Logic Thread — Technical Design System Specification
## Implementation Guide for React 19 & Tailwind CSS (Monochromatic B2B Standard)

> **Document Status:** Authoritative Technical Specification  
> **Product:** UX Logic Thread (Traceability Mapper)  
> **Target Stack:** React 19, Tailwind CSS 3.4+, @xyflow/react, Lucide Icons  
> **Companion Document:** `d:\MindMap\design\STYLE_GUIDE.md`

---

## 1. System Architecture & Token Definitions

All UI surfaces in UX Logic Thread are governed by a strictly disciplined, monochromatic token structure. No third-party color scales or arbitrary hex values may be introduced.

### 1.1 Color Tokens Table

```
Canvas Base (#09090B) 
  └─► Panel / Node Surface (#121214) 
        └─► Elevated / Hover Surface (#18181B)
              └─► Crisp 1px Border (#27272A ➔ #3F3F46 ➔ #52525B)
```

| Token Name | Hex Value | CSS Variable | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Base** | `#09090B` | `--canvas-base` | `bg-obsidian` / `bg-[#09090B]` | Main canvas viewport, body background, code block interiors |
| **Panel Surface** | `#121214` | `--surface-panel` | `bg-surface` / `bg-[#121214]` | Canvas nodes, dialog windows, bottom dock, top chrome |
| **Surface Elevated** | `#18181B` | `--surface-elevated`| `bg-surface-elevated` / `bg-[#18181B]` | Hovered node cards, dropdown menus, button hovers, tab active |
| **Border Default** | `#27272A` | `--border-subtle` | `border-border` / `border-[#27272A]` | Standard 1px crisp rule for all cards, dividers, and docks |
| **Border Hover** | `#3F3F46` | `--border-hover` | `border-border-hover` / `border-[#3F3F46]` | Hover state for interactive nodes, inputs, and buttons |
| **Border Active** | `#52525B` | `--border-active` | `border-border-active` / `border-[#52525B]` | Selected canvas nodes, focused input borders, active edge wires |
| **Text Primary** | `#FAFAFA` | `--text-primary` | `text-foreground` / `text-[#FAFAFA]` | Headers, modal titles, selected button text, node headings |
| **Text Secondary** | `#A1A1AA` | `--text-secondary` | `text-foreground-secondary` / `text-[#A1A1AA]` | Body descriptions, insight quotes, input labels |
| **Text Muted** | `#71717A` | `--text-muted` | `text-foreground-muted` / `text-[#71717A]` | Lineage metadata, node index indicators (`01 / RESEARCH`), timestamps |
| **Action Solid White** | `#FFFFFF` | `--action-primary` | `bg-white text-zinc-950` | Primary call to action ("Export AI Context", "Add Root Insight") |

### 1.2 Micro-Indicators (Status Only)
- **Live Sync Active:** `#10B981` (6px dot: `h-1.5 w-1.5 rounded-full bg-emerald-500`)
- **Local Engine / Offline:** `#71717A` (6px dot: `h-1.5 w-1.5 rounded-full bg-zinc-500`)
- **Destructive Action:** `#EF4444` (icon hover only: `text-zinc-500 hover:text-red-400 hover:bg-red-950/40`)

---

## 2. Updated Tailwind Configuration

Replace `tailwind.config.js` with the clean, production-grade configuration below:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#09090B',
        background: '#09090B',
        surface: {
          DEFAULT: '#121214',
          elevated: '#18181B',
          hover: '#222226',
        },
        border: {
          DEFAULT: '#27272A',
          hover: '#3F3F46',
          active: '#52525B',
        },
        foreground: {
          DEFAULT: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'dock': '0 8px 32px -4px rgba(0, 0, 0, 0.85)',
        'drawer': '-8px 0 32px -4px rgba(0, 0, 0, 0.85)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out forwards',
        'fade-out': 'fade-out 150ms ease-in forwards',
        'slide-in-right': 'slide-in-right 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
```

---

## 3. UI Component Primitives (`src/components/ui/`)

### 3.1 Button Component (`button.tsx`)
Banish all gradient variants (`variant="glow"`) and tier rainbow buttons (`variant="research"`, etc.).

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        // Primary High-Contrast Linear Style
        default:
          'bg-white text-zinc-950 font-medium hover:bg-zinc-200 shadow-sm',
        // Secondary Matte Dark
        secondary:
          'bg-zinc-800 text-zinc-200 border border-zinc-700/60 hover:bg-zinc-700 hover:text-white',
        // Outline Hairline
        outline:
          'bg-transparent border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-white',
        // Ghost Minimalist
        ghost:
          'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
        // Destructive
        destructive:
          'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/50 hover:text-red-100',
      },
      size: {
        default: 'h-8 px-3.5 py-1.5 gap-1.5',
        sm: 'h-7 px-2.5 text-[11px] rounded-md gap-1',
        lg: 'h-9 px-4 text-xs rounded-lg gap-2',
        icon: 'h-8 w-8 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);
```

### 3.2 Badge Component (`badge.tsx`)
Replaces rainbow pill badges with calm, monochromatic indicators:

```tsx
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
        secondary: 'bg-zinc-900 text-zinc-400 border-zinc-800',
        outline: 'border-zinc-800 text-zinc-400 bg-transparent',
        nodeTier: 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

### 3.3 Card Component (`card.tsx`)
Replaces rainbow-tinted cards with uniform `#121214` matte cards:

```tsx
const cardVariants = cva(
  'rounded-xl border transition-colors bg-[#121214] text-zinc-100 shadow-panel',
  {
    variants: {
      variant: {
        default: 'border-zinc-800',
        elevated: 'bg-[#18181B] border-zinc-700/80',
        interactive: 'border-zinc-800 hover:border-zinc-700 cursor-pointer',
        selected: 'border-zinc-400 ring-1 ring-zinc-400/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

---

## 4. Canvas Node Component Architecture

All 4 nodes share identical outer geometry, ensuring the canvas looks disciplined and unified. Differences are expressed purely through content structure and micro-indicators.

### 4.1 Common Structural Template (ASCII Schema)
```
+───────────────────────────────────────────────────────────+  <- min-w-[280px] max-w-[340px]
| ● 01 / RESEARCH                                     [ 🗑 ] |  <- Header (px-3.5 py-2.5, border-b)
+───────────────────────────────────────────────────────────+
|                                                           |
| "Users abandon checkout due to hidden shipping fees..."   |  <- Content (p-3.5)
|                                                           |
| src: User Research Sprint #2                              |
|                                                           |
+───────────────────────────────────────────────────────────+
| Root Lineage                           [ + Map Feature ]  |  <- Footer (px-3.5 py-2, border-t)
+───────────────────────────────────────────────────────────+
(Handle: Left Target)                   (Handle: Right Source)
```

### 4.2 ResearchNode (`src/components/canvas/nodes/ResearchNode.tsx`)
- **Card Shell:** `bg-[#121214] border border-zinc-800 hover:border-zinc-700 rounded-xl shadow-panel`
- **Selected State:** `border-zinc-400 ring-1 ring-zinc-400/20`
- **Header:** `px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between`
- **Indicator:** `<span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />`
- **Label:** `<span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">01 / RESEARCH</span>`
- **Content:** `<p className="text-xs text-zinc-200 leading-relaxed font-sans line-clamp-4">“{insight_text}”</p>`
- **Source Meta:** `<div className="mt-2.5 text-[10px] font-mono text-zinc-500">src: {source}</div>`
- **Footer Action:** Secondary button `+ Map Feature`
- **Handle:** Output handle on right, `!w-2.5 !h-2.5 !bg-zinc-500 !border-2 !border-[#121214] hover:!bg-zinc-300`

### 4.3 FeatureNode (`src/components/canvas/nodes/FeatureNode.tsx`)
- **Indicator & Label:** `<span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />` + `02 / FEATURE`
- **Content:** `<h4 className="text-sm font-semibold text-zinc-100">{feature_name}</h4>`
- **Description:** `<p className="mt-1.5 text-xs text-zinc-400 line-clamp-3">{description}</p>`
- **Footer Action:** Secondary button `+ Add Screen`
- **Handles:** Left target handle & Right source handle

### 4.4 SitemapNode (`src/components/canvas/nodes/SitemapNode.tsx`)
- **Indicator & Label:** `<span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />` + `03 / SITEMAP`
- **Content:** `<span className="text-xs font-mono text-zinc-500">Screen / Page:</span>` + `<h4 className="text-sm font-semibold text-zinc-100">{page_name}</h4>`
- **Hierarchy Zone Tag:** `bg-zinc-800 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700/60`
- **Footer Action:** Secondary button `+ Bind Token`

### 4.5 TokenNode (`src/components/canvas/nodes/TokenNode.tsx`)
- **Indicator & Label:** `<span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />` + `04 / TOKEN`
- **Content:** `<Box className="h-3.5 w-3.5 text-zinc-400" />` + `<h4 className="text-sm font-mono font-semibold text-zinc-100">&lt;{component_type} /&gt;</h4>`
- **Token Spec Box:** Monospace styling `bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono p-2 rounded`

---

## 5. Thread Edge (Relational Connector Wires)

The relational wires connecting nodes must remain understated so that complex webs do not overpower readability.

### 5.1 Color and Weight Specs
- **Default Stroke:** `#52525B` (Zinc-600)
- **Default Width:** `1px`
- **Selected Stroke:** `#FAFAFA` (Zinc-50)
- **Selected Width:** `1.5px`
- **Arrow Marker:** `MarkerType.ArrowClosed`, color `#52525B` (or `#FAFAFA` when active), width 12px, height 12px.
- **Animation:** Enabled (`animated: true`) for active lineage flow, with subtle muted pulse.

---

## 6. Canvas Chrome (Top Bar, Bottom Dock, Export Drawer)

### 6.1 Top Bar (`CanvasTopBar.tsx`)
1. **Left Brand Pill:**
   - Background: `bg-[#121214]/90 backdrop-blur-md border border-zinc-800 px-3.5 py-2 rounded-xl`
   - Icon: Solid slate container `bg-zinc-800 border border-zinc-700/60 text-zinc-200 p-1.5 rounded-lg`
   - Title: `text-xs font-semibold text-zinc-100` + `text-[10px] font-mono text-zinc-400`
2. **Center Pipeline Stats:**
   - Displays count progression: `[Res 4] ➔ [Feat 3] ➔ [Site 3] ➔ [Tok 4]`
   - Badges: Monochromatic `bg-zinc-800 text-zinc-200 border-zinc-700`
3. **Right Action Suite:**
   - Auto Layout: `bg-[#121214] text-zinc-300 border-zinc-800 hover:border-zinc-700`
   - Fit View & Reset: Icon buttons `h-8 w-8 text-zinc-400 hover:text-white`
   - **Export AI Context:** `bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm`

### 6.2 Bottom Dock (`CanvasBottomDock.tsx`)
- Position: `fixed bottom-6 left-1/2 -translate-x-1/2`
- Container: `bg-[#121214]/90 backdrop-blur-md border border-zinc-800 px-2.5 py-1.5 rounded-xl shadow-dock`
- Buttons: 4 node add buttons (`+ Research`, `+ Feature`, `+ Sitemap`, `+ Token`), each containing a `w-1.5 h-1.5 rounded-full bg-zinc-400` indicator.

### 6.3 AI Context Export Drawer (`AIPromptExportDrawer.tsx`)
- Container: `bg-[#121214] border-l border-zinc-800 max-w-2xl`
- Target Selector: Monochromatic segmented toggle (`Claude 3.7 / 3.5`, `Cursor IDE`, `Figma MCP`)
- Copy Button: Primary solid white button (`bg-white text-zinc-950 hover:bg-zinc-200`) or emerald confirmation when copied.

---

## 7. Migration Checklist for Engineering

Lead React Engineer and contributors must verify the following items:

- [x] Create and adopt `STYLE_GUIDE.md` & `DESIGN_SYSTEM.md`.
- [ ] Update `tailwind.config.js` to eliminate rainbow tiers and define monochromatic tokens.
- [ ] Ensure `index.css` sets canvas background to `#09090B`.
- [ ] Clean `button.tsx` to remove `variant="glow"` and colored tier variants; define high-contrast solid white `default`.
- [ ] Clean `badge.tsx` to remove rainbow shadows; provide `nodeTier` variant.
- [ ] Clean `card.tsx` to remove rainbow backgrounds (`#121118`, `#0C121E`, etc.) in favor of uniform `#121214`.
- [ ] Verify `npm run build` exits with code 0 without any TypeScript or unused import warnings.

---
*UX Logic Thread Design System — Official Implementation Reference.*
