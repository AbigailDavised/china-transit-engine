import { createRequire } from 'node:module';
import crypto from 'node:crypto';

const require = createRequire(import.meta.url);
const Database = require('E:/Soft/misc/backlink-pipeline/node_modules/better-sqlite3');

const DB_PATH = 'E:/Soft/misc/backlink-pipeline/apps/worker/data/backlink.db';
const db = new Database(DB_PATH);

const entries = [
  {
    canonical_domain: 'huggingface.co',
    channel: 'ecosystem_parasite',
    entry_url: 'https://huggingface.co/spaces/AbigailDavised/china-transit-twov-calculator',
    title: 'China 240-Hour Transit Without Visa (TWOV) Calculator — HF Static Space',
    language: 'en',
  },
];

const stmt = db.prepare(`
  INSERT OR IGNORE INTO targets (
    id, canonical_domain, channel, entry_url, title, language, idempotency_key, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = Math.floor(Date.now() / 1000);
for (const item of entries) {
  const idem = crypto.createHash('sha256').update(item.entry_url).digest('hex').slice(0, 24);
  const id = `tgt_${idem}`;
  const info = stmt.run(
    id,
    item.canonical_domain,
    item.channel,
    item.entry_url,
    item.title,
    item.language,
    idem,
    now
  );
  console.log(`[backlink.db] ${item.entry_url} -> changes=${info.changes}`);
}

db.close();
