import fs from 'node:fs';
import { COUNTRIES, PORTS, POLICY_VERSION, EFFECTIVE_DATE } from '../dist/esm/index.js';

const KEY_PATH = 'E:/Soft/key/kaggle.json';
if (!fs.existsSync(KEY_PATH)) {
  console.error(`[ABORT] Missing ${KEY_PATH}`);
  process.exit(1);
}

const { username, key } = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
const authHeader = 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
const SLUG = 'china-240h-visa-free-transit-ports-2026-2027';

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildFiles() {
  const countriesCsv = [
    'code,name,region,visa_category,visa_free_days,roundtrip_permitted',
    ...COUNTRIES.map((c) =>
      [
        c.code,
        c.name,
        c.region,
        c.visaCategory,
        c.visaFreeDays,
        c.visaCategory !== 'TWOV_ONLY',
      ]
        .map(csvEscape)
        .join(',')
    ),
  ].join('\n');

  const portsCsv = [
    'id,city,name,type,region,allowable_stay_area,popular',
    ...PORTS.map((p) =>
      [p.id, p.city, p.name, p.type, p.region, p.allowableStayArea, p.popular]
        .map(csvEscape)
        .join(',')
    ),
  ].join('\n');

  const fullJson = JSON.stringify(
    {
      policyVersion: POLICY_VERSION,
      effectiveDate: EFFECTIVE_DATE,
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

  return [
    { name: 'china_twov_countries_56.csv', content: Buffer.from(countriesCsv, 'utf8') },
    { name: 'china_twov_ports_60.csv', content: Buffer.from(portsCsv, 'utf8') },
    { name: 'china_transit_policy_2026_2027.json', content: Buffer.from(fullJson, 'utf8') },
  ];
}

async function uploadBlob(file) {
  const mtime = Math.floor(Date.now() / 1000);
  const initRes = await fetch('https://www.kaggle.com/api/v1/blobs/upload', {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'DATASET',
      name: file.name,
      contentLength: file.content.length,
      lastModifiedEpochSeconds: mtime,
    }),
  });
  if (!initRes.ok) {
    throw new Error(`Upload init failed for ${file.name}: ${initRes.status} ${await initRes.text()}`);
  }
  const { token, createUrl } = await initRes.json();
  const putRes = await fetch(createUrl, {
    method: 'PUT',
    headers: { 'Content-Length': String(file.content.length) },
    body: file.content,
  });
  if (!putRes.ok) {
    throw new Error(`Blob PUT failed for ${file.name}: ${putRes.status} ${await putRes.text()}`);
  }
  console.log(`[Kaggle] Uploaded ${file.name} (${file.content.length} bytes)`);
  return { token };
}

async function main() {
  const files = buildFiles();
  const uploadedTokens = [];
  for (const f of files) {
    uploadedTokens.push(await uploadBlob(f));
  }

  const description = [
    '2026–2027 China 240-Hour Visa-Free Transit (TWOV), 15-Day Unilateral, and 30-Day Bilateral Exemption Reference Dataset.',
    '',
    `Compiled from National Immigration Administration (NIA) ${POLICY_VERSION} rules (${EFFECTIVE_DATE}), covering ${COUNTRIES.length} country rules and ${PORTS.length} eligible air, sea, and rail entry ports across Mainland China.`,
    '',
    '### Included Files',
    '- `china_twov_countries_56.csv`: Country-level eligibility tiers (`MUTUAL_VISA_FREE`, `UNILATERAL_VISA_FREE`, `TWOV_ONLY`), permitted stay days, and roundtrip flags.',
    '- `china_twov_ports_60.csv`: All 60 open entry ports with port type, regional corridor, and statutory allowable stay areas.',
    '- `china_transit_policy_2026_2027.json`: Unified machine-readable JSON bundle.',
    '',
    '### Companion Interactive Tools & Open-Source Engine',
    '- Interactive Web Eligibility Checker & Arrival Card Simulator: https://checkchinatransit.com',
    '- Zero-Dependency npm Library (`china-transit-engine`): https://www.npmjs.com/package/china-transit-engine',
    '- Offline Browser Calculator (GitHub Pages): https://abigaildavised.github.io/china-transit-engine/',
    '- Hugging Face Static Space: https://huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator',
    '',
    '*Disclaimer: Independent reference dataset based on published NIA regulations. Always verify final boarding requirements with your airline and local Chinese embassy.*',
  ].join('\n');

  const createPayload = {
    title: 'China 240h Visa-Free Transit Ports (2026–2027)',
    slug: SLUG,
    ownerSlug: username,
    subtitle: '56 country exemption rules and 60 eligible entry ports across Mainland China.',
    description,
    isPrivate: false,
    licenses: [{ name: 'CC0-1.0' }],
    files: uploadedTokens,
    keywords: ['china', 'travel', 'visa', 'airports', 'transportation'],
  };

  const createRes = await fetch('https://www.kaggle.com/api/v1/datasets/create/new', {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  });
  const bodyText = await createRes.text();
  if (!createRes.ok) {
    throw new Error(`Dataset create failed: ${createRes.status} ${bodyText}`);
  }
  console.log('[Kaggle] Create response:', bodyText);
  console.log(`[Kaggle] Dataset URL: https://www.kaggle.com/datasets/${username}/${SLUG}`);
}

main().catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
