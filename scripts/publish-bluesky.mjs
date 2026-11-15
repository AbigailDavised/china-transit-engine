import fs from 'node:fs';

const CRED_PATH = 'E:/Soft/key/bluesky_credentials.json';
if (!fs.existsSync(CRED_PATH)) {
  console.error(`[ABORT] Missing ${CRED_PATH}`);
  process.exit(1);
}

const { handle, app_password, service } = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
const BASE = service || 'https://bsky.social';

function buildLinkFacets(text, links) {
  const enc = new TextEncoder();
  const facets = [];
  for (const url of links) {
    const idx = text.indexOf(url);
    if (idx === -1) continue;
    const byteStart = enc.encode(text.slice(0, idx)).byteLength;
    const byteEnd = byteStart + enc.encode(url).byteLength;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }
  return facets;
}

async function main() {
  // 1. Create ATProto session
  const authRes = await fetch(`${BASE}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: handle, password: app_password }),
  });
  if (!authRes.ok) {
    throw new Error(`Bluesky login failed: ${authRes.status} ${await authRes.text()}`);
  }
  const session = await authRes.json();
  console.log(`[Bluesky] Logged in as ${session.handle} (${session.did})`);

  // 2. Upload Launch Kit v3.0 cover.png thumbnail (fallback to remote og-preview.png)
  const LOCAL_COVER = 'E:/Soft/misc/backlink-pipeline/site-assets/checkchinatransit.com/cover.png';
  let thumbBlob = undefined;
  try {
    let imgBuf = null;
    if (fs.existsSync(LOCAL_COVER)) {
      imgBuf = fs.readFileSync(LOCAL_COVER);
    } else {
      const imgRes = await fetch('https://checkchinatransit.com/og-preview.png');
      if (imgRes.ok) imgBuf = Buffer.from(await imgRes.arrayBuffer());
    }
    if (imgBuf) {
      const upRes = await fetch(`${BASE}/xrpc/com.atproto.repo.uploadBlob`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessJwt}`,
          'Content-Type': 'image/png',
        },
        body: imgBuf,
      });
      if (upRes.ok) {
        const upData = await upRes.json();
        thumbBlob = upData.blob;
        console.log('[Bluesky] Uploaded cover.png thumbnail blob.');
      }
    }
  } catch (e) {
    console.warn('[Bluesky] Thumbnail upload skipped:', e.message);
  }

  // 3. Compose rich post with clickable facets & external card
  const targetUrl = 'https://checkchinatransit.com';
  const text =
    `Just open-sourced china-transit-engine (v1.0.1, 0-dep TypeScript) + a 2026–2027 China 240h TWOV dataset (56 countries, 60 ports) on Kaggle & HF Spaces.\n\n` +
    `npm: https://deps.dev/npm/china-transit-engine\n` +
    `Kaggle: https://www.kaggle.com/datasets/sotomo/china-240h-visa-free-transit-ports-2026-2027`;

  const facets = buildLinkFacets(text, [
    'https://deps.dev/npm/china-transit-engine',
    'https://www.kaggle.com/datasets/sotomo/china-240h-visa-free-transit-ports-2026-2027',
  ]);

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    facets,
    langs: ['en'],
    createdAt: new Date().toISOString(),
    embed: {
      $type: 'app.bsky.embed.external',
      external: {
        uri: targetUrl,
        title: 'CheckChinaTransit — 2026–2027 China 240-Hour Visa-Free Transit Checker',
        description:
          'Interactive eligibility checker, 60-port open-jaw corridor matrix, and official NIA 00:00 midnight clock calculator.',
        ...(thumbBlob ? { thumb: thumbBlob } : {}),
      },
    },
  };

  const postRes = await fetch(`${BASE}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  });

  if (!postRes.ok) {
    throw new Error(`Post failed: ${postRes.status} ${await postRes.text()}`);
  }
  const postData = await postRes.json();
  const rkey = postData.uri.split('/').pop();
  const webUrl = `https://bsky.app/profile/${session.handle}/post/${rkey}`;
  console.log(`[Bluesky] Post published: ${webUrl}`);
}

main().catch((err) => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
