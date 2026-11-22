# TypeScript Engine API & Open Datasets

`china-transit-engine` is packaged as an offline, zero-dependency TypeScript/ESM/CommonJS library with full `.d.ts` type definitions and deterministic unit coverage.

## Installation

```bash
npm install china-transit-engine
```

## Core Functions

### `evaluateTransitEligibility(input)`

Evaluates passport tier (`MUTUAL_VISA_FREE`, `UNILATERAL_VISA_FREE`, `TWOV_ONLY`), routing validity, port authorization, and 240-hour deadline compliance in a single pure call:

```ts
import { evaluateTransitEligibility } from 'china-transit-engine';

const result = evaluateTransitEligibility({
  nationality: 'US',
  originCountry: 'United States',
  destinationCountry: 'Japan',
  entryPortId: 'shanghai-pudong',
  plannedDays: 6,
  arrivalDate: '2026-11-15',
  arrivalTime: '14:30',
});
```

### `calculateMidnightClock(arrivalDate, arrivalTime, maxHours?)`

Computes exact China Standard Time (`UTC+8`) midnight rollover timestamps and statutory departure cutoffs.

### `validatePortCorridor(entryPortId, exitPortId)`

Checks whether both ports appear among the 60 authorized Mainland China checkpoints and classifies shared regional corridors (e.g., Beijing-Tianjin-Hebei, Yangtze River Delta, Guangdong GBA) versus nationwide 240-hour cross-provincial open-jaw itineraries.

### Lookup Helpers

- `findCountryRule(codeOrName)` — Lookup across all 56 passport rule records.
- `findPort(idOrCityOrIata)` — Search across all 60 air, sea, and rail checkpoints.
- `listPortsByRegion(region)` — Filter checkpoints by corridor/province.
- `normalizeTerritory(countryName)` — Normalize `Hong Kong SAR`, `Macau SAR`, and `Taiwan` distinct immigration zones.

## Open Ecosystem Resources

- **Interactive Web Eligibility Checker**: [https://checkchinatransit.com/](https://checkchinatransit.com/)
- **npm Registry**: [npmjs.com/package/china-transit-engine](https://www.npmjs.com/package/china-transit-engine)
- **Google deps.dev Open Source Profile**: [deps.dev/npm/china-transit-engine](https://deps.dev/npm/china-transit-engine)
- **Kaggle CC0 Benchmark Dataset (`10.00 / 10.00`)**: [kaggle.com/datasets/sotomo/china-240h-visa-free-transit-ports-2026-2027](https://www.kaggle.com/datasets/sotomo/china-240h-visa-free-transit-ports-2026-2027)
- **Hugging Face Static Calculator**: [huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator](https://huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator)
- **GitHub Repository**: [github.com/AbigailDavised/china-transit-engine](https://github.com/AbigailDavised/china-transit-engine)
