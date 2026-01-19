# Fleeting Time - Graphics & Icon Guide

## App Icon

### Anforderungen

| Platform | Größe | Format | Ecken |
|----------|-------|--------|-------|
| Android | 512 x 512 px | PNG (32-bit) | System-Masking |
| iOS | 1024 x 1024 px | PNG (ohne Alpha) | System-Radius |

### Icon Design-Konzept

**Hauptelement:** Stilisierter Donut-Chart / Kreis-Fortschritt

```
    ┌─────────────────┐
    │                 │
    │    ╭───────╮    │
    │   ╱  ╭───╮  ╲   │
    │  │  │     │  │  │
    │  │  │  ⏱  │  │  │
    │  │  │     │  │  │
    │   ╲  ╰───╯  ╱   │
    │    ╰───────╯    │
    │                 │
    └─────────────────┘
```

**Variante A: Minimalistisch**
- Weißer/heller Hintergrund
- Sky Blue (#0ea5e9) Fortschritts-Ring (ca. 65% gefüllt)
- Dezente Uhr-Symbole oder Zahlen

**Variante B: Gradient**
- Gradient Hintergrund (Sky Blue → Deep Blue)
- Weißer Fortschritts-Ring
- Prozent-Zahl in der Mitte

**Variante C: Multi-Ring**
- Mehrere konzentrische Ringe (wie die Timer)
- Verschiedene Farben für Tag/Woche/Monat/Jahr
- Minimalistischer Look

### Empfohlene Variante: B (Gradient)

```
Farben:
- Hintergrund: Linear Gradient
  - Start: #0ea5e9 (Sky Blue)
  - End: #0369a1 (Deep Sky Blue)
- Ring: #ffffff (Weiß)
- Unausgefüllter Ring: rgba(255,255,255,0.3)
- Optional: "75%" Text in Weiß
```

### Icon Guidelines
- Keine feinen Details (wird sehr klein angezeigt)
- Hoher Kontrast für Erkennbarkeit
- Funktioniert auf hellem UND dunklem Hintergrund
- Keine Wörter oder Text (außer Zahlen)

---

## Feature Graphic (Google Play)

### Anforderungen
- **Größe:** 1024 x 500 px
- **Format:** PNG oder JPEG (24-bit, kein Alpha)
- **Verwendung:** Header im Play Store

### Design-Konzept

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────────┐                                          │
│  │              │     ULTIMATE TIMER                       │
│  │  [App Icon]  │                                          │
│  │              │     Deine Zeit visualisiert              │
│  └──────────────┘                                          │
│                                                            │
│         [4 Mini Donut Charts: Tag Woche Monat Jahr]        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout-Details:**
- Links: App Icon (ca. 200x200)
- Mitte-Rechts: App Name + Tagline
- Unten: 4 kleine Donut-Previews
- Hintergrund: Gradient passend zum Icon

**Texte:**
- **Headline:** "ULTIMATE TIMER" (Bold, Weiß)
- **Subline:** "Deine Zeit visualisiert" (Light, Weiß/Hellgrau)

---

## Promo-Grafiken

### Social Media Formate

| Plattform | Format | Größe |
|-----------|--------|-------|
| Instagram Post | 1:1 | 1080 x 1080 px |
| Instagram Story | 9:16 | 1080 x 1920 px |
| Twitter/X | 16:9 | 1200 x 675 px |
| Facebook | 1.91:1 | 1200 x 628 px |

### Promo-Grafik Konzepte

**Konzept 1: "Time Awareness"**
```
┌─────────────────────────────┐
│                             │
│   "Wie viel von 2025       │
│    hast du schon gelebt?"  │
│                             │
│        ┌───────┐           │
│        │  52%  │           │
│        │ YEAR  │           │
│        └───────┘           │
│                             │
│   [App Store Badge]        │
│                             │
└─────────────────────────────┘
```

**Konzept 2: "Life Progress"**
```
┌─────────────────────────────┐
│                             │
│   "Dein Leben als          │
│    Fortschrittsbalken"     │
│                             │
│   ━━━━━━━━━━━━░░░░░░       │
│         42%                 │
│                             │
│   Ultimate Timer           │
│   [Download Now]           │
│                             │
└─────────────────────────────┘
```

**Konzept 3: "Feature Highlight"**
```
┌─────────────────────────────┐
│                             │
│   ⏱️ Tag  📅 Woche         │
│   📆 Monat  🗓️ Jahr        │
│   ❤️ Lebenszeit            │
│                             │
│   "Alle Timer.             │
│    Eine App."              │
│                             │
│   [App Store Badges]       │
│                             │
└─────────────────────────────┘
```

---

## Farbpalette

### Primärfarben
```css
--sky-500: #0ea5e9;    /* Primary Blue */
--sky-600: #0284c7;    /* Primary Dark */
--sky-400: #38bdf8;    /* Primary Light */
```

### Timer-Farben
```css
--timer-day: #f59e0b;     /* Amber */
--timer-week: #10b981;    /* Emerald */
--timer-month: #8b5cf6;   /* Violet */
--timer-year: #ef4444;    /* Red */
--timer-custom: #0ea5e9;  /* Sky */
--timer-life: #ec4899;    /* Pink */
```

### Neutrale Farben
```css
--white: #ffffff;
--gray-100: #f1f5f9;
--gray-900: #0f172a;
--black: #000000;
```

---

## Typografie

### Empfohlene Fonts

**Headlines:**
- SF Pro Display (iOS)
- Roboto (Android)
- Inter (Web/Fallback)

**Body:**
- SF Pro Text (iOS)
- Roboto (Android)
- Inter (Web/Fallback)

### Schriftgrößen für Grafiken
- **App Name:** 72-96px Bold
- **Tagline:** 36-48px Regular
- **Feature Text:** 24-32px Medium
- **Small Text:** 16-20px Regular

---

## Asset-Erstellung Tools

### Kostenlos
- **Figma** - Design & Prototyping
- **Canva** - Schnelle Grafiken
- **GIMP** - Bildbearbeitung
- **Inkscape** - Vektorgrafiken

### Kostenpflichtig
- **Sketch** - macOS Design
- **Adobe Illustrator** - Vektorgrafiken
- **Adobe Photoshop** - Bildbearbeitung

### Icon-Generatoren
- **App Icon Generator** (appicon.co)
- **MakeAppIcon** (makeappicon.com)
- **Icon Kitchen** (icon.kitchen)

---

## Checkliste Grafiken

### App Icon
- [ ] 512x512 PNG für Android
- [ ] 1024x1024 PNG für iOS
- [ ] Adaptive Icon Foreground (Android)
- [ ] Adaptive Icon Background (Android)

### Store Graphics
- [ ] Feature Graphic 1024x500 (Google Play)
- [ ] Promo Graphic 180x120 (Google Play - optional)
- [ ] TV Banner 1280x720 (falls TV-Support)

### Marketing
- [ ] Social Media Kit (verschiedene Formate)
- [ ] Press Kit mit hochauflösenden Assets
- [ ] App Preview Video (optional, aber empfohlen)

---

## Video Asset (Optional aber empfohlen)

### App Preview Video

**Länge:** 15-30 Sekunden
**Format:** MP4, H.264
**Auflösung:** 1080x1920 (Portrait)

**Storyboard:**
1. (0-3s) App öffnet sich, Dashboard erscheint
2. (3-7s) Scrollen durch Timer, Donut-Charts animieren
3. (7-12s) Tap auf Timer → Toggle zwischen Elapsed/Remaining
4. (12-17s) Custom Timer erstellen
5. (17-22s) Life Timer zeigen
6. (22-27s) Dark Mode Toggle
7. (27-30s) Logo + "Download Now"

**Musik:** Upbeat, modern, royalty-free
**Text-Overlays:** Feature-Highlights während des Videos
