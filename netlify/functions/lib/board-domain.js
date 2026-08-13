// Pure rules for the public boards. No I/O, so every limit below is testable
// directly.
//
// Two sections were writing to src/lib/api.js, a shim that posts to
// VITE_BACKEND_URL and silently falls back to localStorage when that is unset -
// which it always was. So the Community Wall and the Trade Board were
// single-browser: you posted, and nobody else ever saw it. The Trade Board even
// told posters "Visible to everyone" while it did that.
//
// Both are public free text under the festival's name, and trade listings carry
// phone numbers, so nothing here is published until a human has read it.

import { cleanName } from './text.js'

export const MAX_PHOTO_BYTES = 300 * 1024
const PHOTO_RE = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/

/**
 * Each board declares its own fields. `max` is a character cap; `required`
 * fields must be non-empty after trimming.
 */
export const BOARDS = {
  wall: {
    prefix: 'CW26',
    fields: {
      name:  { max: 40,  required: true },
      city:  { max: 40,  required: true },
      role:  { max: 20 },
      msg:   { max: 240, required: true },
    },
  },
  trades: {
    prefix: 'TB26',
    fields: {
      name:      { max: 80,  required: true },
      brand:     { max: 40,  required: true },
      size:      { max: 10,  required: true },
      condition: { max: 8,   required: true, oneOf: ['DS', 'VNDS', 'USED'] },
      asking:    { max: 120, required: true },
      notes:     { max: 240 },
      contact:   { max: 20 },
      instagram: { max: 40 },
    },
    photo: true,
  },
}

export function isBoard(name) {
  return Object.prototype.hasOwnProperty.call(BOARDS, String(name))
}

// cleanName already handles this correctly - control characters written as
// escape sequences, whitespace collapsed, length capped. Writing the class
// out again here is how literal NUL bytes got into this file the first time.
const clean = (raw, max) => cleanName(raw, max)

export function mintId(prefix, n) {
  return `${prefix}-${String(n).padStart(4, '0')}`
}

export function validatePost(boardName, body) {
  if (!isBoard(boardName)) {
    return { ok: false, status: 400, message: 'Unknown board' }
  }
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, message: 'A JSON body is required' }
  }

  const spec = BOARDS[boardName]
  const value = {}

  for (const [key, rule] of Object.entries(spec.fields)) {
    const raw = body[key]
    if (raw !== undefined && typeof raw !== 'string') {
      return { ok: false, status: 400, message: `${key} must be text` }
    }
    // Length is checked before trimming so padding cannot smuggle past the cap.
    if (typeof raw === 'string' && raw.length > rule.max) {
      return { ok: false, status: 400, message: `${key} must be ${rule.max} characters or fewer` }
    }

    const v = clean(raw, rule.max)
    if (rule.required && !v) {
      return { ok: false, status: 400, message: `${key} is required` }
    }
    if (rule.oneOf && v && !rule.oneOf.includes(v)) {
      return { ok: false, status: 400, message: `${key} must be one of ${rule.oneOf.join(', ')}` }
    }
    value[key] = v
  }

  if (spec.photo && body.photo) {
    if (typeof body.photo !== 'string' || !PHOTO_RE.test(body.photo)) {
      return { ok: false, status: 400, message: 'A photo must be a PNG, JPEG or WebP data URL' }
    }
    if (body.photo.length > MAX_PHOTO_BYTES) {
      return { ok: false, status: 413, message: 'That photo is too large - keep it under 300KB' }
    }
    value.photo = body.photo
  }

  return { ok: true, value }
}

/**
 * What the public sees. Built by allow-list rather than by deleting fields, so
 * a new field added to a record is private until someone decides otherwise.
 */
export function publicPost(boardName, record) {
  if (!record) return null
  const out = { id: record.id, postedAt: record.postedAt }
  for (const key of Object.keys(BOARDS[boardName]?.fields || {})) {
    out[key] = record[key] ?? ''
  }
  if (BOARDS[boardName]?.photo) out.photo = record.photo || ''
  return out
}

export function approvedOnly(records) {
  return records.filter(r => r && r.approved === true)
}

export function newest(records) {
  return [...records].sort((a, b) => String(b.postedAt).localeCompare(String(a.postedAt)))
}
