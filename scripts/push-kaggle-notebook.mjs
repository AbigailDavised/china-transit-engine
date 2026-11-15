import fs from 'node:fs';

const KEY_PATH = 'E:/Soft/key/kaggle.json';
const { username, key } = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
const authHeader = 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');

const DATASET_REF = `${username}/china-240h-visa-free-transit-ports-2026-2027`;
const KERNEL_SLUG = `${username}/china-240h-twov-ports-eda-2026-2027`;

const notebook = {
  nbformat: 4,
  nbformat_minor: 5,
  metadata: {
    kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
    language_info: { name: 'python', version: '3.10.12' },
  },
  cells: [
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        '# 2026–2027 China 240-Hour Visa-Free Transit (TWOV) Ports & Country Rules EDA\n\n',
        'Exploratory analysis of China\'s **56 eligible passport rules** (30-Day Mutual, 15-Day Unilateral, 240-Hour TWOV) and **60 designated air, sea, and railway ports**.\n\n',
        '- Interactive Eligibility Checker & Arrival Card Simulator: [CheckChinaTransit.com](https://checkchinatransit.com)\n',
        '- Zero-Dependency npm Engine (`china-transit-engine`): [deps.dev](https://deps.dev/npm/china-transit-engine)\n',
        '- Offline Browser Calculator: [GitHub Pages](https://abigaildavised.github.io/china-transit-engine/)\n',
      ],
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        'import pandas as pd\n',
        'import matplotlib.pyplot as plt\n\n',
        'BASE = "/kaggle/input/china-240h-visa-free-transit-ports-2026-2027"\n',
        'countries = pd.read_csv(f"{BASE}/china_twov_countries_56.csv")\n',
        'ports = pd.read_csv(f"{BASE}/china_twov_ports_60.csv")\n\n',
        'print(f"Loaded {len(countries)} country rules and {len(ports)} open ports.")\n',
        'display(countries["visa_category"].value_counts().to_frame("country_count"))\n',
        'display(ports["type"].value_counts().to_frame("port_count"))\n',
      ],
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        'fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n',
        'tier_counts = countries["visa_category"].value_counts()\n',
        'tier_counts.plot(kind="bar", ax=axes[0], color=["#0f4c81", "#16a34a", "#ea580c"])\n',
        'axes[0].set_title("Eligible Passports by Exemption Tier (56 Rules)")\n',
        'axes[0].set_ylabel("Countries")\n',
        'axes[0].tick_params(axis="x", rotation=20)\n\n',
        'top_regions = ports["region"].value_counts().head(10)\n',
        'top_regions.sort_values().plot(kind="barh", ax=axes[1], color="#0284c7")\n',
        'axes[1].set_title("Top 10 Regional Corridors by Open Entry Ports")\n',
        'axes[1].set_xlabel("Number of Eligible Ports")\n\n',
        'plt.tight_layout()\n',
        'plt.show()\n',
      ],
    },
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        '## Key Takeaways for Travelers\n',
        '1. **Roundtrip Trap**: Travelers under `TWOV_ONLY` must depart to a separate third country or territory (e.g., Hong Kong SAR, Macau SAR, Taiwan, Japan). Direct `A -> China -> A` roundtrips are rejected.\n',
        '2. **NIA Next-Day 00:00 Clock**: Statutory 240-hour counting begins at `00:00` on the day following entry, granting up to ~24 extra bonus hours on arrival day.\n\n',
        'Test specific flight itineraries live at [CheckChinaTransit.com](https://checkchinatransit.com).\n',
      ],
    },
  ],
};

async function main() {
  const payload = {
    slug: KERNEL_SLUG,
    newTitle: 'China 240h TWOV Ports & Visa-Free EDA (2026–2027)',
    text: JSON.stringify(notebook),
    language: 'python',
    kernelType: 'notebook',
    isPrivate: false,
    enableGpu: false,
    enableInternet: false,
    datasetDataSources: [DATASET_REF],
    competitionDataSources: [],
    kernelDataSources: [],
  };

  const res = await fetch('https://www.kaggle.com/api/v1/kernels/push', {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Kernel push failed: ${res.status} ${text}`);
  }
  console.log('[Kaggle] Kernel push response:', text);
  console.log(`[Kaggle] Notebook URL: https://www.kaggle.com/code/${KERNEL_SLUG}`);
}

main().catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
