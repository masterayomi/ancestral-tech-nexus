# Knowledge Bridge Africa: UI/UX Design System

## 1. Visual Identity

### Color Palette
- **Primary (Emerald):** `#064e3b` (Emerald 950). Represents growth, lush terrain, and continental stability.
- **Accent (Amber):** `#f59e0b` (Amber 500). Represents wisdom, history, and the African sun.
- **Base (Stone):** Warm grays/stones (`#fafaf9` to `#1c1917`). Represents the earth and provides a readable, high-contrast background.

### Typography
- **Headings:** `Playfair Display` (Serif). Used for titles and headers to convey authority and historical depth.
- **Body:** `Inter` (Sans-serif). Used for body text, UI elements, and data for maximum legibility and modern feel.

---

## 2. Layout & Spacing

### The 8-Point System
All spatial dimensions (margins, padding, gap, height, width) must be multiples of 8px.
- **Standard Padding:** `p-8` (32px), `p-4` (16px).
- **Standard Margins:** `mb-8` (32px), `mb-4` (16px).
- **Standard Gaps:** `gap-8` (32px), `gap-4` (16px).

### Responsive Grid
- **Max Width:** `max-w-7xl` (80rem / 1280px) for main content areas.
- **Grid Patterns:**
  - Desktop: 12-column grid or 3/4-column card layouts.
  - Tablet: 2-column card layouts.
  - Mobile: Single-column stack with horizontal scroll for tabs.

---

## 3. Component Standards

### Iconography
- **Library:** Lucide React.
- **Standard Sizing:** `w-5 h-5` for UI actions and list items.
- **Prominent Sizing:** `w-6 h-6` or `w-8 h-8` for headers and feature highlights.
- **Coloring:** Emerald 700/800 for general icons, Amber 500/600 for status or wisdom indicators.

### Buttons & Navigation
- **Touch Targets:** Minimum `44x44px` for all interactive elements to support field research use on mobile devices.
- **Navigation Switcher:** Fixed bottom overlay (`bg-emerald-950/90 backdrop-blur`) with rounded-full pill design.

---

## 4. Interactive States

### Hover & Active
- **Buttons/Tabs:** Subtle scale-up (`scale-105`) or background color shift.
- **Cards:** Elevated shadow (`shadow-xl`) and subtle border-color transition to Amber.

### Accessibility
- **Focus Indicators:** Mandatory `focus-visible:ring-2 focus-visible:ring-amber-500` for keyboard navigation.
- **Loading States:** Consistent use of Skeleton screens or emerald-themed spinners.
- **Form Validation:** Use `sonner` for high-visibility toast notifications. Red text for errors, Emerald for success.

---

## 5. UI Philosophy: "Knowledge First"
1.  **Dignity:** Prioritize the comfort and respect of indigenous knowledge holders.
2.  **The Truth Tag:** Clearly distinguish between "Traditional Wisdom" and "Scientifically Validated" data via visual badges.
3.  **Low Bandwidth:** Design for efficiency; minimize heavy image loads and prioritize SVG/CSS-based styling for rural connectivity.
