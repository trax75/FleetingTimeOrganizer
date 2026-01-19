# Fleeting Time - Screenshot Guide

## Benötigte Screenshots

### Google Play Store
- **Mindestens:** 2 Screenshots
- **Empfohlen:** 8 Screenshots
- **Formate:**
  - Smartphone: 16:9 oder 9:16 (min. 320px, max. 3840px)
  - Empfohlen: 1080 x 1920 px (Portrait)

### Apple App Store
- **iPhone 6.7"** (1290 x 2796 px) - Pflicht
- **iPhone 6.5"** (1284 x 2778 px) - Pflicht
- **iPhone 5.5"** (1242 x 2208 px) - Optional
- **Tablet** - Optional

---

## Screenshot-Konzepte (8 Screenshots)

### Screenshot 1: Hero Shot - Dashboard
**Inhalt:** Dashboard mit allen 4 Standard-Timern (Tag, Woche, Monat, Jahr)
**Text-Overlay:** "Deine Zeit auf einen Blick"
**Modus:** Light Mode
**Hintergrund:** Gradient von #0ea5e9 zu #0284c7

```
┌─────────────────────┐
│   ULTIMATE TIMER    │
│                     │
│  "Deine Zeit auf    │
│   einen Blick"      │
│                     │
│  ┌─────┐  ┌─────┐   │
│  │ TAG │  │WOCHE│   │
│  │ 45% │  │ 62% │   │
│  └─────┘  └─────┘   │
│  ┌─────┐  ┌─────┐   │
│  │MONAT│  │JAHR │   │
│  │ 28% │  │ 52% │   │
│  └─────┘  └─────┘   │
│                     │
└─────────────────────┘
```

---

### Screenshot 2: Dark Mode
**Inhalt:** Gleicher Dashboard-Screen
**Text-Overlay:** "Dark Mode für nächtliche Nutzung"
**Modus:** Dark Mode
**Hintergrund:** Dunkelgrau #1a1a2e

```
┌─────────────────────┐
│                     │
│  "Dark Mode für     │
│   nächtliche        │
│   Nutzung"          │
│                     │
│  [Dark Dashboard]   │
│                     │
└─────────────────────┘
```

---

### Screenshot 3: Timer Toggle
**Inhalt:** Timer im "Remaining" Modus
**Text-Overlay:** "Vergangen oder Verbleibend - Du entscheidest"
**Highlight:** Zeige den Unterschied zwischen elapsed/remaining

```
┌─────────────────────┐
│                     │
│  "Vergangen oder    │
│   Verbleibend"      │
│                     │
│   ELAPSED  │ REMAIN │
│    45%     │  55%   │
│  ──────────│────────│
│                     │
└─────────────────────┘
```

---

### Screenshot 4: Custom Timer
**Inhalt:** Add Custom Timer Screen mit Datumswahl
**Text-Overlay:** "Zähle runter zu deinen Events"
**Beispiel:** "Urlaub Mallorca" Timer

```
┌─────────────────────┐
│                     │
│  "Zähle runter zu   │
│   deinen Events"    │
│                     │
│  Name: Urlaub       │
│  Start: 01.07.2025  │
│  Ende: 14.07.2025   │
│                     │
│  [Create Timer]     │
│                     │
└─────────────────────┘
```

---

### Screenshot 5: Custom Timer Beispiele
**Inhalt:** Dashboard mit verschiedenen Custom Timern
**Text-Overlay:** "Urlaub, Deadlines, Events - Alles im Blick"
**Beispiele:**
- Urlaub Mallorca (Countdown)
- Projekt Deadline
- Weihnachten 2025

```
┌─────────────────────┐
│                     │
│  "Urlaub, Deadlines │
│   Events"           │
│                     │
│  ┌─────────────┐    │
│  │ Urlaub      │    │
│  │ 23 Tage     │    │
│  └─────────────┘    │
│  ┌─────────────┐    │
│  │ Deadline    │    │
│  │ 5 Tage      │    │
│  └─────────────┘    │
│                     │
└─────────────────────┘
```

---

### Screenshot 6: Life Timer
**Inhalt:** Life Timer Screen mit Fortschritts-Donut
**Text-Overlay:** "Dein Leben visualisiert"
**Hinweis:** Zeige die Jahre gelebt/verbleibend

```
┌─────────────────────┐
│                     │
│  "Dein Leben        │
│   visualisiert"     │
│                     │
│      ┌─────┐        │
│      │ 42% │        │
│      │~35y │        │
│      └─────┘        │
│                     │
│   remaining         │
│                     │
└─────────────────────┘
```

---

### Screenshot 7: Life Timer Setup
**Inhalt:** Life Timer Formular mit Lifestyle-Faktoren
**Text-Overlay:** "Personalisierte Lebenserwartung"
**Zeige:** Land, Geschlecht, Aktivität, Rauchen

```
┌─────────────────────┐
│                     │
│  "Personalisierte   │
│   Lebenserwartung"  │
│                     │
│  Geburtsdatum       │
│  [01.01.1990]       │
│                     │
│  Land: DE           │
│  Aktivität: Aktiv   │
│  Rauchen: Nie       │
│                     │
└─────────────────────┘
```

---

### Screenshot 8: Settings
**Inhalt:** Einstellungen Screen
**Text-Overlay:** "Vollständig anpassbar"
**Zeige:** Theme, Wochenstart, Dezimalstellen

```
┌─────────────────────┐
│                     │
│  "Vollständig       │
│   anpassbar"        │
│                     │
│  Theme              │
│  ○ Light ● Dark     │
│                     │
│  Week Start         │
│  ● Monday ○ Sunday  │
│                     │
│  Decimals: 2        │
│                     │
└─────────────────────┘
```

---

## Design-Richtlinien für Screenshots

### Farben
- **Primary:** #0ea5e9 (Sky Blue)
- **Background Light:** #ffffff
- **Background Dark:** #0f172a
- **Text Light:** #1e293b
- **Text Dark:** #f1f5f9

### Text-Overlay Stil
- **Font:** SF Pro Display (iOS) / Roboto (Android)
- **Größe:** 48-64px für Headlines
- **Position:** Oberes Drittel des Screenshots
- **Schatten:** Leichter Drop Shadow für Lesbarkeit

### Frame/Mockup
- **Empfohlen:** Device Frame um Screenshots
- **Tool-Empfehlungen:**
  - Figma mit Device Frames
  - Mockuuups Studio
  - AppLaunchpad
  - Screenshots.pro

---

## Screenshot-Erstellung Workflow

### 1. App vorbereiten
```bash
# Expo Go App starten
cd mobile
npx expo start
```

### 2. Testdaten einrichten
- 4 Standard-Timer sollten automatisch da sein
- Custom Timer hinzufügen: "Urlaub Mallorca", "Projekt Deadline"
- Life Timer mit realistischen Daten erstellen

### 3. Screenshots aufnehmen
- **Android:** Power + Volume Down
- **iOS:** Power + Volume Up
- **Emulator:** Screenshot-Button oder Cmd+S

### 4. Nachbearbeitung
1. In Figma/Canva importieren
2. Device Frame hinzufügen
3. Text-Overlay platzieren
4. Hintergrund-Gradient hinzufügen
5. Exportieren in benötigten Größen

---

## Checkliste vor Upload

- [ ] Mindestens 4 Screenshots pro Geräteklasse
- [ ] Alle Screenshots in korrekter Auflösung
- [ ] Text-Overlays lesbar und nicht abgeschnitten
- [ ] Konsistenter visueller Stil
- [ ] Keine persönlichen Daten sichtbar
- [ ] Light und Dark Mode vertreten
- [ ] Feature Highlights klar erkennbar
