# China 240-Hour Visa-Free Transit & Policy Engine Documentation

Welcome to the technical documentation and regulatory reference for the **China 240-Hour Transit Without Visa (TWOV)** eligibility system and the zero-dependency `china-transit-engine` TypeScript/JavaScript library (`POLICY_VERSION: 2026.1`).

International travelers connecting through Mainland China encounter three distinct exemption regimes—30-day mutual visa exemptions, unilateral visa-free entry windows, and the National Immigration Administration (NIA) 240-hour (10-day) transit without visa policy—each carrying strict port-of-entry, itinerary routing, and arrival-time calculation constraints. Misreading even a single condition such as direct roundtrip exclusion, separate territory treatment for Hong Kong, Macau, and Taiwan, or the next-day midnight clock offset frequently leads to denied boarding at foreign check-in counters hours before the flight ever departs for China.

Use the interactive browser calculator at [CheckChinaTransit.com](https://checkchinatransit.com/) to verify multi-leg flight itineraries against the complete 2026 rule matrix with zero signup or rate limits.

## Exemption Tiers and Regulatory Scope

Under the unified NIA policy schedule (`2026.1`, effective December 2025), our deterministic rule table classifies **56 passport jurisdictions** across three statutory exemption tiers and validates entry and exit routing across **60 designated Mainland China international ports**:

| Policy Tier | Passport Jurisdictions | Maximum Legal Stay | Routing & Onward Ticket Requirement |
| :--- | :---: | :--- | :--- |
| **Mutual Visa-Free (`MUTUAL_VISA_FREE`)** | 9 countries | 30 days (varies by treaty) | Direct roundtrip permitted; no third-country onward leg required. |
| **Unilateral Visa-Free (`UNILATERAL_VISA_FREE`)** | 35 countries | Up to 30 days | Direct roundtrip permitted within treaty dates for tourism, business, family visit, or transit. |
| **240-Hour TWOV (`TWOV_ONLY` & All 54+ Eligible)** | 12 TWOV-only + unilateral overlap | 240 hours from 00:00 next day | Strict `Country A -> Mainland China -> Country/Region C` transit; direct roundtrips rejected. |

Before booking non-refundable airfare or cruise segments, review the full [China 240-hour visa-free transit rules](https://checkchinatransit.com/policy/240-hour-rules/) to confirm which tier governs your passport nationality and whether your layover falls cleanly inside the statutory stay window.

## Why Check-In Rejections Happen on Valid-Looking Itineraries

Even experienced travelers and airline gate agents routinely misapply four subtle rules inside the NIA 240-hour policy:

1. **The Roundtrip Exclusion Trap (`Country A -> China -> Country A`)**: A traveler flying New York -> Shanghai -> New York, or London -> Beijing -> London, does not qualify for 240-hour TWOV even if the stay lasts only 48 hours. An immediate onward ticket to a genuinely different third country or jurisdiction is mandatory at check-in. You can test edge cases such as same-country return layovers using the [TWOV roundtrip trap diagnostic](https://checkchinatransit.com/diagnostic/roundtrip-trap/).
2. **Hong Kong, Macau, and Taiwan Count as Separate Third Territories**: Because Mainland China maintains independent immigration borders with Hong Kong SAR, Macau SAR, and Taiwan, a routing such as `London -> Shanghai -> Hong Kong` qualifies as a valid third-territory transit (`UK -> Mainland China -> Hong Kong`), whereas `Hong Kong -> Shenzhen -> Hong Kong` is rejected as a non-qualifying roundtrip.
3. **The Midnight Clock Gives Up to 264 Effective Hours**: Statutory 240-hour countdowns do not start at aircraft touchdown. Immigration officers start the 10-day clock at **`00:00` on the calendar day following arrival** (China Standard Time, UTC+8). Touching down at 08:15 AM on November 15 allows exit anytime through 23:59 on November 25.
4. **Open-Jaw Inter-Provincial Port Corridors**: Prior 72-hour and 144-hour restrictions confined passengers to a single city or province. The updated 240-hour expansion opens **47 airports, 10 seaports, and 3 railway ports** across **24 provincial-level regions**, permitting inter-provincial domestic rail or flights between approved corridors—documented inside the [eligible China transit ports directory](https://checkchinatransit.com/ports/).

## Architecture of This Documentation Portal

This GitBook site pairs regulatory rule breakdowns with the open-source TypeScript engine implementation so both travel researchers and airline/booking developers can audit every rule deterministically:

- **[240-Hour TWOV Rules & Midnight Clock](240h-twov-rules.md)** — Detailed breakdown of treaty vs. TWOV rules, territory normalization (`Hong Kong SAR`, `Macau SAR`, `Taiwan`), and step-by-step CST midnight deadline arithmetic.
- **[60 Open Entry Ports & Cross-Provincial Corridors](60-entry-ports-corridors.md)** — Complete breakdown of all 47 airports, 10 seaports, and 3 railway ports across 25 regional corridor classifications.
- **[TypeScript Engine API & Open Datasets](typescript-engine-api.md)** — Complete reference for `evaluateTransitEligibility`, `calculateMidnightClock`, and `validatePortCorridor`, plus open CC0 CSV benchmarks and static browser mirrors.

## Independent Verification & Compliance Disclaimer

All algorithms, port tables, and treaty dates documented here are structured from official National Immigration Administration (NIA) circulars and Embassy notices (`Effective Date: December 2025`, `Policy Version: 2026.1`). CheckChinaTransit and `china-transit-engine` operate as an independent reference utility with zero network telemetry or government affiliation; travelers should always verify final passport validity (typically 3+ months remaining and blank visa pages), confirmed onward seat reservations, and airline TIMATIC alerts prior to departure.
