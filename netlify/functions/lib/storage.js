import { getStore } from '@netlify/blobs'

const store = (name) => getStore({ name, consistency: 'strong' })

export const Tickets    = () => store('sf26-tickets')
export const Waitlist   = () => store('sf26-waitlist')
export const Vendors    = () => store('sf26-vendors')
export const Newsletter = () => store('sf26-newsletter')
export const Contacts   = () => store('sf26-contacts')

export async function get(storeFactory, key) {
  try {
    const val = await storeFactory().get(key)
    return val ? JSON.parse(val) : null
  } catch { return null }
}

export async function set(storeFactory, key, data) {
  await storeFactory().set(key, JSON.stringify(data))
}

export async function del(storeFactory, key) {
  try { await storeFactory().delete(key) } catch { /* noop */ }
}

export async function listAll(storeFactory, prefix) {
  try {
    const s = storeFactory()
    const result = await s.list(prefix ? { prefix } : {})
    const items = await Promise.all(
      result.blobs.map(async ({ key }) => {
        try {
          const val = await s.get(key)
          return val ? JSON.parse(val) : null
        } catch { return null }
      })
    )
    return items.filter(Boolean)
  } catch (e) {
    console.error('[storage] listAll error:', e.message)
    return []
  }
}
