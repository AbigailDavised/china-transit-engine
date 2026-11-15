import fs from 'node:fs';
import { COUNTRIES, PORTS, POLICY_VERSION } from '../dist/esm/index.js';

const GH_TOKEN = process.env.GH_TOKEN || '';
if (!GH_TOKEN) {
  console.error('[ABORT] Missing GH_TOKEN env var.');
  process.exit(1);
}

const mutual = COUNTRIES.filter((c) => c.visaCategory === 'MUTUAL_VISA_FREE');
const unilateral = COUNTRIES.filter((c) => c.visaCategory === 'UNILATERAL_VISA_FREE');
const twovOnly = COUNTRIES.filter((c) => c.visaCategory === 'TWOV_ONLY');

const markdown = `# 2026–2027 China 240-Hour Visa-Free Transit (TWOV) Official Port & Policy Cheat Sheet

**2026–2027 China 240-Hour Visa-Free Transit (TWOV)** allows citizens of **54 eligible countries** to stay in Mainland China for up to **240 hours (10 calendar days)** across **${PORTS.length} open air, sea, and rail ports** without a visa when transiting to a separate third country or territory (including Hong Kong SAR, Macau SAR, and Taiwan).

> Live Interactive Calculator & Arrival Card Simulator: [CheckChinaTransit.com](https://checkchinatransit.com)  
> Standalone Browser Tool (GitHub Pages): [abigaildavised.github.io/china-transit-engine](https://abigaildavised.github.io/china-transit-engine/)  
> Interactive HF Static Space: [huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator](https://huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator)  
> Zero-Dependency npm Library: \`npm install china-transit-engine\` ([deps.dev](https://deps.dev/npm/china-transit-engine))

---

## 1. Three-Tier Visa-Free Decision Summary (NIA ${POLICY_VERSION})

| Tier | Max Stay | Roundtrip Allowed? | Travel Scope | Covered Passports |
| :--- | :--- | :--- | :--- | :--- |
| **Mutual Visa Exemption** | **30 Days** | ✅ Yes | Nationwide | ${mutual.map((c) => `${c.name} (${c.code})`).join(', ') || 'SG, MY, TH, etc.'} |
| **Unilateral Visa-Free** | **15 Days** | ✅ Yes | Nationwide | ${unilateral.length} countries (${unilateral.slice(0, 8).map((c) => c.code).join(', ')}...) |
| **240-Hour TWOV** | **240 Hours (10 Days)** | ❌ **No (3rd Country Required)** | Designated 24-province port corridors | ${twovOnly.length} countries (US, GB, CA, RU, etc.) |

---

## 2. Official NIA Next-Day 00:00 Midnight Clock Formula

The 240-hour statutory clock **does not start at landing**. It begins at **00:00 CST on the day following entry**:

- **Clock Start**: \`Arrival Date + 1 Day @ 00:00 CST\`
- **Statutory Deadline**: \`Clock Start + 10 Calendar Days @ 23:59 CST\`
- **Example**: Arriving \`2026-11-15 14:30 CST\` grants \`9.5 bonus hours\` on arrival day + \`240 hours\`, with final departure allowed until \`2026-11-25 23:59 CST\`.

---

## 3. Popular Open Entry Ports (Sample from ${PORTS.length} Total)

| City | Port Name | Type | Permitted Stay Area |
| :--- | :--- | :--- | :--- |
${PORTS.filter((p) => p.popular)
  .map((p) => `| ${p.city} | ${p.name} | ${p.type} | ${p.allowableStayArea} |`)
  .join('\n')}

*Full machine-readable 60-port & 56-country JSON is attached in \`china-240h-twov-ports-60.json\` below.*

---

*Disclaimer: Procedural reference compiled from National Immigration Administration (NIA) ${POLICY_VERSION} rules. Always confirm boarding rules with your carrier.*
`;

const datasetJson = JSON.stringify(
  {
    policyVersion: POLICY_VERSION,
    source: 'https://checkchinatransit.com',
    npmPackage: 'https://www.npmjs.com/package/china-transit-engine',
    totalCountries: COUNTRIES.length,
    totalPorts: PORTS.length,
    countries: COUNTRIES,
    ports: PORTS,
  },
  null,
  2
);

async function main() {
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AbigailDavised',
    },
    body: JSON.stringify({
      description:
        '2026–2027 China 240-Hour Visa-Free Transit (TWOV) Official 60-Port & 56-Country Cheat Sheet (CheckChinaTransit.com)',
      public: true,
      files: {
        'china-240h-twov-2026-2027-cheat-sheet.md': { content: markdown },
        'china-240h-twov-ports-60.json': { content: datasetJson },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gist creation failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  console.log(`Gist created: ${data.html_url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
