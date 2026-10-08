// GET  /.netlify/functions/board?board=wall|trades  -> { posts, total }
// POST /.netlify/functions/board?board=wall|trades  -> { success, id }
//
// The Community Wall and the Trade Board. Both used to write through
// src/lib/api.js to a VITE_BACKEND_URL that was never set, so both silently
// fell back to localStorage and nobody ever saw anyone else's post.
//
// Posts wait for moderation. See lib/board-domain.js for why.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import {
  BOARDS, isBoard, validatePost, publicPost, approvedOnly, newest, mintId,
} from './lib/board-domain.js'

const Boards = () => getStore({ name: 'sf26-boards', consistency: 'strong' })

// One store, prefixed per board, so a wall post and a trade listing can never
// collide on a key.
const countKey = board => `_count:${board}`
const isPostKey = (key, board) => key.startsWith(`${board}:`)

async function readBoard(board) {
  const store = Boards()
  const list = await store.list().catch(() => ({ blobs: [] }))
  const keys = (list.blobs || []).map(b => b.key).filter(k => isPostKey(k, board))
  const rows = await Promise.all(keys.map(k => store.get(k, { type: 'json' }).catch(() => null)))
  return rows.filter(Boolean)
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()

  const board = String(event.queryStringParameters?.board || '')
  if (!isBoard(board)) return err(400, 'Unknown board')

  if (event.httpMethod === 'GET') {
    const posts = newest(approvedOnly(await readBoard(board)))
    return ok({ posts: posts.map(p => publicPost(board, p)), total: posts.length })
  }

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: `board-${board}`, limit: 5, windowSec: 900 })
  if (limited) return limited

  // Trade listings carry a photo, so this body allowance is larger than most.
  const bodyErr = limitBody(event, 420 * 1024)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const parsed = validatePost(board, body)
  if (!parsed.ok) return err(parsed.status, parsed.message)

  const store = Boards()
  const counter = await store.get(countKey(board), { type: 'json' }).catch(() => null)
  const n = (Number(counter?.count) || 0) + 1
  const id = mintId(BOARDS[board].prefix, n)

  const record = {
    ...parsed.value,
    id,
    board,
    postedAt: new Date().toISOString(),
    // Published only once a human has read it.
    approved: false,
  }

  await store.setJSON(`${board}:${id}`, record)
  await store.setJSON(countKey(board), { count: n })

  return ok({ success: true, id })
}
