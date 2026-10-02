/** Premium session poster layout (matches approved SS1 design, 1055×1491). */

export const PREMIUM_POSTER_WIDTH_PX = 1055
export const PREMIUM_POSTER_HEIGHT_PX = 1491

const TOPIC_ICON_COLORS = [
  "#7c3aed",
  "#16a34a",
  "#ea580c",
  "#0ea5e9",
  "#dc2626",
  "#4f46e5",
  "#0891b2",
  "#ca8a04",
  "#059669",
  "#db2777",
]

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * @param {Parameters<import('./build-poster-html.mjs').buildPosterHtml>[0] & {
 *   assets: import('./build-poster-html.mjs').buildPosterHtml extends (d: infer P) => unknown ? P extends { assets: infer A } ? A & { heroBanner?: string } : never : never;
 *   focus?: string;
 * }} data
 */
export function buildPremiumPosterHtml(data) {
  const W = PREMIUM_POSTER_WIDTH_PX
  const H = PREMIUM_POSTER_HEIGHT_PX
  const chair = data.chairs[0]
  const chairLine = chair
    ? `${chair.name}${chair.affiliation ? ` — ${chair.affiliation}` : ""}`
    : "To be announced"

  const topicsHtml = data.topics
    .map((topic, i) => {
      const color = TOPIC_ICON_COLORS[i % TOPIC_ICON_COLORS.length]
      return `<li><span class="topic-ico" style="background:${color}"></span><span>${escapeHtml(topic)}</span></li>`
    })
    .join("")

  const heroBanner =
    data.assets.heroBanner ?? data.assets.heroSkyline

  const keywords =
    "INNOVATION | SECURITY | SUSTAINABILITY | SMARTER TOMORROW"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(data.code)} — TAIIS 2026</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${W}px; height: ${H}px; overflow: hidden;
      font-family: "DM Sans", Arial, sans-serif;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .poster { width: ${W}px; min-height: ${H}px; background: #fff; color: #0f172a; }

    .header {
      display: grid; grid-template-columns: 1.1fr 0.9fr 1fr;
      align-items: center; gap: 8px;
      padding: 14px 18px 10px;
    }
    .header-asia img { max-height: 54px; width: 100%; object-fit: contain; object-position: left; }
    .header-ccri { text-align: center; }
    .header-ccri img { height: 62px; object-fit: contain; }
    .header-right {
      text-align: right; font-size: 8px; font-weight: 800;
      letter-spacing: 0.06em; text-transform: uppercase; color: #1d4ed8; line-height: 1.45;
    }

    .title-wrap { text-align: center; padding: 4px 24px 10px; }
    .conf-title { font-size: 21px; font-weight: 800; line-height: 1.15; color: #0a1847; }
    .conf-title .teal { color: #0d9488; }
    .conf-title .year { font-weight: 700; color: #334155; }

    .session-row { padding: 0 22px; display: flex; gap: 0; align-items: stretch; }
    .code-pill {
      width: 72px; flex-shrink: 0;
      background: linear-gradient(180deg, #312e81, #4338ca);
      color: #fff; border-radius: 14px 0 0 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800;
    }
    .session-box {
      flex: 1; background: linear-gradient(90deg, #ede9fe, #e0e7ff);
      border: 2px solid #a5b4fc; border-left: none;
      border-radius: 0 14px 14px 0; padding: 10px 14px;
    }
    .session-box h2 { font-size: 13px; font-weight: 800; line-height: 1.25; color: #1e1b4b; }
    .session-box .kw { margin-top: 5px; font-size: 7px; font-weight: 700; letter-spacing: 0.06em; color: #64748b; }

    .chair-wrap { text-align: center; padding: 10px 22px 6px; }
    .chair-badge {
      display: inline-block; background: #2563eb; color: #fff;
      font-size: 8px; font-weight: 800; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
    }
    .chair-name { margin-top: 5px; font-size: 12px; font-weight: 800; color: #0a1847; }
    .chair-aff { font-size: 9px; color: #475569; margin-top: 2px; }

    .hero {
      position: relative; height: 220px; margin: 6px 18px 0; border-radius: 12px; overflow: hidden;
    }
    .hero img { width: 100%; height: 100%; object-fit: cover; }
    .hero-shade {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0.15) 100%);
    }
    .hero-quote {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      max-width: 42%; font-size: 13px; font-weight: 800; line-height: 1.25; color: #0a1847;
    }
    .hero-script {
      position: absolute; right: 14px; bottom: 12px;
      font-family: "Instrument Serif", Georgia, serif; font-style: italic;
      font-size: 15px; color: #1e293b; text-align: right;
    }

    .info-row {
      display: grid; grid-template-columns: 1fr 1fr 0.85fr; gap: 10px;
      padding: 12px 22px 8px;
    }
    .info-box {
      border: 2px solid #93c5fd; border-radius: 12px; padding: 10px 12px;
      display: flex; gap: 8px; align-items: flex-start; background: #fff;
      font-size: 8px; font-weight: 600; color: #475569;
    }
    .info-box.teal { border-color: #5eead4; }
    .info-box.loc { border-color: #60a5fa; align-items: center; justify-content: center; text-align: center; flex-direction: column; }
    .info-box .ico { font-size: 18px; line-height: 1; }
    .info-box strong { display: block; margin-top: 2px; font-size: 10px; color: #0a1847; }
    .loc-text { font-size: 16px; font-weight: 800; color: #2563eb; margin-top: 4px; }

    .topics-section { margin: 8px 22px; border-radius: 12px; overflow: hidden; border: 1px solid #99f6e4; }
    .topics-head {
      background: linear-gradient(90deg, #0f766e, #14b8a6);
      color: #fff; text-align: center; font-size: 12px; font-weight: 800;
      letter-spacing: 0.12em; text-transform: uppercase; padding: 8px;
    }
    .topics-grid {
      list-style: none; padding: 10px 12px 12px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px;
      background: #f8fafc;
    }
    .topics-grid li {
      display: flex; gap: 8px; align-items: flex-start;
      font-size: 8.5px; line-height: 1.28; color: #334155;
    }
    .topic-ico {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
      margin-top: 1px; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.35);
    }

    .pub-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
      margin: 10px 22px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;
      font-size: 7px; line-height: 1.35; color: #475569;
    }
    .pub-col { padding: 8px 10px; }
    .pub-col.pub { background: #fff7ed; }
    .pub-col.idx { background: #f0fdfa; border-left: 1px solid #e2e8f0; }
    .pub-head { font-size: 8px; font-weight: 800; letter-spacing: 0.06em; margin-bottom: 5px; }
    .pub-col.pub .pub-head { color: #c2410c; }
    .pub-col.idx .pub-head { color: #0f766e; }
    .pub-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 4px; }
    .pub-logos img { max-height: 24px; object-fit: contain; }
    .pub-logos .lnee { max-height: 34px; }

    .footer {
      margin-top: 8px; background: linear-gradient(180deg, #0a1847, #06102a);
      color: #e2e8f0; padding: 14px 18px 16px;
      display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center;
      min-height: 130px;
    }
    .footer-qr img { width: 88px; height: 88px; background: #fff; border-radius: 6px; padding: 4px; }
    .footer-qr p { font-size: 7px; font-weight: 800; text-align: center; margin-top: 4px; color: #67f0ff; letter-spacing: 0.06em; }
    .footer-mid { font-size: 8px; }
    .footer-mid .site-label { font-weight: 700; color: #cbd5e1; }
    .footer-mid .site-url {
      display: inline-block; margin-top: 4px; background: #fff; color: #0a1847;
      font-weight: 800; font-size: 11px; padding: 6px 12px; border-radius: 6px;
    }
    .footer-right { text-align: right; font-size: 8px; font-weight: 700; color: #94a3b8; }
    .footer-right .script {
      font-family: "Instrument Serif", Georgia, serif; font-style: italic;
      font-size: 16px; color: #fff; margin-top: 4px;
    }
  </style>
</head>
<body>
  <article class="poster">
    <header class="header">
      <div class="header-asia"><img src="${data.assets.asiaUniversity}" alt="Asia University" /></div>
      <div class="header-ccri"><img src="${data.assets.ccri}" alt="CCRIO" /></div>
      <div class="header-right">
        <p>Research Collaboration</p>
        <p>Social Impact</p>
        <p>A Brighter Tomorrow</p>
      </div>
    </header>

    <section class="title-wrap">
      <h1 class="conf-title">
        International Conference on <span class="teal">Trustworthy AI</span> and
        <span class="teal">Intelligent IoT Systems</span> <span class="year">(TAIIS 2026)</span>
      </h1>
    </section>

    <section class="session-row">
      <div class="code-pill">${escapeHtml(data.code)}:</div>
      <div class="session-box">
        <h2>${escapeHtml(data.title)}</h2>
        <p class="kw">${keywords}</p>
      </div>
    </section>

    <section class="chair-wrap">
      <span class="chair-badge">Session Chair</span>
      <p class="chair-name">${escapeHtml(chair?.name ?? "TBA")}</p>
      ${chair?.affiliation ? `<p class="chair-aff">${escapeHtml(chair.affiliation)}</p>` : ""}
    </section>

    <section class="hero">
      <img src="${heroBanner}" alt="" />
      <div class="hero-shade"></div>
      <p class="hero-quote">Building Intelligent Systems for a Secure, Sustainable and Inclusive Future</p>
      <p class="hero-script">Taiwan — A Hub for Global Ideas</p>
    </section>

    <section class="info-row">
      <div class="info-box">
        <span class="ico">📅</span>
        <div>Paper Submission Deadline<strong>${escapeHtml(data.conference.submissionDeadline)}</strong></div>
      </div>
      <div class="info-box teal">
        <span class="ico">📅</span>
        <div>Conference Dates<strong>${escapeHtml(data.conference.dates)}</strong></div>
      </div>
      <div class="info-box loc">
        <span class="ico">📍</span>
        <p class="loc-text">Taichung, Taiwan</p>
      </div>
    </section>

    <section class="topics-section">
      <div class="topics-head">List of Topics</div>
      <ul class="topics-grid">${topicsHtml}</ul>
    </section>

    <section class="pub-row">
      <div class="pub-col pub">
        <p class="pub-head">Publication</p>
        <div class="pub-logos">
          <img src="${data.assets.springer}" alt="Springer" />
          <img class="lnee" src="${data.assets.lnee}" alt="LNEE" />
        </div>
        <p>It is planned to publish the peer reviewed and selected papers of the conference in the prestigious <strong>Lecture Notes in Electrical Engineering</strong> series by Springer.</p>
      </div>
      <div class="pub-col idx">
        <p class="pub-head">Indexing</p>
        <div class="pub-logos">
          <img src="${data.assets.scopus}" alt="Scopus" />
          <img src="${data.assets.compendex}" alt="Ei Compendex" />
        </div>
        <p>The conference proceedings will be submitted for indexing in <strong>Scopus</strong> and <strong>Ei Compendex</strong>.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-qr">
        <img src="${data.assets.websiteQr}" alt="QR" />
        <p>SCAN FOR DETAILS</p>
      </div>
      <div class="footer-mid">
        <p class="site-label">🌐 Conference Website</p>
        <p class="site-url">${escapeHtml(data.conference.website)}</p>
        <p style="margin-top:6px;font-size:7px;color:#94a3b8">Submit on Microsoft CMT — select <strong style="color:#67f0ff">${escapeHtml(data.code)}</strong></p>
      </div>
      <div class="footer-right">
        <p>TAICHUNG · TAIWAN</p>
        <p>People · Culture · Opportunity</p>
        <p class="script">Ideas for a Better Tomorrow</p>
      </div>
    </footer>
  </article>
</body>
</html>`
}
