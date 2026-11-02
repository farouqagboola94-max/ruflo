// generateEmergencyManifest.mjs
// Generates a self-contained, printable HTML & PDF Emergency Ingress Manifest for Freedom Park CMS

import fs from 'node:fs'
import path from 'node:path'

const OUT_PATH = path.join(process.cwd(), 'dist', 'emergency-manifest.html')

const manifestHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SNEAKERS FEST '26 — EMERGENCY INGRESS ACCREDITATION MANIFEST</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #fff; color: #111; margin: 0; padding: 20px; font-size: 11px; }
    .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin: 0; }
    .meta { font-size: 10px; color: #444; line-height: 1.4; margin-top: 4px; }
    .badge { display: inline-block; padding: 2px 8px; border: 1px solid #000; font-weight: 800; font-size: 10px; text-transform: uppercase; background: #f0f0f0; }
    .watermark { position: fixed; top: 40%; left: 15%; font-size: 60px; color: rgba(0,0,0,0.03); transform: rotate(-30deg); pointer-events: none; font-weight: 900; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { border-bottom: 1.5px solid #000; border-top: 1.5px solid #000; text-align: left; padding: 6px 4px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 5px 4px; border-bottom: 1px solid #ddd; font-size: 10px; }
    .sig-col { width: 90px; border-left: 1px dashed #ccc; text-align: center; color: #999; }
    .footer { margin-top: 24px; border-top: 1px solid #000; padding-top: 8px; display: flex; justify-content: space-between; font-size: 9px; color: #555; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="watermark">FREEDOM PARK CMS OFFICIAL</div>

  <div class="no-print" style="background: #000; color: #B8FF00; padding: 12px 18px; margin-bottom: 16px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <span>⚡ <strong>STAFF NOTICE:</strong> This is the official offline accreditation manifest for Freedom Park turnstiles. Keep a physical hardcopy on clipboards at Gates 1 & 2.</span>
    <button onclick="window.print()" style="background: #B8FF00; color: #000; border: none; font-weight: 800; padding: 6px 14px; border-radius: 4px; cursor: pointer;">PRINT MANIFEST (A4)</button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">SNEAKERS FEST '26 — EMERGENCY INGRESS MANIFEST</h1>
      <div class="meta">
        <strong>VENUE:</strong> Freedom Park, Broad Street, Lagos Island (CMS) &bull; Old Prison Ground<br>
        <strong>DATE:</strong> Saturday, 12 December 2026 &bull; Doors Open 12:00 PM WAT<br>
        <strong>CAPACITY CAP:</strong> 2,000 Authorized Attendees (1,700 GA + 300 VIP) &bull; 30 Accredited Vendors
      </div>
    </div>
    <div style="text-align: right;">
      <div class="badge">OFFLINE BACKUP LEVEL 1</div>
      <div class="meta" style="margin-top: 6px;">
        SECURITY PROTOCOL: SHA-256 HMAC<br>
        STAFF CODENAME: CMS-GATE-ALPHA
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 25px;">#</th>
        <th style="width: 140px;">PASS IDENTIFIER</th>
        <th style="width: 90px;">TIER</th>
        <th>ACCREDITED HOLDER / BRAND</th>
        <th style="width: 100px;">ZONE / ALLOTMENT</th>
        <th class="sig-col">OFFLINE STAMP</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>01</td><td><strong>SF26-VVIP-3D28AF70</strong></td><td>VVIP ACCESS</td><td>Femi Balogun (Lekki Kicks)</td><td>Main Amphitheatre Lounge</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>02</td><td><strong>SF26-VIP-E47A91BC</strong></td><td>VIP ACCESS</td><td>Chioma Okonkwo</td><td>Cobblestone Fit-Check Arena</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>03</td><td><strong>SF26-GEN-B849DF20</strong></td><td>GEN ADMISSION</td><td>Tunde Adebayo</td><td>General Grounds & Markets</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>04</td><td><strong>SF26-PHAL-7B12C4DE</strong></td><td>PHALANX TABLE</td><td>Kolawole Group (x5 Guest Bundle)</td><td>Reserved Table T-04</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>05</td><td><strong>VND-FPK-7842</strong></td><td>STREETWEAR MERCH</td><td>Grail District Lagos</td><td>Pergola Booth #04</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>06</td><td><strong>VND-FPK-9104</strong></td><td>INDIE CREATOR</td><td>Danfo Kicks Artisan Collective</td><td>Sole Craft Pergola #08</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>07</td><td><strong>VND-FPK-4412</strong></td><td>GRAIL RESELLER</td><td>Lagos Sole Exchange Physical Escrow</td><td>The Grail Cells (Block A)</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>08</td><td><strong>VND-FPK-3329</strong></td><td>FOOD & BEV</td><td>Suya & Alté Kitchen Lagos</td><td>Food Court Court-02</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>09</td><td><strong>GOLD-VAULT-2026</strong></td><td>HONOUREE VIP</td><td>Special Guest & Key Presenters</td><td>VIP Balcony / Freedom Stage</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
      <tr><td>10</td><td><strong>CAT-AWK-PASS-01</strong></td><td>COMIC COLLECTOR</td><td>Catalyst Awakening #1 Ticket Bundle</td><td>All-Zone + Comic Pavilion</td><td class="sig-col">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td></tr>
    </tbody>
  </table>

  <div style="margin-top: 14px; font-style: italic; color: #666; font-size: 9px;">
    * Roster continues dynamically in local indexed storage. For emergency manual lookups, match attendee Government ID / WhatsApp Confirmation Code against the encrypted pass prefix above.
  </div>

  <div class="footer">
    <div>OFFICIAL ADMISSION PROTOCOL &bull; SNEAKERS FEST '26 &bull; ZERO-TOLERANCE COUNTERFEIT CLEARANCE</div>
    <div>BROAD STREET TURNSTILES &bull; FREEDOM PARK, LAGOS ISLAND</div>
  </div>
</body>
</html>`

fs.writeFileSync(OUT_PATH, manifestHtml, 'utf-8')
console.log('✅ Emergency Ingress Manifest written to:', OUT_PATH)
