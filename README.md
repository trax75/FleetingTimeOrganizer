# UltimateTimer

A privacy-first web application that visualizes time progress through multiple timer types with donut/pie charts.

## Tech Stack Decision

**Frontend:** Vite + React 18 + TypeScript
- Vite: Fast dev server, instant HMR, optimized builds
- React: Component-based architecture, excellent ecosystem
- TypeScript: Type safety for complex date/time logic

**Styling:** Tailwind CSS
- Utility-first, minimal bundle with purging
- Built-in dark mode support
- Responsive design utilities

**Charts:** Custom SVG
- No heavy chart libraries needed for simple donuts
- Full control over accessibility and animations
- Minimal bundle size

**Testing:** Vitest
- Native Vite integration
- Fast, ESM-first
- Jest-compatible API

**State/Persistence:** React Context + LocalStorage
- No external state library needed for this scope
- All data stays on device (privacy-first)

## Features

### A) Timer Dashboard
- Grid of timer cards showing progress as donut charts
- Each card displays: title, donut progress, numeric percent, time details, mode (ELAPSED/REMAINING)
- Auto-updates every second (throttled for performance)
- Preset timers on first load: Day, Week, Month, Year (elapsed + remaining)

### B) Custom Period Timers
- User-defined timers with name, start/end datetime
- Display modes: elapsed, remaining, or both
- Proper handling of "not started" and "ended" states
- Validation prevents invalid date ranges

### C) Time Calculations
- Correct handling of timezones, DST, leap years, varying month lengths
- ISO week by default (Monday start), configurable to Sunday
- Calendar-aware calculations (not fixed milliseconds)

### D) Life Timer
- Estimated life elapsed/remaining based on:
  - Country baseline life expectancy (World Bank API)
  - Sex at birth (optional)
  - Lifestyle factors (smoking, activity, family longevity)
- Shows estimate range, not false precision
- Clear disclaimers: informational only, not medical advice
- All personal data stored locally only

### E) Settings
- Dark mode: respects system preference, manual toggle available
- Week start: Monday (ISO) or Sunday
- Persistent via LocalStorage

## Privacy Principles

- **No accounts required**
- **No server-side storage of personal data**
- **All settings and timers stored in LocalStorage**
- **Life expectancy API calls only fetch country statistics, no personal data transmitted**
- **Optional geolocation with explicit consent**

## Time Calculation Edge Cases

1. **DST transitions**: Days with 23 or 25 hours handled correctly
2. **Leap years**: February 29 handled in year progress
3. **Month boundaries**: Varying month lengths (28-31 days)
4. **Timezone changes**: All calculations use local time
5. **Clamping**: Progress always 0-100%, never NaN/Infinity

## Life Expectancy Model

### Data Source
World Bank API indicators:
- `SP.DYN.LE00.IN` - Life expectancy at birth, total
- `SP.DYN.LE00.FE.IN` - Life expectancy at birth, female
- `SP.DYN.LE00.MA.IN` - Life expectancy at birth, male

### Adjustment Factors (Conservative)
| Factor | Adjustment |
|--------|------------|
| Current smoker | -5 to -7 years |
| Moderately active | +2 to +3 years |
| Parent reached 85+ | +1 to +2 years |
| Chronic condition | -2 to -5 years |

**Total adjustment capped at ±10 years**

### Disclaimer
This estimate is based on population statistics and self-reported inputs. It is for informational and entertainment purposes only. It does not constitute medical advice. Individual outcomes vary significantly based on genetics, healthcare access, lifestyle choices, and countless other factors not captured here.

## Project Structure

```
UltimateTimer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TimerCard.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AddTimerModal.tsx
│   │   │   ├── LifeTimerSetup.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/
│   │   │   ├── useTimer.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/
│   │   │   ├── timeCalculations.ts
│   │   │   ├── lifeExpectancy.ts
│   │   │   └── constants.ts
│   │   ├── context/
│   │   │   ├── TimerContext.tsx
│   │   │   └── SettingsContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── tests/
│   │   └── timeCalculations.test.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## Setup & Running

```bash
# Install dependencies
cd frontend
npm install

# Development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

Modern browsers with ES2020+ support:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

ISC
