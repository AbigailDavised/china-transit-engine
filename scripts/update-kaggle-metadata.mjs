import fs from 'node:fs';

const KEY_PATH = 'E:/Soft/key/kaggle.json';
const { username, key } = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
const authHeader = 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
const SLUG = 'china-240h-visa-free-transit-ports-2026-2027';

async function main() {
  // 1. Fetch existing metadata so we never wipe user-edited cover/tags/license
  const getRes = await fetch(
    `https://www.kaggle.com/api/v1/datasets/metadata/${username}/${SLUG}`,
    { headers: { Authorization: authHeader } }
  );
  if (!getRes.ok) {
    throw new Error(`GET metadata failed: ${getRes.status} ${await getRes.text()}`);
  }
  const current = await getRes.json();
  const info = current.info || current;
  console.log('[Kaggle] Fetched current metadata. Title:', info.title);

  // 2. Merge file descriptions, column descriptors, provenance & update frequency
  const payload = {
    ...info,
    title: info.title || 'China 240h Visa-Free Transit Ports (2026–2027)',
    subtitle: info.subtitle || '56 country exemption rules and 60 eligible entry ports across Mainland China.',
    isPrivate: false,
    userSpecifiedSources:
      'National Immigration Administration (NIA) of the People\'s Republic of China official 240h TWOV & unilateral/mutual visa-free circulars (2026.1), verified & maintained by CheckChinaTransit.com.',
    expectedUpdateFrequency: 'quarterly',
    data: [
      {
        name: 'china_twov_countries_56.csv',
        description:
          '56 national passport eligibility rules across 30-day mutual exemption, 15-day unilateral visa-free, and 240-hour TWOV.',
        columns: [
          { name: 'code', description: 'ISO 3166-1 alpha-2 country code', type: 'string' },
          { name: 'name', description: 'Official English country or jurisdiction name', type: 'string' },
          { name: 'region', description: 'Geographic grouping used in NIA policy tables', type: 'string' },
          {
            name: 'visa_category',
            description: 'Policy tier: MUTUAL_VISA_FREE, UNILATERAL_VISA_FREE, or TWOV_ONLY',
            type: 'string',
          },
          { name: 'visa_free_days', description: 'Maximum statutory visa-free stay in calendar days', type: 'numeric' },
          {
            name: 'roundtrip_permitted',
            description: 'Whether direct roundtrip (A -> China -> A) is permitted without a third country',
            type: 'boolean',
          },
        ],
      },
      {
        name: 'china_twov_ports_60.csv',
        description:
          'All 60 designated Chinese airports, seaports, and railway ports eligible for 240-hour Transit Without Visa entry.',
        columns: [
          { name: 'id', description: 'Canonical URL-safe port identifier', type: 'string' },
          { name: 'city', description: 'Port host city in Mainland China', type: 'string' },
          { name: 'name', description: 'Full port name including IATA airport code where applicable', type: 'string' },
          { name: 'type', description: 'Port transport category: Airport, Seaport, or Railway', type: 'string' },
          { name: 'region', description: 'Regional corridor or province grouping', type: 'string' },
          {
            name: 'allowable_stay_area',
            description: 'Statutory provinces or municipalities where TWOV travelers may stay',
            type: 'string',
          },
          { name: 'popular', description: 'Whether port is a major international hub', type: 'boolean' },
        ],
      },
      {
        name: 'china_transit_policy_2026_2027.json',
        description:
          'Unified JSON bundle combining policy version metadata, 56 country rules, and 60 open entry ports.',
      },
    ],
  };

  const postRes = await fetch(
    `https://www.kaggle.com/api/v1/datasets/metadata/${username}/${SLUG}`,
    {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  const text = await postRes.text();
  if (!postRes.ok) {
    throw new Error(`POST metadata failed: ${postRes.status} ${text}`);
  }
  console.log('[Kaggle] Metadata update response:', text);
}

main().catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
