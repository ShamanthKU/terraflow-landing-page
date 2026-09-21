# TerraFlow AI — Design System & Brand Guidelines (CANONICAL)

> **IMPORTANT**: This document is the single source of truth for TerraFlow AI brand identity, landing page aesthetics, and application interfaces. All previous "Gold/Luxury" themes (`#C5A059`, `#A6864B`) are completely deprecated and prohibited. The canonical design system embodies a clean, data-centric aesthetic with Mint & Snow (Light Mode) and Deep Sea & Cyan (Dark Mode).

---

## 1. Brand Identity & Overview

- **Brand Name:** TerraFlow AI
- **Tagline:** Unified Real Estate Intelligence
- **Brand Personality:** Professional · Clean · High-Efficiency · Trustworthy
- **Tone:** Modern, crisp, and data-centric.

### Logo Wordmark Styling
- **`Terra`**: Styled in the primary brand accent (`#00B36E` in light mode, `#2DD4BF` in dark mode).
- **`Flow AI`**: Styled in the default text foreground color (`#2D3436` in light mode, `#E5EAF3` in dark mode).
- **Wordmark Typography:** **Lato Black (900)**
  ```css
  font-family: 'Lato', sans-serif;
  font-weight: 900;
  ```

---

## 2. Color Palettes & Tokens

The design system is built using CSS HSL variables and Tailwind CSS utility classes, supporting seamless dual light/dark themes.

### 🟢 Light Mode Theme ("Mint & Snow")
*Optimized for peak readability during daytime use with high contrast, crisp typography, and fresh mint accents.*

| Token | HSL Value | Hex Equivalent | Usage / Purpose |
| :--- | :--- | :--- | :--- |
| `background` | `225 33% 97%` | `#F4F7FA` | Primary page & app background |
| `card` | `0 0% 100%` | `#FFFFFF` | Dashboard card surfaces, elevated panels |
| `primary` | `160 100% 35%` | `#00B36E` | Primary mint green accent, primary CTAs, success states |
| `secondary` | `207 70% 53%` | `#3B82F6` | Royal blue secondary accent, links, highlights |
| `foreground` | `195 10% 20%` | `#2D3436` | Primary body text & headings |
| `muted-foreground` | `206 7% 39%` | `#5C666E` | Secondary/subtle body text, captions |
| `border` / `input` | `212 43% 93%` | `#E5EAF3` | Card borders, dividers, input borders |

---

### 🔵 Dark Mode Theme ("Deep Sea & Cyan")
*Engineered for low eyestrain during prolonged visualization of real-estate lead pipelines, maps, and analytics.*

| Token | HSL Value | Hex Equivalent | Usage / Purpose |
| :--- | :--- | :--- | :--- |
| `background` | `213 20% 7%` | `#0B0E14` | Deep slate page background (not pure void black) |
| `card` | `213 20% 11%` | `#151A23` | Dark surface cards, modular containers |
| `primary` | `188 64% 48%` | `#2DD4BF` | Electric cyan/teal primary accent & CTAs |
| `secondary` | `207 70% 53%` | `#3B82F6` | Royal blue secondary accent |
| `foreground` | `212 43% 93%` | `#E5EAF3` | Primary body text (soft readable white) |
| `muted-foreground` | `212 15% 65%` | `#97A3B6` | Secondary body text, metadata |
| `border` / `input` | `214 12% 20%` | `#2D333E` | Dark subtle borders & input strokes |

---

### 🚦 Task Priorities & Indicator Accents

| Priority Level | HSL Value | Hex Equivalent | Indicator |
| :--- | :--- | :--- | :--- |
| **High Priority / Urgency** | `hsl(358, 100%, 67%)` | `#FF5757` | High urgency lead flags, SLA breach warnings |
| **Medium Priority** | `hsl(15, 76%, 63%)` | `#F37A4F` | In-progress follow-ups, pending responses |
| **Low Priority / Neutral** | `hsl(210, 3%, 40%)` | `#63696F` | Archived leads, static metadata, slate grey tags |

---

### ❌ Deprecated Colors (Strictly Prohibited)

- **`#C5A059` & `#A6864B` (Gold / Luxury Theme)**: Completely deprecated and removed from the brand. Never introduce gold gradients, borders, or accents.
- **`#000000` (Pure Black Void)**: Replaced by deep slate `#0B0E14` for card/background visual balance.

---

## 3. Typography & Font Hierarchy

The TerraFlow AI brand employs a structured three-typeface hierarchy tailored for editorial impact, geometric precision, and day-to-day readability:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. NEWSREADER (Editorial Serif)                             │
│    Left-hand Hero Headline & Editorial Pull Quotes          │
├─────────────────────────────────────────────────────────────┤
│ 2. PLUS JAKARTA SANS (Geometric Sans-Serif)                 │
│    Hero Subheadings, Stat Badges, Metrics & UI Card Headers │
├─────────────────────────────────────────────────────────────┤
│ 3. LATO (Default Brand Sans-Serif)                          │
│    Global UI, Form Inputs, Buttons, Body Copy & Footers     │
└─────────────────────────────────────────────────────────────┘
```

### 1. Newsreader (Editorial Serif)
- **Role:** Main landing page hero headline (*"Close More Deals. Without Chasing Every Lead."*), storytelling pull quotes, and major editorial statements.
- **CSS Class:** `.font-editorial` or `font-serif`
- **Definition:**
  ```css
  font-family: 'Newsreader', Georgia, serif;
  ```
- **Weights & Styles:**
  - Regular (`400`)
  - Italic (`400`) — used for stylistic emphasis on key words (e.g., *Without Chasing*)
  - Medium (`500`)

### 2. Plus Jakarta Sans (Modern Geometric Sans-Serif)
- **Role:** Hero subheadings, category pill badges, high-impact numerical metrics (`14-Day`, `24/7`, `3.8x`, `99.4%`), and card UI headings.
- **Definition:**
  ```css
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  ```
- **Weights:**
  - `400` (Regular)
  - `500` (Medium)
  - `600` (SemiBold)
  - `700` (Bold)
  - `800` (ExtraBold)

### 3. Lato (Default Brand Sans-Serif)
- **Role:** The foundational brand sans-serif used across body text, form inputs, business email/password labels, buttons (*"Sign In to Workspace"*), data tables, and legal footers.
- **CSS Variable / Stack:**
  ```css
  font-family: var(--font-lato), 'Lato', sans-serif;
  ```
- **Weights:**
  - Regular (`400`) & Medium (`500`) for body paragraphs and descriptions.
  - Bold (`700`) & Black (`900`) for button labels, section tags, and wordmarks.

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
```

---

### Type Scale Standards

| Role | Tailwind Classes | Typical Usage |
| :--- | :--- | :--- |
| **Editorial Hero Headline** | `.font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight` | Landing page hero left headline |
| **Page / Section Title** | `text-3xl font-bold tracking-tight text-foreground font-sans` | Standard page headers |
| **Card UI Header** | `font-semibold text-lg text-foreground` (Plus Jakarta Sans) | Interactive card titles |
| **Section Eyebrow / Tag** | `text-[10px] font-black uppercase tracking-widest text-primary` | Category tags & badges |
| **Metric Value** | `text-2xl sm:text-3xl font-extrabold text-foreground` (Plus Jakarta Sans) | KPI metrics & statistics |
| **Body Paragraph** | `text-sm sm:text-base text-muted-foreground leading-relaxed` (Lato) | Descriptive narrative text |
| **Input / Button Label** | `text-sm font-semibold tracking-wide` (Lato) | Form inputs, CTA buttons |

---

## 4. UI Component Standards

### Cards & Panels
- **Container:** `bg-card border border-border rounded-2xl`
- **Hover Interaction:** Smooth transition with subtle border highlight (`hover:border-primary/40 transition-all duration-200`).
- **Shadows:** Subtle ambient shadow (`shadow-sm` or `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` in Light Mode; soft glow border in Dark Mode).

### Buttons
- **Primary CTA:**
  ```html
  <button class="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
    Get Started Free
  </button>
  ```
- **Secondary Action:**
  ```html
  <button class="bg-secondary text-white font-semibold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors">
    Explore Platform
  </button>
  ```
- **Outline / Ghost Button:**
  ```html
  <button class="border border-primary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary/10 transition-colors">
    Book Demo
  </button>
  ```

### Form Inputs
- **Base Style:**
  ```html
  <input class="w-full bg-card border border-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
  ```

---

## 5. CSS Variables Reference

Place the following tokens inside your CSS root (`globals.css`):

```css
:root {
  /* Light Mode ("Mint & Snow") */
  --background: 225 33% 97%;
  --foreground: 195 10% 20%;
  --card: 0 0% 100%;
  --card-foreground: 195 10% 20%;
  --primary: 160 100% 35%;
  --primary-foreground: 0 0% 100%;
  --secondary: 207 70% 53%;
  --secondary-foreground: 0 0% 100%;
  --muted: 212 43% 93%;
  --muted-foreground: 206 7% 39%;
  --border: 212 43% 93%;
  --input: 212 43% 93%;
  --ring: 160 100% 35%;
}

.dark {
  /* Dark Mode ("Deep Sea & Cyan") */
  --background: 213 20% 7%;
  --foreground: 212 43% 93%;
  --card: 213 20% 11%;
  --card-foreground: 212 43% 93%;
  --primary: 188 64% 48%;
  --primary-foreground: 213 20% 7%;
  --secondary: 207 70% 53%;
  --secondary-foreground: 0 0% 100%;
  --muted: 214 12% 20%;
  --muted-foreground: 212 15% 65%;
  --border: 214 12% 20%;
  --input: 214 12% 20%;
  --ring: 188 64% 48%;
}
```

---

## 6. Brand Consistency Checklist (Strict Compliance)

- [ ] **No Gold Artifacts:** Ensure zero usage of `#C5A059`, `#A6864B`, or amber/gold gradients.
- [ ] **No Void Black:** Confirm `#000000` is replaced with `--background` (`#0B0E14` in dark mode).
- [ ] **Hero Headline:** Rendered using Newsreader Editorial Serif (`.font-editorial` / `font-serif`).
- [ ] **Hero Subtitles & Metrics:** Rendered using Plus Jakarta Sans.
- [ ] **Body & Form Inputs:** Rendered using Lato.
- [ ] **Logo Wordmark:** Displays `Terra` in primary green/cyan and `Flow AI` in foreground text with Lato 900.
- [ ] **CTA Buttons:** Follow strict primary mint (`#00B36E` light / `#2DD4BF` dark) styling.

---

*Owner: Shamanth (Founder, TerraFlow AI)*  
*Version: 2.0 (Canonical Brand System)*
