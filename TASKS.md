# Aufgaben fuer Claude

## Aktuelle Aufgabe

Epic 1: Foundation (Woche 1) - Schema-Design und Projektstruktur

---

## MVP Implementierung (4-5 Wochen)

> Quelle: howl_20260120_105023_timer_app_neukonzeption.md

### Epic 1: Foundation (Woche 1)

- [ ] **1.1 Schema-Design** [M]
  - [ ] TypeScript Types definiert in shared/types/
  - [ ] Migrations-Strategie dokumentiert

- [ ] **1.2 Feature-Module Struktur** [S]
  - [ ] Klare Ordnerstruktur: /timer, /life, /settings
  - [ ] Store-Interfaces definiert

- [ ] **1.3 Build-Setup validieren** [S]
  - [ ] `npm run dev:mobile` startet fehlerfrei
  - [ ] Android Build erfolgreich

### Epic 2: Core Timer (Woche 2)

- [ ] **2.1 Timer-Store implementieren** [M]
  - [ ] CRUD fuer Custom Timer
  - [ ] System Timer (Tag/Woche/Monat/Jahr)

- [ ] **2.2 Background Timer mit Notifications** [L]
  - [ ] Timer laeuft im Background weiter
  - [ ] Notification zeigt aktuellen Stand

- [ ] **2.3 Timer UI (Dashboard)** [M]
  - [ ] Grid-View aller Timer
  - [ ] Donut-Chart Visualisierung

### Epic 3: Life Timer (Woche 3)

- [ ] **3.1 Life Timer Store** [M]
  - [ ] Geburtsdatum speichern
  - [ ] Lebenserwartung berechnen (offline)

- [ ] **3.2 Life Timer UI** [M]
  - [ ] Dedizierter Screen mit Visualisierung
  - [ ] Positive Framing ("X Jahre voller Moeglichkeiten")

- [ ] **3.3 Onboarding fuer Life Timer** [S]
  - [ ] Opt-in Flow mit Erklaerung
  - [ ] Skip-Option

### Epic 4: Widget + Share (Woche 4)

- [ ] **4.1 Basic Widget (2x1)** [L]
  - [ ] Zeigt einen Timer
  - [ ] Aktualisiert sich periodisch

- [ ] **4.2 Share-Intent** [M]
  - [ ] Export Timer als Link/Bild
  - [ ] Deep Link zum Importieren

### Epic 5: Polish (Woche 5)

- [ ] **5.1 Testing auf physischen Geraeten** [M]
  - [ ] Getestet auf Samsung, Pixel, Xiaomi
  - [ ] Background Timer stabil

- [ ] **5.2 Bug Fixes** [M]

- [ ] **5.3 Beta Release vorbereiten** [S]
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
