# 240-Hour TWOV Rules & Midnight Clock

Understanding how Chinese immigration counters evaluate eligibility requires separating **passport treaty privileges**, **third-territory routing normalization**, and **the next-day `00:00` midnight clock**.

## Step 1: Resolve Passport Exemption Tier

When evaluating a traveler's passport nationality (`ISO 3166-1 alpha-2`), `china-transit-engine` checks the highest statutory privilege available first:

1. **Mutual Visa-Free Exemption (`MUTUAL_VISA_FREE` — 9 tracked countries)**: Reciprocal agreements allow direct roundtrip travel without third-country onward tickets.
2. **Unilateral Visa-Free Policy (`UNILATERAL_VISA_FREE` — 35 countries)**: Includes eligible EU, UK/Commonwealth, East Asian, and Latin American states granted short-stay visa-free access (typically up to 30 days under updated circular rules). Travelers under unilateral exemption may fly roundtrip directly to and from China without invoking 240-hour TWOV constraints.
3. **240-Hour Transit Without Visa (`TWOV_ONLY` — 12 tracked jurisdictions + overlapping 54+ total)**: Covers passports such as United States, Canada, United Kingdom (when invoking TWOV or verifying long transit rules), Russia, Brazil, Mexico, Indonesia, and others depending on current policy date windows.

Verify current passport-by-passport eligibility on [CheckChinaTransit.com/policy/240-hour-rules/](https://checkchinatransit.com/policy/240-hour-rules/).

## Step 2: Territory Normalization & The Roundtrip Rule

A 240-hour TWOV itinerary must satisfy:

```text
normalizeTerritory(originCountry) !== 'Mainland China'
AND normalizeTerritory(destinationCountry) !== 'Mainland China'
AND normalizeTerritory(originCountry) !== normalizeTerritory(destinationCountry)
```

For immigration purposes, the following hubs are normalized as distinct non-Mainland territories:
- **Hong Kong SAR** (`HK`)
- **Macau SAR** (`MO`)
- **Taiwan Region** (`TW`)

### Practical Examples
- `San Francisco (US) -> Shanghai Pudong (Mainland China) -> Tokyo (Japan)` -> **Qualified** (`US != Japan`).
- `Tokyo (Japan) -> Beijing Capital (Mainland China) -> Hong Kong (HK SAR)` -> **Qualified** (`Japan != Hong Kong SAR`).
- `Seoul (KR) -> Guangzhou (Mainland China) -> Seoul (KR)` -> **Rejected for TWOV** (`KR == KR`; only valid if passport holds Unilateral or Mutual visa-free exemption).
- `London (UK) -> Chengdu (Mainland China) -> Los Angeles (US)` with an extra technical stop in `Tokyo` -> Gate agents look strictly at the **immediate inbound segment prior to Mainland China** and the **immediate outbound segment departing Mainland China**.

Test complex layover pairs with the [TWOV roundtrip trap checker](https://checkchinatransit.com/diagnostic/roundtrip-trap/).

## Step 3: Next-Day `00:00` Midnight Clock Calculation

Unlike standard 24-hour airport airside waivers or fixed 144-hour-from-touchdown timers, Mainland China's 240-hour permit starts counting at **00:00 CST (UTC+8) on the day following entry**:

- **Touchdown**: `2026-11-15T06:40:00+08:00` (or `2026-11-15T23:10:00+08:00`)
- **Official Clock Start**: `2026-11-16T00:00:00+08:00`
- **Maximum 240-Hour Departure Deadline**: `2026-11-25T23:59:00+08:00` (end of Day 10 after entry date)

Because the first partial arrival day does not count toward the 240 hours, early-morning arrivals legally gain up to **255–263 total hours** on the ground inside approved corridors.
