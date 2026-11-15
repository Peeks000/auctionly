# AUCTIONLY — Luxury Brand & Design System Specification

**Brand Identity:** AUCTIONLY  
**Tagline:** Own the Extraordinary.  
**Design Philosophy:** Cinematic Luxury, Architectural Restraint, Curatorial Prestige  

---

## 1. Brand Identity & Visual Assets

### 1.1 Custom Wordmark & Monogram 'A'
- **The Wordmark:** `A U C T I O N L Y`
  - High-tracking (letter-spacing `0.25em`), modern geometric sans with subtly seriffed junctions that communicate heritage and technological precision.
- **The Monogram 'A':**
  - An iconic architectural glyph: An equilateral apex with a distinctive chamfered crossbar representing the auctioneer's gavel and the frame of an art gallery.
- **Logo Variations:**
  - *Primary Luxury Mark:* Monogram 'A' above `AUCTIONLY` wordmark with `OWN THE EXTRAORDINARY.` subtitle.
  - *Horizontal Compact:* Monogram 'A' flanked by `AUCTIONLY`.
  - *Favicon & App Icon:* Monogram 'A' in burnished gold on `#111111` obsidian background.

---

## 2. Color Palette & Semantic Tokens

```
+-----------------------------------------------------------------------------------------+
| Obsidian Black (#111111)    | Primary application background, immersive stage depth     |
+-----------------------------+-----------------------------------------------------------+
| Secondary Dark (#242424)    | Card surfaces, modals, table headers, elevated layers     |
+-----------------------------+-----------------------------------------------------------+
| Champagne (#E8DCC4)         | Subtle borders, delicate dividers, secondary typography  |
+-----------------------------+-----------------------------------------------------------+
| Muted Gold (#C6A66A)        | Primary luxury accent, active bids, hammer strikes, CTA   |
+-----------------------------+-----------------------------------------------------------+
| Warm Ivory (#F5F0E7)        | Primary typography, high-contrast headings, hero titles  |
+-----------------------------------------------------------------------------------------+
```

### 2.1 Tailwind CSS Color Token Configuration
```javascript
// tailwind.config.js luxury token mapping
module.exports = {
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#111111",
          dark: "#242424",
          charcoal: "#1A1A1A",
          champagne: "#E8DCC4",
          gold: "#C6A66A",
          goldLight: "#DFBF82",
          goldDark: "#9E824A",
          ivory: "#F5F0E7",
          muted: "#8C857B",
        },
        status: {
          live: "#D9534F",       // Red pulse for active live auctions
          reserveMet: "#4E9F6E", // Emerald muted for reserve confirmed
          pending: "#C6A66A",    // Amber gold for pending review
          outbid: "#E06D53",     // Warm terracotta for outbid alerts
        }
      }
    }
  }
}
```

---

## 3. Typography System

| Level | Typeface Family | Weight | Tracking | Usage |
|---|---|---|---|---|
| **Display Hero** | Playfair Display / Cormorant | 600 SemiBold | `tracking-tight` | Homepage Hero, Collection Titles, Live Gala Headings |
| **Section H1/H2**| Playfair Display / Cormorant | 500 Medium | `tracking-normal` | Catalogue Headings, Lot Titles, Editorial Journal |
| **Interface H3/H4**| Geist / Inter | 600 SemiBold | `tracking-wide` | Dashboard Metrics, Studio Headers, Bidding Panel |
| **Body & Details**| Geist / Inter | 400 Regular | `tracking-normal` | Condition Reports, Descriptions, Provenance Notes |
| **Financial / Bids**| Geist Mono / JetBrains Mono | 500 Medium | `tracking-tight` | INR Prices, Countdown Clocks, Increment Tables |

---

## 4. Component Aesthetics & Micro-Interactions

1. **Restraint over Gimmicks:**
   - No excessive neon glowing borders, no generic pastel drop-shadows, no rounded cartoon buttons.
   - Corners are subtly crisp (`rounded-none` to `rounded-sm`, 2px maximum radius for buttons and cards).
   - Borders are razor-thin (1px solid `#E8DCC4` at 15% to 25% opacity).
2. **The 3D Stage:**
   - Canvas features deep vignette shading dropping into `#111111`.
   - Subtle camera orbit with gentle ease-out dampening.
   - Ambient occlusion and soft gold directional lighting at 45 degrees.
3. **Sound Micro-Interactions (Optional, Disabled by Default):**
   - Subtle acoustic wooden strike for bid confirmation.
   - Low brass tone for outbid notification.
   - Distinctive crystal hammer chime for lot hammer down.
