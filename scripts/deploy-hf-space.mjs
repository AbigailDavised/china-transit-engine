import fs from 'node:fs';
import path from 'node:path';

const TOKEN_PATH = 'E:/Soft/key/huggingface_token.txt';
const HF_TOKEN =
  process.env.HF_TOKEN ||
  (fs.existsSync(TOKEN_PATH) ? fs.readFileSync(TOKEN_PATH, 'utf8').trim() : '');

const REPO_NAME = process.env.HF_SPACE_NAME || 'china-transit-twov-calculator';

if (!HF_TOKEN) {
  console.error(
    `[ABORT] Missing Hugging Face Write Token.\n` +
      `Set env HF_TOKEN or save your token to ${TOKEN_PATH}.`
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${HF_TOKEN}`,
  'Content-Type': 'application/json',
};

function checkRateLimit(res) {
  const rl = res.headers.get('ratelimit') || res.headers.get('x-ratelimit-remaining');
  if (rl) console.log(`[RateLimit] ${rl}`);
  if (res.status === 429) {
    throw new Error('HTTP 429 Rate Limit hit! Halting immediately to prevent 21h repo-creation cooldown.');
  }
}

async function main() {
  // 1. Identify current HF user
  const whoRes = await fetch('https://huggingface.co/api/whoami-v2', { headers });
  checkRateLimit(whoRes);
  if (!whoRes.ok) {
    throw new Error(`whoami failed: ${whoRes.status} ${await whoRes.text()}`);
  }
  const who = await whoRes.json();
  const username = who.name;
  const repoId = `${username}/${REPO_NAME}`;
  console.log(`[HF] Authenticated as ${username}. Target Space: ${repoId}`);

  // 2. Create Static Space (idempotent if already exists -> 409)
  const createRes = await fetch('https://huggingface.co/api/repos/create', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'space',
      name: REPO_NAME,
      sdk: 'static',
      private: false,
    }),
  });
  checkRateLimit(createRes);
  if (createRes.status === 409) {
    console.log(`[HF] Space ${repoId} already exists, proceeding to atomic commit.`);
  } else if (!createRes.ok) {
    throw new Error(`Repo create failed: ${createRes.status} ${await createRes.text()}`);
  } else {
    console.log(`[HF] Created Static Space: https://huggingface.co/spaces/${repoId}`);
  }

  // 3. Single Atomic Commit (README.md + index.html in one NDJSON request)
  const readmeB64 = fs.readFileSync(path.resolve('hf-space/README.md')).toString('base64');
  const htmlB64 = fs.readFileSync(path.resolve('hf-space/index.html')).toString('base64');

  const ndjson = [
    JSON.stringify({
      key: 'header',
      value: { summary: 'Deploy standalone China 240h TWOV Static Space (atomic commit)' },
    }),
    JSON.stringify({
      key: 'file',
      value: { path: 'README.md', encoding: 'base64', content: readmeB64 },
    }),
    JSON.stringify({
      key: 'file',
      value: { path: 'index.html', encoding: 'base64', content: htmlB64 },
    }),
  ].join('\n');

  const commitRes = await fetch(`https://huggingface.co/api/spaces/${repoId}/commit/main`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/x-ndjson',
    },
    body: ndjson,
  });
  checkRateLimit(commitRes);
  if (!commitRes.ok) {
    throw new Error(`Atomic commit failed: ${commitRes.status} ${await commitRes.text()}`);
  }
  const commitData = await commitRes.json();
  console.log(`[HF] Atomic commit success: ${commitData.commitUrl || 'OK'}`);
  console.log(`[HF] Live Space URL: https://huggingface.co/spaces/${repoId}`);
}

main().catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
