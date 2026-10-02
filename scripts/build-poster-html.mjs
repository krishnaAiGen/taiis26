/** TAIIS 2026 session/workshop CFP poster — built from layered assets (682×1024). */

export const POSTER_WIDTH_PX = 682
export const POSTER_HEIGHT_PX = 1024

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * @param {{
 *   assets: {
 *     asiaUniversity: string;
 *     ccri: string;
 *     heroSkyline: string;
 *     springer: string;
 *     lnee: string;
 *     scopus: string;
 *     compendex: string;
 *     websiteQr: string;
 *   };
 *   conference: {
 *     fullName: string;
 *     shortName: string;
 *     dates: string;
 *     submissionDeadline: string;
 *     location: string;
 *     website: string;
 *     email: string;
 *   };
 *   eventKind: "Special Session" | "Workshop";
 *   code: string;
 *   title: string;
 *   chairs: { name: string; affiliation: string }[];
 *   topics: string[];
 *   cmtQrDataUrl: string;
 * }} data
 */
export function buildPosterHtml(data) {
  const chairsHtml = data.chairs
    .map(
      (c) =>
        `<p class="chair-line"><strong>${escapeHtml(c.name)}</strong>${escapeHtml(c.affiliation ? ` — ${c.affiliation}` : "")}</p>`,
    )
    .join("")

  const topicsHtml = data.topics
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join("")

  const titleParts = data.conference.fullName.match(
    /^(International Conference on )(.+)$/i,
  )
  const titleLead = titleParts ? titleParts[1] : ""
  const titleCore = titleParts ? titleParts[2] : data.conference.fullName

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(data.code)} — ${escapeHtml(data.conference.shortName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=Instrument+Serif&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: ${POSTER_WIDTH_PX}px;
      height: ${POSTER_HEIGHT_PX}px;
      overflow: hidden;
      font-family: "DM Sans", Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .poster {
      width: ${POSTER_WIDTH_PX}px;
      height: ${POSTER_HEIGHT_PX}px;
      background: #fff;
      display: flex;
      flex-direction: column;
    }

    /* —— Header —— */
    .header {
      padding: 10px 14px 8px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid #dce8ff;
    }
    .header-asia img { max-height: 52px; width: auto; max-width: 100%; object-fit: contain; }
    .header-ccri { text-align: center; }
    .header-ccri img { height: 58px; width: auto; object-fit: contain; }
    .header-right {
      text-align: right;
      font-size: 6.5px;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #475569;
    }
    .header-right .script {
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 11px;
      font-style: italic;
      text-transform: none;
      letter-spacing: 0;
      color: #1a4fd9;
      margin-bottom: 2px;
    }

    /* —— Title —— */
    .title-block {
      text-align: center;
      padding: 10px 16px 8px;
      background: linear-gradient(180deg, #fff 0%, #eef4ff 100%);
    }
    .conf-title {
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      color: #0a1847;
    }
    .conf-title .thin { font-weight: 600; color: #334155; }
    .conf-title .accent { color: #1a4fd9; }
    .keywords {
      margin-top: 6px;
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #64748b;
    }

    /* —— Hero —— */
    .hero {
      position: relative;
      height: 248px;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 40%;
    }
    .hero-shade {
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, rgba(10, 24, 71, 0.88) 0%, rgba(10, 24, 71, 0.55) 42%, rgba(10, 24, 71, 0.25) 100%);
    }
    .hero-icons {
      position: absolute;
      left: 12px;
      top: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .icon-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(103, 240, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .hero-tagline {
      position: absolute;
      left: 14px;
      bottom: 52px;
      max-width: 52%;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.25;
      color: #fff;
      text-shadow: 0 2px 8px rgba(0,0,0,0.45);
    }
    .session-band {
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 10px;
      background: linear-gradient(135deg, rgba(10, 24, 71, 0.95), rgba(26, 79, 217, 0.92));
      border: 2px solid rgba(34, 232, 255, 0.45);
      border-radius: 8px;
      padding: 8px 10px;
      color: #fff;
    }
    .session-meta {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #67f0ff;
    }
    .session-meta span {
      margin-left: 6px;
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(255,255,255,0.12);
    }
    .session-title {
      margin-top: 3px;
      font-family: "Instrument Serif", Georgia, serif;
      font-size: 13px;
      line-height: 1.15;
    }

    /* —— Dates & location —— */
    .dates-row {
      display: flex;
      gap: 10px;
      padding: 10px 16px 6px;
      justify-content: center;
    }
    .date-box {
      flex: 1;
      max-width: 300px;
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 8px;
      font-weight: 600;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
    .date-box.blue { background: linear-gradient(135deg, #eef4ff, #fff); border-color: #b8d0ff; }
    .date-box.green { background: linear-gradient(135deg, #ecfdf5, #fff); border-color: #a7f3d0; }
    .date-box .ico { font-size: 16px; }
    .date-box strong { display: block; font-size: 9px; color: #0a1847; margin-top: 1px; }
    .location {
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: #1a4fd9;
      padding-bottom: 8px;
    }

    /* —— Session focus —— */
    .focus-wrap {
      padding: 0 14px 8px;
      flex: 1;
      min-height: 0;
    }
    .focus-panel {
      height: 100%;
      background: #fff;
      border: 2px solid #b8d0ff;
      border-radius: 12px;
      padding: 8px 10px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
    }
    .focus-heading {
      text-align: center;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #143db3;
      margin-bottom: 6px;
    }
    .chair-block {
      background: #eef4ff;
      border-radius: 6px;
      padding: 5px 7px;
      margin-bottom: 6px;
    }
    .chair-label {
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #1a4fd9;
    }
    .chair-line { font-size: 8px; color: #334155; margin-top: 2px; line-height: 1.3; }
    .topics-label {
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 3px;
    }
    .topics {
      columns: 2;
      column-gap: 8px;
      list-style: none;
      font-size: 7px;
      line-height: 1.26;
      color: #475569;
    }
    .topics li {
      break-inside: avoid;
      padding: 0 0 0 7px;
      position: relative;
    }
    .topics li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #00d4ff;
    }

    /* —— Publication —— */
    .pub-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin: 0 14px 8px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      font-size: 6.5px;
      line-height: 1.35;
      color: #475569;
    }
    .pub-col { padding: 6px 8px; }
    .pub-col.pub { background: #fff7ed; border-right: 1px solid #fed7aa; }
    .pub-col.idx { background: #f0fdfa; }
    .pub-head {
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .pub-col.pub .pub-head { color: #c2410c; }
    .pub-col.idx .pub-head { color: #0f766e; }
    .pub-logos { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 4px; }
    .pub-logos img { max-height: 22px; width: auto; object-fit: contain; }
    .pub-logos .lnee { max-height: 36px; }

    /* —— Footer —— */
    .footer {
      background: linear-gradient(180deg, #0a1847 0%, #06102a 100%);
      color: #e2e8f0;
      padding: 10px 14px 12px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: center;
    }
    .footer-qr img {
      width: 72px;
      height: 72px;
      background: #fff;
      border-radius: 4px;
      padding: 3px;
    }
    .footer-qr p {
      font-size: 6px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-align: center;
      margin-top: 3px;
      color: #67f0ff;
    }
    .footer-center { font-size: 7px; line-height: 1.4; }
    .footer-center .site {
      font-size: 9px;
      font-weight: 800;
      color: #fff;
      margin: 3px 0;
    }
    .footer-center .cmt-note {
      margin-top: 4px;
      padding: 4px 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      border: 1px solid rgba(103, 240, 255, 0.25);
    }
    .footer-center .cmt-note strong { color: #67f0ff; }
    .footer-right {
      text-align: right;
      font-size: 7px;
      font-weight: 700;
      color: #94a3b8;
    }
    .footer-right .script {
      font-family: "Instrument Serif", Georgia, serif;
      font-style: italic;
      font-size: 11px;
      color: #67f0ff;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <article class="poster">
    <header class="header">
      <div class="header-asia">
        <img src="${data.assets.asiaUniversity}" alt="Asia University" />
      </div>
      <div class="header-ccri">
        <img src="${data.assets.ccri}" alt="CCRIO" />
      </div>
      <div class="header-right">
        <p class="script">Taiwan — A Hub for Global Ideas</p>
        <p>Research · Collaboration · Social Impact</p>
        <p>A Brighter Tomorrow</p>
      </div>
    </header>

    <section class="title-block">
      <h1 class="conf-title">
        <span class="thin">${escapeHtml(titleLead)}</span><span class="accent">${escapeHtml(titleCore)}</span>
        <span class="thin"> (${escapeHtml(data.conference.shortName)})</span>
      </h1>
      <p class="keywords">INNOVATION &nbsp;|&nbsp; SECURITY &nbsp;|&nbsp; SUSTAINABILITY &nbsp;|&nbsp; SMARTER TOMORROW</p>
    </section>

    <section class="hero">
      <img class="hero-bg" src="${data.assets.heroSkyline}" alt="" />
      <div class="hero-shade"></div>
      <div class="hero-icons" aria-hidden="true">
        <div class="icon-dot">🧠</div>
        <div class="icon-dot">☁</div>
        <div class="icon-dot">📡</div>
        <div class="icon-dot">🛡</div>
      </div>
      <p class="hero-tagline">Building Intelligent Systems for a Secure, Sustainable and Inclusive Future</p>
      <div class="session-band">
        <p class="session-meta">${escapeHtml(data.eventKind)}<span>${escapeHtml(data.code)}</span></p>
        <h2 class="session-title">${escapeHtml(data.title)}</h2>
      </div>
    </section>

    <section class="dates-row">
      <div class="date-box blue">
        <span class="ico">📅</span>
        <div>Paper Submission Deadline<strong>${escapeHtml(data.conference.submissionDeadline)}</strong></div>
      </div>
      <div class="date-box green">
        <span class="ico">📅</span>
        <div>Conference Dates<strong>${escapeHtml(data.conference.dates)}</strong></div>
      </div>
    </section>
    <p class="location">📍 ${escapeHtml(data.conference.location)}</p>

    <section class="focus-wrap">
      <div class="focus-panel">
        <p class="focus-heading">Session focus</p>
        <div class="chair-block">
          <p class="chair-label">Chair</p>
          ${chairsHtml}
        </div>
        <p class="topics-label">List of topics</p>
        <ul class="topics">${topicsHtml}</ul>
      </div>
    </section>

    <section class="pub-row">
      <div class="pub-col pub">
        <p class="pub-head">Publication</p>
        <div class="pub-logos">
          <img src="${data.assets.springer}" alt="Springer" />
          <img class="lnee" src="${data.assets.lnee}" alt="LNEE" />
        </div>
        <p>Peer-reviewed papers will be published in Springer&apos;s Lecture Notes in Electrical Engineering (LNEE) series.</p>
      </div>
      <div class="pub-col idx">
        <p class="pub-head">Indexing</p>
        <div class="pub-logos">
          <img src="${data.assets.scopus}" alt="Scopus" />
          <img src="${data.assets.compendex}" alt="Ei Compendex" />
        </div>
        <p>Proceedings will be submitted for indexing in Scopus and Ei Compendex.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-qr">
        <img src="${data.assets.websiteQr}" alt="Conference website QR" />
        <p>SCAN FOR DETAILS</p>
      </div>
      <div class="footer-center">
        <p>🌐 Conference Website</p>
        <p class="site">${escapeHtml(data.conference.website)}</p>
        <p class="cmt-note">
          <strong>Submit on Microsoft CMT</strong> — select <strong>${escapeHtml(data.code)}</strong> when submitting.
        </p>
        <img src="${data.cmtQrDataUrl}" alt="CMT QR" style="width:48px;height:48px;margin-top:4px;background:#fff;border-radius:4px;padding:2px" />
      </div>
      <div class="footer-right">
        <p>TAICHUNG · TAIWAN</p>
        <p class="script">Ideas for a Better Tomorrow</p>
        <p style="margin-top:4px;font-size:6px">${escapeHtml(data.conference.email)}</p>
      </div>
    </footer>
  </article>
</body>
</html>`
}
