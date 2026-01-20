# Debate Report: Timer App Neukonzeption - Fleeting Time

**Generated**: 2026-01-20T10:50:23
**Rounds**: 5
**Perspectives**: 🏗️ Architect, 🚢 Pragmatist, 🔍 Skeptic, 💡 Innovator

---

## Executive Summary

Die Debatte hat einen konkreten Konsens für die Neukonzeption von "Fleeting Time" erreicht: **4-5 Wochen MVP mit Life Timer als Kern-Differenzierung, Feature-Module-Architektur, Schema-Design in Woche 1, kein Backend.** Die größte verbleibende Spannung betrifft die psychologische Wirkung der Mortalitäts-Anzeige (Skeptic vs. Innovator) - diese wird durch A/B-Testing im Soft Launch validiert.

---

## Arbiter's Analysis

### Debate Quality
Die Perspektiven haben sich über 5 Runden ernsthaft miteinander auseinandergesetzt. Alle Teilnehmer haben substantielle Zugeständnisse gemacht:
- **Architect**: Plugin → Feature-Module, 2 Wochen → 3-4 Tage
- **Pragmatist**: 4 → 4-5 Wochen, Schema-Design priorisiert
- **Skeptic**: Risiken teilweise überbewertet anerkannt
- **Innovator**: Biofeedback/Social Features verschoben

### Points of Consensus

| Thema | Konsens |
|-------|---------|
| Timeline | 4-5 Wochen MVP |
| Architektur | Feature-Module statt Plugin-System |
| Schema | Design in Woche 1 kritisch |
| Backend | Kein Backend für MVP |
| Differenzierung | Life Timer als Kern-USP |
| HealthConnect | Gestrichen bis Phase 4+ |

### Persistent Tensions

| Spannung | Typ | Status |
|----------|-----|--------|
| Life Timer Default-Aktivierung | Werte-Konflikt | Opt-in vs. Opt-out - Testing entscheidet |
| Abstraktionstiefe | Trade-off | Feature-Module als Kompromiss |
| Testing-Zeitbudget | Trade-off | Explizite Milestones gefordert |

### Strongest Arguments

| Perspektive | Stärkster Beitrag |
|-------------|-------------------|
| 🏗️ Architect | Schema-First Development |
| 🚢 Pragmatist | "MVP = Complete Experience" |
| 🔍 Skeptic | Background Service Testing auf echten Geräten |
| 💡 Innovator | Philosophische Differenzierung statt Commodity |

---

## Developer-Ready Implementation Plan

### 1. Decision + Rationale

**Decision**: Neukonzeption als "Memento Mori Timer App" mit Life Timer als Kern-USP, MVP in 4-5 Wochen.

**Key Trade-offs**:
- Geschwindigkeit > Vollständigkeit (Iteration statt Big Bang)
- Philosophische Tiefe > Feature-Vielfalt
- Lokale Daten > Cloud-Sync (Datenschutz, Einfachheit)

**Confidence**: HIGH - Alle Perspektiven haben zugestimmt.

### 2. Scope Definition

**In Scope (MVP)**:
- [ ] Life Timer mit Lebenserwartungs-Visualisierung
- [ ] Standard-Timer (Tag, Woche, Monat, Jahr)
- [ ] Custom Timer mit Start/End-Datum
- [ ] Donut-Chart Visualisierung
- [ ] Dark/Light Mode
- [ ] Basic Home-Screen Widget (2x1)
- [ ] Share-Intent für Custom Timer
- [ ] Manuelles Mood-Tracking (Post-Timer: "Wie fühlst du dich?")

**Out of Scope (Explizite Ausschlüsse)**:
- HealthConnect/Biofeedback → Phase 4+ (Compliance-Aufwand)
- Cloud-Sync/Backend → Phase 2 (Validierung erst lokal)
- Social Features → Phase 3 (Cold Start Problem)
- AI-Personalisierung → Phase 3 (Datenvolumen nötig)
- Komplexe Widget-Layouts → Phase 2 (Basic Widget reicht)

**Definition of Done**:
- App startet ohne Crash auf Android 12-15
- Life Timer berechnet korrekt basierend auf Geburtsdatum
- Timer funktioniert im Background mit Notification
- Widget zeigt aktuellen Timer-Stand
- Share-Intent generiert teilbare Timer-Konfiguration

### 3. Assumptions & Risks

**Critical Assumptions**:

| Assumption | Impact if Wrong | How to Validate |
|------------|-----------------|-----------------|
| Life Timer resoniert emotional | App hat keinen USP | A/B Test in Soft Launch |
| 4-5 Wochen reichen für MVP | Verzögerung, Frustration | Wöchentliche Milestones |
| Bestehende Codebase ist nutzbar | Rewrite nötig | Code Review Woche 1 |
| Background Timer funktioniert stabil | Kern-Feature kaputt | Test auf 3+ physischen Geräten |

**Risk Matrix**:

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Background Service instabil | Medium | High | Früher Proof-of-Concept |
| Schema-Migrationen kompliziert | Medium | High | Schema-First in Woche 1 |
| Life Timer wirkt deprimierend | Low | High | Opt-in + Positive Framing |
| Widget-Kompatibilität | Low | Medium | Konservatives 2x1 Layout |
| Scope Creep | High | Medium | Strenge Wochenziele |

### 4. Requirements

**Functional Requirements**:
1. [FR-1] Das System soll basierend auf Geburtsdatum die verbleibende Lebenszeit anzeigen
2. [FR-2] Das System soll mehrere parallele Timer unterstützen
3. [FR-3] Das System soll Timer im Background mit Notification fortführen
4. [FR-4] Das System soll Timer-Konfigurationen als Share-Link exportieren
5. [FR-5] Das System soll ein Home-Screen Widget bereitstellen
6. [FR-6] Das System soll Dark/Light Mode unterstützen

**Non-Functional Requirements**:

| Category | Requirement | Target |
|----------|-------------|--------|
| Startup | App Cold Start | < 2 Sekunden |
| Battery | Background Timer | < 2% Battery/Stunde |
| Storage | Lokale Datenbank | < 50MB |
| Compatibility | Android Version | 12+ (API 31+) |
| Reliability | Crash-free Sessions | > 99% |

### 5. Open Questions

| Question | What It Blocks | Resolution Plan |
|----------|----------------|-----------------|
| Opt-in vs. Opt-out für Life Timer? | Onboarding-Flow | A/B Test in Beta |
| Monetarisierung (Freemium/Paid/Sub)? | Store-Listing | Nach MVP-Feedback entscheiden |
| Welche Lebenserwartungs-Daten nutzen? | Life Timer Accuracy | WHO-Durchschnitt + Land |

### 6. Proposed Solution Outline

Die App wird als React Native/Expo App weiterentwickelt (bestehende Codebase). Der Life Timer wird das emotionale Zentrum, umgeben von praktischen Timer-Features.

**Architecture Diagram (ASCII)**:
```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │ TimerScreen │ │ LifeScreen  │ │   SettingsScreen    ││
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘│
└─────────┼───────────────┼───────────────────┼───────────┘
          │               │                   │
┌─────────▼───────────────▼───────────────────▼───────────┐
│                    STATE LAYER (Zustand)                 │
│  ┌─────────────┐ ┌───────────────┐ ┌──────────────────┐ │
│  │ timerStore  │ │ lifeTimerStore│ │  settingsStore   │ │
│  └──────┬──────┘ └───────┬───────┘ └────────┬─────────┘ │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
┌─────────▼────────────────▼──────────────────▼───────────┐
│                    DOMAIN LAYER (shared/)                │
│  ┌──────────────────┐ ┌─────────────────────────────────┐│
│  │ timeCalculations │ │    lifeExpectancyOffline        ││
│  └──────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  ┌──────────────────┐ ┌─────────────────────────────────┐│
│  │  AsyncStorage    │ │       expo-sqlite (optional)    ││
│  └──────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Key Components**:
- **TimerStore**: Verwaltet alle Timer (System + Custom)
- **LifeTimerStore**: Lebenserwartung, Geburtsdatum, Visualisierung
- **SettingsStore**: Preferences (Theme, Wochenstart, etc.)
- **timeCalculations**: Pure Functions für Zeitberechnungen
- **lifeExpectancyOffline**: Lebenserwartungs-Berechnung ohne API

**Key Interfaces**:
- Timer → Widget: SharedViewModel für konsistente Daten
- Timer → Notification: expo-notifications für Background
- App → Share: expo-sharing für Export

### 7. Milestones & Sequencing

| # | Milestone | Description | Dependencies | Exit Criteria |
|---|-----------|-------------|--------------|---------------|
| 1 | Foundation | Schema-Design, Feature-Module Setup | None | Schema dokumentiert, Module-Struktur steht |
| 2 | Core Timer | Timer-Logic, Background Service | M1 | Multi-Timer funktioniert im Background |
| 3 | Life Timer | Lebenserwartung, Visualisierung | M1 | Donut-Chart zeigt Life Progress |
| 4 | Widget + Share | Home-Screen Widget, Share-Intent | M2 | Widget zeigt Timer, Share funktioniert |
| 5 | Polish + Beta | Bug Fixes, Onboarding, Beta Release | M3, M4 | Crash-free auf 3 Testgeräten |

### 8. Task Breakdown

#### Epic 1: Foundation (Woche 1)
- [ ] **Ticket 1.1**: Schema-Design für Timer und Life Timer
  - **Acceptance Criteria**:
    - [ ] TypeScript Types definiert in shared/types/
    - [ ] Migrations-Strategie dokumentiert
  - **Estimate**: M

- [ ] **Ticket 1.2**: Feature-Module Struktur einrichten
  - **Acceptance Criteria**:
    - [ ] Klare Ordnerstruktur: /timer, /life, /settings
    - [ ] Store-Interfaces definiert
  - **Estimate**: S

- [ ] **Ticket 1.3**: Build-Setup validieren
  - **Acceptance Criteria**:
    - [ ] `npm run dev:mobile` startet fehlerfrei
    - [ ] Android Build erfolgreich
  - **Estimate**: S

#### Epic 2: Core Timer (Woche 2)
- [ ] **Ticket 2.1**: Timer-Store implementieren
  - **Acceptance Criteria**:
    - [ ] CRUD für Custom Timer
    - [ ] System Timer (Tag/Woche/Monat/Jahr)
  - **Estimate**: M

- [ ] **Ticket 2.2**: Background Timer mit Notifications
  - **Acceptance Criteria**:
    - [ ] Timer läuft im Background weiter
    - [ ] Notification zeigt aktuellen Stand
  - **Estimate**: L

- [ ] **Ticket 2.3**: Timer UI (Dashboard)
  - **Acceptance Criteria**:
    - [ ] Grid-View aller Timer
    - [ ] Donut-Chart Visualisierung
  - **Estimate**: M

#### Epic 3: Life Timer (Woche 3)
- [ ] **Ticket 3.1**: Life Timer Store
  - **Acceptance Criteria**:
    - [ ] Geburtsdatum speichern
    - [ ] Lebenserwartung berechnen (offline)
  - **Estimate**: M

- [ ] **Ticket 3.2**: Life Timer UI
  - **Acceptance Criteria**:
    - [ ] Dedizierter Screen mit Visualisierung
    - [ ] Positive Framing ("X Jahre voller Möglichkeiten")
  - **Estimate**: M

- [ ] **Ticket 3.3**: Onboarding für Life Timer
  - **Acceptance Criteria**:
    - [ ] Opt-in Flow mit Erklärung
    - [ ] Skip-Option
  - **Estimate**: S

#### Epic 4: Widget + Share (Woche 4)
- [ ] **Ticket 4.1**: Basic Widget (2x1)
  - **Acceptance Criteria**:
    - [ ] Zeigt einen Timer
    - [ ] Aktualisiert sich periodisch
  - **Estimate**: L

- [ ] **Ticket 4.2**: Share-Intent
  - **Acceptance Criteria**:
    - [ ] Export Timer als Link/Bild
    - [ ] Deep Link zum Importieren
  - **Estimate**: M

#### Epic 5: Polish (Woche 5)
- [ ] **Ticket 5.1**: Testing auf physischen Geräten
  - **Acceptance Criteria**:
    - [ ] Getestet auf Samsung, Pixel, Xiaomi
    - [ ] Background Timer stabil
  - **Estimate**: M

- [ ] **Ticket 5.2**: Bug Fixes
  - **Estimate**: M

- [ ] **Ticket 5.3**: Beta Release vorbereiten
  - **Acceptance Criteria**:
    - [ ] Play Store Listing aktualisiert
    - [ ] Internal Testing Track
  - **Estimate**: S

### 9. Validation Plan

**Success Metrics**:

| Metric | Type | Target | How to Measure |
|--------|------|--------|----------------|
| 7-Day Retention | Product | > 30% | Firebase Analytics |
| Life Timer Activation | Product | > 50% der User | Feature Flag |
| Crash-free Rate | Technical | > 99% | Crashlytics |
| Background Timer Reliability | Technical | > 95% korrekte Notifications | Manual QA |
| App Store Rating | Product | > 4.0 | Play Store |

**Testing Strategy**:
- **Unit Tests**: timeCalculations, lifeExpectancy (shared/)
- **Integration Tests**: Store ↔ UI Interaction
- **E2E Tests**: Timer Start → Background → Notification

**Monitoring & Alerting**:
- Crashlytics für Crashes
- Firebase Analytics für Retention
- Custom Events für Life Timer Usage

### 10. Rollout Plan

**Feature Flags**:
- `life_timer_enabled`: Life Timer Feature Toggle
- `widget_enabled`: Widget Feature Toggle
- `mood_tracking_enabled`: Post-Timer Mood Tracking

**Staged Deployment**:
1. **Internal Testing**: 1 Woche, Team only
2. **Closed Beta**: 2 Wochen, 50-100 User
3. **Open Beta**: 2 Wochen, unbegrenzt
4. **Production**: Full Rollout

**Rollback Strategy**:
- **Trigger**: Crash Rate > 5% oder Rating < 3.0
- **Procedure**: Play Store Rollback auf letzte stabile Version
- **Recovery Time Objective**: < 2 Stunden

### 11. Dissent Log (Preserved Objections)

| Objection | From | Type | Still Valid If... | Evidence That Would Change Minds |
|-----------|------|------|-------------------|----------------------------------|
| Life Timer könnte deprimierend wirken | Skeptic | Risiko | > 40% negatives Feedback in Beta | User Research, Retention-Daten |
| 4-5 Wochen ist zu optimistisch | Skeptic | Trade-off | Woche 2 Milestone nicht erreicht | Velocity-Tracking |
| Repository-Abstraktion fehlt | Architect | Trade-off | Phase 2 Features brauchen > 3 Tage Refactoring | Aufwands-Tracking |
| Manuelles Mood-Tracking ist zu simpel | Innovator | Werte | User fragen explizit nach Biofeedback | Feature Requests |

---

## Feature-Priorisierung nach Komplexität/Nutzen

Basierend auf der Debatte ergibt sich folgende priorisierte Liste:

### Phase 1: MVP (Wochen 1-5)
| Feature | Komplexität | Nutzen | Priorität |
|---------|-------------|--------|-----------|
| Life Timer (Kern-USP) | Medium | Sehr Hoch | P0 |
| System Timer (Tag/Woche/Monat/Jahr) | Niedrig | Hoch | P0 |
| Custom Timer | Niedrig | Hoch | P0 |
| Dark/Light Mode | Niedrig | Medium | P0 |
| Basic Widget (2x1) | Medium | Hoch | P1 |
| Share-Intent | Niedrig | Medium | P1 |
| Manuelles Mood-Tracking | Niedrig | Medium | P1 |

### Phase 2: Post-MVP (Wochen 6-12)
| Feature | Komplexität | Nutzen | Priorität |
|---------|-------------|--------|-----------|
| Erweiterte Widgets | Medium | Hoch | P2 |
| Statistiken & Trends | Medium | Hoch | P2 |
| Export/Import | Niedrig | Medium | P2 |
| P2P Timer Sharing | Hoch | Medium | P2 |

### Phase 3: Expansion (Monate 3-6)
| Feature | Komplexität | Nutzen | Priorität |
|---------|-------------|--------|-----------|
| Cloud-Sync (Premium) | Hoch | Medium | P3 |
| Erweiterte Life Timer Faktoren | Medium | Medium | P3 |
| AI-Personalisierung | Hoch | Medium | P3 |

### Phase 4+: Future (6+ Monate)
| Feature | Komplexität | Nutzen | Priorität |
|---------|-------------|--------|-----------|
| HealthConnect/Biofeedback | Sehr Hoch | Medium | P4 |
| Social Features | Sehr Hoch | Medium | P4 |
| Watch App | Hoch | Niedrig | P4 |

---

## Metadata

- **Command**: `/howl schau dir an welche Timer Apps aktuell die erfolgreichsten im google play store sind...`
- **Preset**: general
- **Agent Files**: Built-in perspectives (Architect, Pragmatist, Skeptic, Innovator)
- **Report Location**: howl_20260120_105023_timer_app_neukonzeption.md
