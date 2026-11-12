import fs from 'node:fs';

const policy = JSON.parse(
  fs.readFileSync('E:/Soft/xoesim/CheckChinaTransit/src/data/transit-policy.json', 'utf8')
);
const enrichedRaw = fs.readFileSync(
  'E:/Soft/xoesim/CheckChinaTransit/src/data/enriched-policy.ts',
  'utf8'
);

const countries = [];
const blockRegex =
  /\{\s*code:\s*'([A-Z]{2})',\s*name:\s*'([^']+)',\s*region:\s*'([^']+)',\s*flag:\s*'([^']+)',\s*visaCategory:\s*'([^']+)',\s*visaFreeDays:\s*(\d+)/g;
let m;
while ((m = blockRegex.exec(enrichedRaw)) !== null) {
  countries.push({
    code: m[1],
    name: m[2],
    region: m[3],
    visaCategory: m[5],
    visaFreeDays: Number(m[6]),
  });
}

for (const c of policy.countries) {
  if (!countries.find((x) => x.code === c.code)) {
    countries.push({
      code: c.code,
      name: c.name,
      region: c.region,
      visaCategory: 'TWOV_ONLY',
      visaFreeDays: 10,
    });
  }
}

const ports = policy.ports.map((p) => ({
  id: p.id,
  city: p.city,
  name: p.name,
  type: p.type,
  region: p.region,
  allowableStayArea: p.allowableStayArea,
  popular: Boolean(p.popular),
}));

console.log(`Extracted ${countries.length} countries and ${ports.length} ports.`);

const out = `// Auto-extracted from CheckChinaTransit official NIA dataset (${policy.policyVersion})
export type VisaCategory = 'MUTUAL_VISA_FREE' | 'UNILATERAL_VISA_FREE' | 'TWOV_ONLY';

export interface CountryRule {
  code: string;
  name: string;
  region: string;
  visaCategory: VisaCategory;
  visaFreeDays: number;
}

export interface TransitPort {
  id: string;
  city: string;
  name: string;
  type: 'Airport' | 'Seaport' | 'Railway';
  region: string;
  allowableStayArea: string;
  popular: boolean;
}

export const POLICY_VERSION = ${JSON.stringify(policy.policyVersion)};
export const EFFECTIVE_DATE = ${JSON.stringify(policy.effectiveDate)};

export const COUNTRIES: readonly CountryRule[] = ${JSON.stringify(countries, null, 2)};

export const PORTS: readonly TransitPort[] = ${JSON.stringify(ports, null, 2)};
`;

fs.writeFileSync('E:/Soft/xoesim/china-transit-engine/src/data.ts', out, 'utf8');
