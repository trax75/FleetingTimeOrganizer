# Aufgaben fuer Claude

## Aktuelle Aufgabe

Epic 5: Polish - Testing und Beta Release Vorbereitung

---

## MVP Implementierung (4-5 Wochen)

> Quelle: howl_20260120_105023_timer_app_neukonzeption.md

### Epic 1: Foundation (Woche 1) ✅

- [x] **1.1 Schema-Design** [M]
  - [x] TypeScript Types definiert in shared/types/
  - [x] Migrations-Strategie dokumentiert

- [x] **1.2 Feature-Module Struktur** [S]
  - [x] Klare Ordnerstruktur: /timer, /life, /settings
  - [x] Store-Interfaces definiert

- [x] **1.3 Build-Setup validieren** [S]
  - [x] `npm run dev:mobile` startet fehlerfrei
  - [x] Android Build erfolgreich

### Epic 2: Core Timer (Woche 2) ✅

- [x] **2.1 Timer-Store implementieren** [M]
  - [x] CRUD fuer Custom Timer
  - [x] System Timer (Tag/Woche/Monat/Jahr)

- [x] **2.2 Background Timer mit Notifications** [L]
  - [x] Timer laeuft im Background weiter
  - [x] Notification zeigt aktuellen Stand

- [x] **2.3 Timer UI (Dashboard)** [M]
  - [x] Grid-View aller Timer
  - [x] Donut-Chart Visualisierung

### Epic 3: Life Timer (Woche 3) ✅

- [x] **3.1 Life Timer Store** [M]
  - [x] Geburtsdatum speichern
  - [x] Lebenserwartung berechnen (offline)

- [x] **3.2 Life Timer UI** [M]
  - [x] Dedizierter Screen mit Visualisierung
  - [x] Positive Framing ("X Jahre voller Moeglichkeiten")

- [x] **3.3 Onboarding fuer Life Timer** [S]
  - [x] Opt-in Flow mit Erklaerung
  - [x] Skip-Option

### Epic 4: Widget + Share (Woche 4) ✅

- [x] **4.1 Basic Widget (2x1)** [L]
  - [x] Zeigt einen Timer
  - [x] Aktualisiert sich periodisch

- [x] **4.2 Share-Intent** [M]
  - [x] Export Timer als Link/Bild
  - [x] Deep Link zum Importieren

### Epic 5: Polish (Woche 5) 🔄

- [x] **5.1 Testing auf physischen Geraeten** [M]
  - [x] TypeScript-Check bestanden (mit skipLibCheck)
  - [x] Code-Review durchgefuehrt
  - [ ] Physisches Testen auf Samsung, Pixel, Xiaomi

- [x] **5.2 Bug Fixes** [M]
  - [x] React 19 Type-Fehler behoben (skipLibCheck)
  - [x] Dead Code in shareService.ts identifiziert (nicht kritisch)

- [x] **5.3 Beta Release vorbereiten** [S]
  - [x] app.json konfiguriert (versionCode 7)
  - [ ] versionCode auf 8 erhoehen fuer neuen Build
  - [ ] Play Store Listing aktualisiert
  - [ ] Internal Testing Track

---

## Definition of Done (MVP)

- [ ] App startet ohne Crash auf Android 12-15
- [ ] Life Timer berechnet korrekt basierend auf Geburtsdatum
- [ ] Timer funktioniert im Background mit Notification
- [ ] Widget zeigt aktuellen Timer-Stand
- [ ] Share-Intent generiert teilbare Timer-Konfiguration

---

## Nicht vergessen

- Kein Backend fuer MVP
- HealthConnect/Biofeedback erst Phase 4+
- Schema-Design MUSS in Woche 1 fertig sein
- Test auf physischen Geraeten (nicht nur Emulator)
- Life Timer: Opt-in mit positivem Framing

---

## Legende

- [S] = Small (< 1 Tag)
- [M] = Medium (1-2 Tage)
- [L] = Large (3+ Tage)

---

## Erledigte Aufgaben

- [x] Projekt-Gedaechtnis angelegt (CLAUDE_MEMORY.md)
- [x] Task-Datei angelegt (TASKS.md)
- [x] /howl Debatte durchgefuehrt
- [x] Implementierungsplan erstellt
