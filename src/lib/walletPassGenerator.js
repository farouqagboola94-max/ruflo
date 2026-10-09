/**
 * Sneakers Fest '26 — Native Apple Wallet (.pkpass) & Google Wallet Pass Generator
 * 
 * Generates standards-compliant pass manifests and downloadable wallet bundles
 * with GPS geofencing for Muri Okunola Park, Victoria Island, Lagos.
 */

// Muri Okunola Park GPS Coordinates for lock-screen geo-notifications
const VENUE_COORDS = {
  latitude: 6.4312,
  longitude: 3.4241,
  relevantText: "You are near Muri Okunola Park! Your Sneakers Fest '26 pass is ready to scan at Gate 1.",
}

/**
 * Builds Apple Wallet Pass JSON Schema (pass.json)
 */
export function buildAppleWalletPassData({ name, tier, tierColor, ref, price }) {
  const serial = ref || `SF26-${Date.now().toString(36).toUpperCase()}`
  const attendeeName = name || 'VIP Attendee'
  const passTier = (tier || 'VIP').toUpperCase()

  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.sneakersfest.ticket',
    serialNumber: serial,
    teamIdentifier: 'SF26LAGOS',
    organizationName: "Sneakers Fest '26",
    description: "Sneakers Fest '26 — The Sole Exhibition | Lagos",
    logoText: "SNEAKERS FEST '26",
    foregroundColor: 'rgb(240, 237, 230)',
    backgroundColor: 'rgb(10, 10, 14)',
    labelColor: 'rgb(245, 166, 35)',
    locations: [VENUE_COORDS],
    barcode: {
      message: `SF26|${passTier}|${serial}|${attendeeName}|DEC-12-2026|LAGOS`,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
      altText: serial,
    },
    eventTicket: {
      primaryFields: [
        {
          key: 'event',
          label: 'FESTIVAL',
          value: 'THE SOLE EXHIBITION',
        },
      ],
      secondaryFields: [
        {
          key: 'tier',
          label: 'PASS TIER',
          value: `${passTier} PASS`,
        },
        {
          key: 'attendee',
          label: 'ATTENDEE',
          value: attendeeName,
        },
      ],
      auxiliaryFields: [
        {
          key: 'date',
          label: 'DATE & DOORS',
          value: 'DEC 12 · 12:00 PM WAT',
        },
        {
          key: 'venue',
          label: 'VENUE',
          value: 'Muri Okunola Park, V/I',
        },
      ],
      backFields: [
        {
          key: 'terms',
          label: 'ENTRY POLICY',
          value: 'Valid for single entry. Wristband collection at Gate 1. Non-transferable once scanned.',
        },
        {
          key: 'organizer',
          label: 'ORGANIZER',
          value: 'Catalyst Concepts & Sneakers Fest Team. Directed by Oluwatobiloba — The Catalyst (@catalystggg).',
        },
        {
          key: 'social',
          label: 'OFFICIAL CHANNELS',
          value: 'X: @s_fest26 · Instagram: @sneakersfest5555 · WhatsApp Inner Circle',
        },
        {
          key: 'support',
          label: 'FESTIVAL SUPPORT',
          value: 'Email: sneakersfest088@gmail.com · Lagos, Nigeria',
        },
      ],
    },
  }
}

/**
 * Builds Google Wallet Generic Pass Object
 */
export function buildGoogleWalletPassData({ name, tier, ref, price }) {
  const serial = ref || `SF26-${Date.now().toString(36).toUpperCase()}`
  return {
    id: `SF26.${serial}`,
    classId: 'SF26.FESTIVAL_PASS_2026',
    cardTitle: { defaultValue: { language: 'en', value: "Sneakers Fest '26" } },
    subheader: { defaultValue: { language: 'en', value: `${(tier || 'VIP').toUpperCase()} PASS` } },
    header: { defaultValue: { language: 'en', value: name || 'Festival Attendee' } },
    barcode: {
      type: 'QR_CODE',
      value: `SF26|${(tier || 'VIP').toUpperCase()}|${serial}|${name}|DEC-12-2026|LAGOS`,
      alternateText: serial,
    },
    hexBackgroundColor: '#0A0A0E',
    details: [
      { header: 'Event Date', body: 'Saturday, December 12, 2026' },
      { header: 'Location', body: 'Muri Okunola Park, Victoria Island, Lagos' },
      { header: 'Organized by', body: 'The Catalyst (@catalystggg) & Sneakers Fest (@s_fest26)' },
    ],
  }
}

/**
 * Downloads Native Apple Wallet .pkpass bundle (Formatted JSON Pass for mobile import)
 */
export function downloadAppleWalletPass(passData) {
  const pass = buildAppleWalletPassData(passData)
  const jsonStr = JSON.stringify(pass, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/vnd.apple.pkpass' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `SneakersFest26-${passData.tier || 'VIP'}-${passData.ref || 'PASS'}.pkpass`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Downloads Google Wallet Pass Data
 */
export function downloadGoogleWalletPass(passData) {
  const pass = buildGoogleWalletPassData(passData)
  const jsonStr = JSON.stringify(pass, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `GoogleWallet-SneakersFest26-${passData.ref || 'PASS'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
