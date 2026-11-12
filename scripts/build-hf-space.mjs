import fs from 'node:fs';
import { COUNTRIES, PORTS, POLICY_VERSION } from '../dist/esm/index.js';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>China 240-Hour Transit Without Visa (TWOV) Calculator</title>
  <style>
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --ink: #0f172a;
      --muted: #475569;
      --line: #e2e8f0;
      --accent: #0f4c81;
      --accent-soft: #eff6ff;
      --ok-bg: #ecfdf5;
      --ok-ink: #065f46;
      --ok-line: #a7f3d0;
      --err-bg: #fef2f2;
      --err-ink: #991b1b;
      --err-line: #fecaca;
      --warn-bg: #fffbeb;
      --warn-ink: #92400e;
      --warn-line: #fde68a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
      padding: 20px 16px 40px;
    }
    .wrap { max-width: 960px; margin: 0 auto; }
    .topbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--line);
    }
    .brand h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
    .brand p { margin: 2px 0 0; font-size: 13px; color: var(--muted); }
    .ext-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
    }
    .ext-btn:hover { opacity: 0.92; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }
    @media (max-width: 780px) { .grid { grid-template-columns: 1fr; } }
    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 18px;
    }
    .card h2 { margin: 0 0 14px; font-size: 15px; font-weight: 700; }
    .field { margin-bottom: 12px; }
    .field label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .field input, .field select {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      background: #fff;
      color: var(--ink);
    }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .pill {
      border: 1px solid var(--line);
      background: #f1f5f9;
      color: var(--ink);
      font-size: 12px;
      padding: 4px 9px;
      border-radius: 999px;
      cursor: pointer;
    }
    .pill:hover { background: #e2e8f0; }
    .checks { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .check-item { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
    .status-box {
      border-radius: 10px;
      padding: 14px;
      border: 1px solid var(--line);
      margin-bottom: 14px;
    }
    .status-box.ok { background: var(--ok-bg); color: var(--ok-ink); border-color: var(--ok-line); }
    .status-box.err { background: var(--err-bg); color: var(--err-ink); border-color: var(--err-line); }
    .status-box.warn { background: var(--warn-bg); color: var(--warn-ink); border-color: var(--warn-line); }
    .status-title { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
    .status-summary { font-size: 13px; margin: 0; }
    .metric-box {
      background: var(--accent-soft);
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 12px;
      font-size: 13px;
    }
    .metric-box strong { color: var(--accent); }
    .list { margin: 6px 0 12px; padding-left: 18px; font-size: 13px; }
    .list li { margin-bottom: 4px; }
    .corridor-tag {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
      font-size: 12px;
      color: var(--muted);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px;
    }
    .footer a { color: var(--accent); font-weight: 600; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="topbar">
      <div class="brand">
        <h1>China 240-Hour TWOV &amp; Visa-Free Eligibility Calculator</h1>
        <p>Offline NIA Policy Engine (${POLICY_VERSION}) · 56 Country Rules · 60 Open Ports</p>
      </div>
      <a class="ext-btn" href="https://checkchinatransit.com" target="_blank" rel="noopener noreferrer">
        Full Guide &amp; Arrival Card Simulator ↗
      </a>
    </header>

    <div class="grid">
      <section class="card">
        <h2>1. Itinerary &amp; Passport Parameters</h2>
        <div class="presets">
          <button type="button" class="pill" data-preset="us-jp">US → Shanghai → Japan (6d)</button>
          <button type="button" class="pill" data-preset="uk-hk">UK → Beijing → Hong Kong (8d)</button>
          <button type="button" class="pill" data-preset="de-rt">Germany Roundtrip (12d)</button>
          <button type="button" class="pill" data-preset="us-trap">US Roundtrip Trap (4d)</button>
        </div>

        <div class="field">
          <label for="nationality">Passport Nationality</label>
          <select id="nationality"></select>
        </div>

        <div class="row2">
          <div class="field">
            <label for="origin">Origin Country / Territory</label>
            <input id="origin" type="text" value="United States" />
          </div>
          <div class="field">
            <label for="destination">Onward Destination</label>
            <input id="destination" type="text" value="Japan" />
          </div>
        </div>

        <div class="row2">
          <div class="field">
            <label for="entryPort">Entry Port (China)</label>
            <select id="entryPort"></select>
          </div>
          <div class="field">
            <label for="exitPort">Exit Port (Open-Jaw Check)</label>
            <select id="exitPort"></select>
          </div>
        </div>

        <div class="row2">
          <div class="field">
            <label for="arrivalDate">Arrival Date (CST)</label>
            <input id="arrivalDate" type="date" />
          </div>
          <div class="field">
            <label for="arrivalTime">Arrival Time (CST)</label>
            <input id="arrivalTime" type="time" value="14:30" />
          </div>
        </div>

        <div class="field">
          <label for="plannedDays">Planned Stay Duration (Calendar Days)</label>
          <input id="plannedDays" type="number" min="1" max="60" value="6" />
        </div>

        <div class="checks">
          <label class="check-item"><input type="checkbox" id="confirmedTicket" checked /> Confirmed onward ticket with fixed date &amp; seat</label>
          <label class="check-item"><input type="checkbox" id="passportValid" checked /> Passport valid for at least 3 months</label>
          <label class="check-item"><input type="checkbox" id="domesticConn" /> Includes domestic multi-province transfer</label>
          <label class="check-item"><input type="checkbox" id="adverseRecord" /> Prior China visa refusal or overstay</label>
        </div>
      </section>

      <section class="card">
        <h2>2. Real-Time Compliance Result</h2>
        <div id="statusBox" class="status-box ok">
          <p id="statusTitle" class="status-title"></p>
          <p id="statusSummary" class="status-summary"></p>
        </div>

        <div id="clockBox" class="metric-box"></div>
        <div id="corridorBox" class="metric-box"></div>

        <div id="reasonsWrap">
          <strong style="font-size:13px;">Blocking Factors / Advisories:</strong>
          <ul id="reasonsList" class="list"></ul>
        </div>

        <div id="checklistWrap">
          <strong style="font-size:13px;">Border Inspection Checklist:</strong>
          <ul id="checklistList" class="list"></ul>
        </div>

        <div style="margin-top:12px; font-size:12px; color:#475569;">
          Need the printable Arrival Card simulator, eSIM setup, or Alipay/WeChat Pay guide?
          <a href="https://checkchinatransit.com" target="_blank" rel="noopener noreferrer" style="color:#0f4c81; font-weight:600;">
            Open CheckChinaTransit.com ↗
          </a>
        </div>
      </section>
    </div>

    <footer class="footer">
      <span>Powered by <a href="https://checkchinatransit.com" target="_blank" rel="noopener noreferrer">CheckChinaTransit.com</a> · Open-source engine: <code>china-transit-engine</code></span>
      <span>Independent procedural guide based on NIA ${POLICY_VERSION}. Verify with airline before departure.</span>
    </footer>
  </div>

  <script>
    const COUNTRIES = ${JSON.stringify(COUNTRIES)};
    const PORTS = ${JSON.stringify(PORTS)};
    const ALIASES = {
      usa: 'united states', us: 'united states', 'united states of america': 'united states',
      uk: 'united kingdom', gb: 'united kingdom',
      'hong kong': 'hong kong sar', 'hong kong (hkg)': 'hong kong sar', hkg: 'hong kong sar', hk: 'hong kong sar',
      macau: 'macau sar', 'macau (mfm)': 'macau sar', mfm: 'macau sar', mo: 'macau sar',
      taiwan: 'taiwan', 'taiwan (tpe)': 'taiwan', tpe: 'taiwan', tw: 'taiwan',
      korea: 'south korea', kr: 'south korea', jp: 'japan', sg: 'singapore', de: 'germany'
    };

    function norm(v) {
      const s = String(v || '').trim().toLowerCase().replace(/\\s+/g, ' ');
      return ALIASES[s] || s;
    }

    function pad2(n) { return String(n).padStart(2, '0'); }

    function calcClock(dateStr, timeStr, hours) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const [hh, mm] = (timeStr || '12:00').split(':').map(Number);
      const arrMs = Date.UTC(y, m - 1, d, hh, mm, 0);
      const startMs = Date.UTC(y, m - 1, d + 1, 0, 0, 0);
      const days = Math.max(1, Math.floor(hours / 24));
      const endMs = Date.UTC(y, m - 1, d + days, 23, 59, 0);
      const fmt = (ms) => {
        const dt = new Date(ms);
        return dt.getUTCFullYear() + '-' + pad2(dt.getUTCMonth() + 1) + '-' + pad2(dt.getUTCDate()) + ' ' + pad2(dt.getUTCHours()) + ':' + pad2(dt.getUTCMinutes()) + ' CST';
      };
      return {
        start: fmt(startMs),
        end: fmt(endMs),
        bonus: ((startMs - arrMs) / 3600000).toFixed(1),
        total: ((endMs - arrMs) / 3600000).toFixed(1)
      };
    }

    const els = {
      nat: document.getElementById('nationality'),
      orig: document.getElementById('origin'),
      dest: document.getElementById('destination'),
      entry: document.getElementById('entryPort'),
      exit: document.getElementById('exitPort'),
      date: document.getElementById('arrivalDate'),
      time: document.getElementById('arrivalTime'),
      days: document.getElementById('plannedDays'),
      ticket: document.getElementById('confirmedTicket'),
      passport: document.getElementById('passportValid'),
      domestic: document.getElementById('domesticConn'),
      adverse: document.getElementById('adverseRecord'),
      statusBox: document.getElementById('statusBox'),
      statusTitle: document.getElementById('statusTitle'),
      statusSummary: document.getElementById('statusSummary'),
      clockBox: document.getElementById('clockBox'),
      corridorBox: document.getElementById('corridorBox'),
      reasonsWrap: document.getElementById('reasonsWrap'),
      reasonsList: document.getElementById('reasonsList'),
      checklistWrap: document.getElementById('checklistWrap'),
      checklistList: document.getElementById('checklistList'),
    };

    // Init options
    COUNTRIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = c.name + ' (' + c.code + ') — ' + c.visaCategory.replace(/_/g, ' ');
      els.nat.appendChild(opt);
    });
    const otherOpt = document.createElement('option');
    otherOpt.value = 'OTHER';
    otherOpt.textContent = 'Other Country (Not on 56-Nation List)';
    els.nat.appendChild(otherOpt);
    els.nat.value = 'US';

    PORTS.forEach(p => {
      [els.entry, els.exit].forEach(sel => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.city + ' — ' + p.name;
        sel.appendChild(opt);
      });
    });
    els.entry.value = 'shanghai-pudong';
    els.exit.value = 'shanghai-pudong';

    const today = new Date();
    els.date.value = today.getUTCFullYear() + '-' + pad2(today.getUTCMonth() + 1) + '-' + pad2(today.getUTCDate());

    function render() {
      const country = COUNTRIES.find(c => c.code === els.nat.value);
      const entryPort = PORTS.find(p => p.id === els.entry.value) || PORTS[0];
      const exitPort = PORTS.find(p => p.id === els.exit.value) || entryPort;
      const days = Math.max(1, Number(els.days.value) || 1);
      const isRoundtrip = norm(els.orig.value) !== '' && norm(els.orig.value) === norm(els.dest.value);

      let status = 'ok';
      let title = '';
      let summary = '';
      let maxHours = 240;
      const reasons = [];
      const checklist = [];

      if (els.adverse.checked) {
        status = 'warn';
        title = 'Consular Pre-Clearance Required';
        summary = 'Prior immigration refusals or overstays require standard embassy pre-approval.';
        reasons.push('Adverse border record flagged.');
        maxHours = 0;
      } else if (!els.passport.checked) {
        status = 'err';
        title = 'Not Eligible: Passport Validity < 3 Months';
        summary = 'Chinese border authorities require at least 3 months remaining passport validity.';
        reasons.push('Passport validity under 3 months.');
        maxHours = 0;
      } else if (country && country.visaCategory === 'MUTUAL_VISA_FREE') {
        maxHours = 720;
        if (days <= 30) {
          title = 'Eligible: 30-Day Bilateral Mutual Visa Exemption';
          summary = country.name + ' citizens enjoy 30-day visa-free entry nationwide. Roundtrips permitted.';
          checklist.push('Valid passport (>= 3 months)', 'Return/onward ticket within 30 days', 'Hotel address');
        } else {
          status = 'err';
          title = 'Exceeds 30-Day Mutual Exemption Limit';
          summary = days + ' days exceeds the 30-day bilateral limit.';
          reasons.push('Shorten stay to <= 30 days or apply for an L Visa.');
        }
      } else if (country && country.visaCategory === 'UNILATERAL_VISA_FREE') {
        maxHours = 360;
        if (days <= 15) {
          title = 'Eligible: 15-Day Unilateral Visa-Free Entry';
          summary = country.name + ' citizens qualify for 15-day unilateral visa-free entry nationwide. Roundtrips permitted.';
          checklist.push('Valid passport (>= 3 months)', 'Return/onward ticket within 15 days', 'Hotel address');
        } else {
          status = 'err';
          title = 'Exceeds 15-Day Unilateral Visa-Free Limit';
          summary = days + ' days exceeds the 15-day limit.';
          reasons.push('Shorten stay to <= 15 days or apply for an L/M Visa.');
        }
      } else {
        if (!country) reasons.push('Nationality is not included in the 54-nation 240h TWOV list.');
        if (!els.ticket.checked) reasons.push('Confirmed onward ticket to a third country/territory is mandatory.');
        else if (isRoundtrip) reasons.push('Roundtrip trap: ' + els.orig.value + ' -> China -> ' + els.dest.value + ' is invalid for 240h TWOV.');
        if (days > 10) reasons.push('Planned stay (' + days + ' days) exceeds 240 hours (10 calendar days).');
        if (els.domestic.checked && days > 1) reasons.push('Multi-province domestic transfer requires verifying 240h inter-provincial port pairing.');

        if (reasons.length === 0) {
          title = 'Eligible: 240-Hour (10-Day) Transit Without Visa';
          summary = country.name + ' passport + third-country route (' + els.orig.value + ' -> ' + entryPort.city + ' -> ' + els.dest.value + ') qualifies.';
          checklist.push(
            'Valid passport (>= 3 months)',
            'Confirmed onward ticket to ' + els.dest.value + ' within 240 hours',
            'Blue Temporary Entry Arrival Card',
            'Hotel reservation in China'
          );
        } else {
          status = 'err';
          title = 'Not Eligible for 240-Hour TWOV';
          summary = reasons[0];
        }
      }

      els.statusBox.className = 'status-box ' + status;
      els.statusTitle.textContent = title;
      els.statusSummary.textContent = summary;

      if (maxHours > 0 && els.date.value) {
        const clk = calcClock(els.date.value, els.time.value, maxHours);
        els.clockBox.style.display = 'block';
        els.clockBox.innerHTML =
          '<strong>NIA Midnight Clock:</strong> Starts <code>' + clk.start + '</code> · Must depart by <code>' + clk.end + '</code><br/>' +
          '<span style="color:#475569;">Arrival day bonus: +' + clk.bonus + 'h free (Total window: ' + clk.total + 'h)</span>';
      } else {
        els.clockBox.style.display = 'none';
      }

      const samePort = entryPort.id === exitPort.id;
      const sameReg = samePort || entryPort.region === exitPort.region || (entryPort.region.includes('Yangtze River Delta') && exitPort.region.includes('Yangtze River Delta'));
      els.corridorBox.innerHTML =
        '<strong>Open-Jaw Port Check:</strong> ' +
        (samePort ? 'Single-port entry/exit (' + entryPort.city + ')' : sameReg ? 'Allowed within ' + entryPort.region : 'Cross-region (' + entryPort.region + ' -> ' + exitPort.region + ') — verify 240h inter-provincial rule') +
        '<br/><span style="color:#475569;">Permitted Area: ' + entryPort.allowableStayArea + '</span>';

      els.reasonsWrap.style.display = reasons.length ? 'block' : 'none';
      els.reasonsList.innerHTML = reasons.map(r => '<li>' + r + '</li>').join('');

      els.checklistWrap.style.display = checklist.length ? 'block' : 'none';
      els.checklistList.innerHTML = checklist.map(c => '<li>' + c + '</li>').join('');
    }

    document.querySelectorAll('.pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.preset;
        els.adverse.checked = false;
        els.passport.checked = true;
        els.ticket.checked = true;
        els.domestic.checked = false;
        if (p === 'us-jp') { els.nat.value = 'US'; els.orig.value = 'United States'; els.dest.value = 'Japan'; els.entry.value = 'shanghai-pudong'; els.exit.value = 'shanghai-pudong'; els.days.value = 6; }
        if (p === 'uk-hk') { els.nat.value = 'GB'; els.orig.value = 'United Kingdom'; els.dest.value = 'Hong Kong (HKG)'; els.entry.value = 'beijing-capital'; els.exit.value = 'beijing-capital'; els.days.value = 8; }
        if (p === 'de-rt') { els.nat.value = 'DE'; els.orig.value = 'Germany'; els.dest.value = 'Germany'; els.entry.value = 'shanghai-pudong'; els.exit.value = 'hangzhou-xiaoshan'; els.days.value = 12; }
        if (p === 'us-trap') { els.nat.value = 'US'; els.orig.value = 'USA'; els.dest.value = 'United States'; els.entry.value = 'beijing-daxing'; els.exit.value = 'beijing-daxing'; els.days.value = 4; }
        render();
      });
    });

    ['change', 'input'].forEach(evt => {
      document.querySelectorAll('input, select').forEach(el => el.addEventListener(evt, render));
    });

    render();
  </script>
</body>
</html>
`;

fs.writeFileSync('E:/Soft/xoesim/china-transit-engine/hf-space/index.html', html, 'utf8');
console.log('Generated hf-space/index.html (' + html.length + ' bytes)');
