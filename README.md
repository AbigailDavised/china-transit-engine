# china-transit-engine

Zero-dependency TypeScript/JavaScript library for evaluating **China 240-Hour / 144-Hour Transit Without Visa (TWOV)** eligibility, bilateral/unilateral visa exemptions, open-jaw port corridors, and the official National Immigration Administration (NIA) next-day `00:00` midnight clock.

- **Zero runtime dependencies** & offline pure functions (no network calls, no telemetry).
- Covers **56 country rules** (Mutual 30-Day, Unilateral 15-Day, and 54-nation 240h TWOV) and **60 open entry ports**.
- Interactive web version & full arrival-card / passport-photo guides: [CheckChinaTransit.com](https://checkchinatransit.com)

## Installation

```bash
npm install china-transit-engine
```

## Quick Start

```ts
import {
  evaluateTransitEligibility,
  calculateMidnightClock,
  validatePortCorridor,
} from 'china-transit-engine';

const result = evaluateTransitEligibility({
  nationality: 'US',
  originCountry: 'United States',
  destinationCountry: 'Japan',
  entryPortId: 'shanghai-pudong',
  plannedDays: 6,
  arrivalDate: '2026-11-15',
  arrivalTime: '14:30',
});

console.log(result.status); // 'QUALIFIED'
console.log(result.midnightClock?.deadlineIsoCst); // '2026-11-25T23:59:00+08:00'

const corridor = validatePortCorridor('shanghai-pudong', 'hangzhou-xiaoshan');
console.log(corridor.allowed); // true (Yangtze River Delta corridor)
```

## Disclaimer

This library provides deterministic procedural calculations based on published National Immigration Administration (NIA) policy rules (`2026.1`). Always verify final boarding requirements with your airline and local Chinese embassy/consulate.
