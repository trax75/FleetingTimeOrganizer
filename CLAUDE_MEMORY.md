# Claude Memory - Fleeting Time Organizer

## Projekt-Kontext
- **App-Name**: Fleeting Time
- **Technischer Name**: ultimate-timer
- **Beschreibung**: Timer-App die visualisiert, wie viel Zeit vergangen/verbleibend ist
- **Plattformen**: Android + iOS (React Native mit Expo)
- **Status**: Android Test-Version im Play Store (versionCode 7)

## Tech-Stack
- **Framework**: React Native 0.81 + Expo SDK 54
- **Sprache**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **UI**: Custom Components mit react-native-svg

## Projekt-Struktur
```
FleetingTimeOrganizer/
├── mobile/          # React Native App (Hauptfokus)
│   ├── app/         # Expo Router Screens
│   │   ├── (tabs)/  # Tab-Navigation
│   │   │   ├── index.tsx    # Dashboard mit Timer-Grid
│   │   │   ├── life.tsx     # Life Timer Feature
│   │   │   └── settings.tsx # Einstellungen
│   │   └── timer/   # Timer-Details & Hinzufuegen
│   └── src/         # Components, Stores, Hooks
├── shared/          # Geteilte Types & Utils
├── frontend/        # Web-Version (React/Vite)
└── backend/         # Backend (noch minimal)
```

## Hauptfeatures (aktuell)
1. **Zeit-Timer**: Tag, Woche, Monat, Jahr - zeigt Fortschritt als Donut-Chart
2. **Custom Timer**: Eigene Zeitraeume mit Start/End-Datum
3. **Life Timer**: Lebenserwartungs-Berechnung basierend auf:
   - Geburtsdatum, Land, Geschlecht
   - Lifestyle: Rauchen, Aktivitaet, chronische Erkrankungen
   - Familiengeschichte (Eltern 85+)
4. **Dark/Light Mode**: Automatisch oder manuell
5. **Einstellungen**: Wochenstart (Mo/So), Dezimalstellen

## IDs & Konfiguration
- **Bundle ID (Android & iOS)**: com.ultimatetimer.app
- **EAS Project ID**: d05e9fc3-b6a7-4d00-a248-6e4e8eee7cb8

---

## Gespraechs-Verlauf

### Session 1 (2026-01-19)
- Erstes Kennenlernen des Projekts
- Ziel: App "auf ein neues Level heben"
- Naechste Schritte: [TBD - warten auf User-Input]

---

## Offene Fragen / Ideen
- Was genau bedeutet "neues Level"? (Features? Design? Performance? iOS Release?)

## Notizen
- Fork von "UltimateTimer"
- App ist komplett offline-faehig (keine Server-Abhaengigkeit)
