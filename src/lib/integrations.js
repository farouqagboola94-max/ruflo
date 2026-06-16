// src/lib/integrations.js
//
// Zero-secret shared ledger.
//
// This site is a static SPA — there is no server and no database, so by
// default nothing a visitor does can be seen by any other visitor. To make
// referral crediting and the Easter-egg hunt work *across* browsers without
// embedding any API key or secret in client code, we use:
//
//   WRITE side  -> a Google Form (Forms accept public POST submissions by
//                  design — no secret required).
//   READ side   -> the Google Sheet the Form feeds, published via
//                  File > Share > Publish to web > CSV (also public and
//                  secret-free by design).
//
// To activate real cross-visitor syncing:
//   1. Create a Google Form with a short-answer question for each field
//      below (type, visitorId, refCode, eggId, tier, meta, ts).
//   2. Open the Form's pre-filled link / page source to find each
//      question's `entry.NNNNNNNNN` id, and fill them into FORM_CONFIG.fields.
//   3. Set FORM_CONFIG.actionUrl to the form's
//      `.../forms/d/e/FORM_ID/formResponse` URL.
//   4. Open the linked Sheet, File > Share > Publish to web, choose CSV,
//      and paste that URL into FORM_CONFIG.sheetCsvUrl.
//
// Until configured, every function below degrades gracefully: writes are
// queued locally (sf26_pending_log) and reads return an empty list. Nothing
// crashes and nothing fakes cross-visitor behavior.

export const FORM_CONFIG = {
  actionUrl: '', // e.g. 'https://docs.google.com/forms/d/e/XXXX/formResponse'
  sheetCsvUrl: '', // e.g. 'https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv'
  fields: {
    type: '', // entry.NNNNNNNNN — 'referral' | 'egg'
    visitorId: '',
    refCode: '',
    eggId: '',
    tier: '',
    meta: '',
    ts: '',
  },
}

export function isConfigured() {
  return Boolean(FORM_CONFIG.actionUrl && FORM_CONFIG.sheetCsvUrl)
}

export function getVisitorId() {
  try {
    let id = localStorage.getItem('sf26_visitor_id')
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      localStorage.setItem('sf26_visitor_id', id)
    }
    return id
  } catch {
    return 'v_anon'
  }
}

function queueLocally(data) {
  try {
    const key = 'sf26_pending_log'
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    list.push({ ...data, queuedAt: Date.now() })
    localStorage.setItem(key, JSON.stringify(list.slice(-200)))
  } catch {
    // best-effort only
  }
}

export async function submitFormRow(data) {
  const row = { visitorId: getVisitorId(), ts: new Date().toISOString(), ...data }
  if (!FORM_CONFIG.actionUrl) {
    queueLocally(row)
    return false
  }
  try {
    const body = new FormData()
    for (const [key, entryId] of Object.entries(FORM_CONFIG.fields)) {
      if (entryId && row[key] !== undefined) body.append(entryId, String(row[key]))
    }
    await fetch(FORM_CONFIG.actionUrl, { method: 'POST', mode: 'no-cors', body })
    return true
  } catch {
    queueLocally(row)
    return false
  }
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const splitRow = (line) =>
    line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).filter((s) => s !== '').map((s) =>
      s.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')
    )
  const headers = splitRow(lines[0])
  return lines.slice(1).map((line) => {
    const cells = splitRow(line)
    const obj = {}
    headers.forEach((h, i) => { obj[h.trim()] = cells[i] ?? '' })
    return obj
  })
}

export async function fetchLedgerRows() {
  if (!FORM_CONFIG.sheetCsvUrl) return []
  try {
    const res = await fetch(FORM_CONFIG.sheetCsvUrl, { cache: 'no-store' })
    if (!res.ok) return []
    const text = await res.text()
    return parseCsv(text)
  } catch {
    return []
  }
}
