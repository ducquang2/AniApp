---
name: Cinematic Pulse
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb693'
  primary: '#ffb693'
  on-primary: '#561f00'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#a04100'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#9ccaff'
  on-tertiary: '#003257'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
The design system is engineered for high-energy, immersive media consumption. It targets a global audience of anime enthusiasts who demand a "cinema-first" experience. The aesthetic leans heavily into **Modern Glassmorphism** and **Dark Mode UI**, prioritizing content density without sacrificing legibility. 

The emotional response should be one of excitement and immersion—akin to stepping into a modern theater. We utilize deep, nocturnal backgrounds to let vibrant anime key art "pop," while employing electric accents to guide the user's journey through massive libraries of content.

## Colors
The palette is dominated by **Rich Black (#0B0E14)** to provide a canvas that minimizes eye strain during long viewing sessions. 

- **Primary (Electric Orange):** Reserved for critical actions, play buttons, and "New Episode" badges. It represents energy and the heat of battle.
- **Secondary (Neon Indigo):** Used for metadata, progress bars, and subtle gradients to add depth to the dark interface.
- **Surface Strategy:** We use layered transparencies rather than solid grays to maintain the glass effect. Containers use a white-tinted alpha (8-12%) over the dark base to create a sense of height.

## Typography
The typography system balances the bold, geometric energy of **Montserrat** for headlines with the utilitarian precision of **Inter** for descriptions and metadata. 

Headlines should be set with tight letter-spacing to emphasize the "blocky" cinematic feel. For body text, we prioritize readability against dark backgrounds by slightly increasing the line-height. Labels used for categories (e.g., "SHONEN", "TRENDING") should always be uppercase with generous letter-spacing to distinguish them from interactive UI elements.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

The vertical rhythm is based on an **8px base unit**. Content is organized into horizontal scrolling carousels ("Shelves") to maximize vertical screen real estate. 
- **Margins:** 16px on mobile to maximize edge-to-edge thumbnails; 48px on desktop to allow for sidebar navigation.
- **Gutters:** Standardized at 16px to ensure enough breathing room between high-detail anime posters.

## Elevation & Depth
Depth is created through **Glassmorphism** and backdrop filters rather than traditional shadows.
- **Level 1 (Base):** Deep Navy background.
- **Level 2 (Cards/Navigation):** 10% white opacity background with a `20px` backdrop blur and a `1px` white border at 10% opacity (inner stroke).
- **Level 3 (Modals/Popovers):** 15% white opacity with a `40px` blur and a subtle glow shadow of the primary orange color (`0px 8px 24px rgba(255, 107, 0, 0.15)`).

Transitions between states should use a `cubic-bezier(0.4, 0, 0.2, 1)` timing function for a "snappy yet smooth" feel.

## Shapes
The shape language is consistently **Rounded (0.5rem / 8px)**. This softens the high-contrast visuals and makes the "glass" panels feel like physical, polished objects. 

Large content cards (Posters) should use `rounded-lg` (1rem), while smaller utility elements like tags and mini-buttons use the base `rounded` (0.5rem). This hierarchy of rounding guides the eye from large content blocks to small interactive details.

## Components
- **Primary Action Button:** Solid Electric Orange background, bold Montserrat text, no border. On hover, it gains a subtle outer glow of its own color.
- **Anime Card:** 2:3 aspect ratio for posters. Bottom-aligned gradient overlay (Black to Transparent) to house the title and "New" badges. 
- **Glass Chips:** Used for genres. Semi-transparent background with a light border; turns solid Primary Orange when selected.
- **Progress Bars:** Thin 4px height. The "watched" portion should be a gradient from Secondary Indigo to Primary Orange to represent completion progress.
- **Input Fields:** Darker than the background with a 1px border that illuminates to Electric Orange on focus.
- **Player Controls:** Floating glass panel with blurred background. Large, iconic play/pause center-weighted icons.