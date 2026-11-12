import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  COUNTRIES,
  PORTS,
  calculateMidnightClock,
  evaluateTransitEligibility,
  validatePortCorridor,
  findCountryRule,
  findPort,
} from '../dist/esm/index.js';

const require = createRequire(import.meta.url);

test('Dataset completeness: 56 country rules and 60 open ports', () => {
  assert.equal(COUNTRIES.length, 56);
  assert.equal(PORTS.length, 60);
  assert.ok(findCountryRule('US'));
  assert.ok(findPort('PVG'));
});

test('US -> Shanghai (PVG) -> Japan (6 days) qualifies for 240h TWOV', () => {
  const res = evaluateTransitEligibility({
    nationality: 'US',
    originCountry: 'United States',
    destinationCountry: 'Japan',
    entryPortId: 'shanghai-pudong',
    plannedDays: 6,
    arrivalDate: '2026-11-15',
    arrivalTime: '14:30',
  });
  assert.equal(res.status, 'QUALIFIED');
  assert.equal(res.policyApplied, 'TWOV_ONLY');
  assert.equal(res.maxPermittedHours, 240);
  assert.equal(res.midnightClock?.clockStartIsoCst, '2026-11-16T00:00:00+08:00');
  assert.equal(res.midnightClock?.deadlineIsoCst, '2026-11-25T23:59:00+08:00');
});

test('Roundtrip trap detection with alias normalization (USA -> China -> United States)', () => {
  const res = evaluateTransitEligibility({
    nationality: 'US',
    originCountry: 'USA',
    destinationCountry: 'United States',
    entryPortId: 'beijing-capital',
    plannedDays: 4,
  });
  assert.equal(res.status, 'NOT_QUALIFIED');
  assert.equal(res.isRoundtrip, true);
  assert.ok(res.reasons.some((r) => r.includes('Roundtrip trap')));
});

test('Hong Kong SAR counts as valid separate third customs territory', () => {
  const res = evaluateTransitEligibility({
    nationality: 'GB',
    originCountry: 'United Kingdom',
    destinationCountry: 'Hong Kong (HKG)',
    entryPortId: 'beijing-daxing',
    plannedDays: 8,
  });
  assert.equal(res.status, 'QUALIFIED');
  assert.equal(res.isRoundtrip, false);
});

test('Unilateral 15-day visa-free (Germany) permits direct roundtrips', () => {
  const res = evaluateTransitEligibility({
    nationality: 'DE',
    originCountry: 'Germany',
    destinationCountry: 'Germany',
    entryPortId: 'shanghai-pudong',
    plannedDays: 12,
  });
  assert.equal(res.status, 'QUALIFIED');
  assert.equal(res.policyApplied, 'UNILATERAL_VISA_FREE');
  assert.equal(res.maxPermittedHours, 360);
});

test('Mutual 30-day visa-free (Singapore) permits 25-day stay', () => {
  const res = evaluateTransitEligibility({
    nationality: 'SG',
    originCountry: 'Singapore',
    destinationCountry: 'Singapore',
    entryPortId: 'guangzhou-baiyun',
    plannedDays: 25,
  });
  assert.equal(res.status, 'QUALIFIED');
  assert.equal(res.policyApplied, 'MUTUAL_VISA_FREE');
  assert.equal(res.maxPermittedHours, 720);
});

test('Passport validity < 3 months is rejected across all policies', () => {
  const res = evaluateTransitEligibility({
    nationality: 'DE',
    originCountry: 'Germany',
    destinationCountry: 'Japan',
    entryPortId: 'shanghai-pudong',
    passportValidOver3Months: false,
  });
  assert.equal(res.status, 'NOT_QUALIFIED');
  assert.ok(res.headline.includes('Passport Validity Insufficient'));
});

test('Midnight clock handles year-end rollover accurately without DST drift', () => {
  const clock = calculateMidnightClock('2026-12-28', '08:15', 240);
  assert.equal(clock.clockStartIsoCst, '2026-12-29T00:00:00+08:00');
  assert.equal(clock.deadlineIsoCst, '2027-01-07T23:59:00+08:00');
  assert.equal(clock.bonusHoursOnArrivalDay, 15.75);
});

test('Port corridor open-jaw check: Yangtze Delta allowed vs cross-region flagged', () => {
  const sameCorridor = validatePortCorridor('shanghai-pudong', 'hangzhou-xiaoshan');
  assert.equal(sameCorridor.allowed, true);
  assert.equal(sameCorridor.samePort, false);

  const crossCorridor = validatePortCorridor('beijing-capital', 'chengdu-tianfu');
  assert.equal(crossCorridor.allowed, false);
});

test('CommonJS bundle compatibility (dist/cjs/index.cjs)', () => {
  const cjs = require('../dist/cjs/index.cjs');
  assert.equal(typeof cjs.evaluateTransitEligibility, 'function');
  const res = cjs.evaluateTransitEligibility({
    nationality: 'US',
    originCountry: 'United States',
    destinationCountry: 'Japan',
    entryPortId: 'shanghai-pudong',
    plannedDays: 4,
  });
  assert.equal(res.status, 'QUALIFIED');
});
