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

/**
 * Read a record together with the tag identifying this exact version of it.
 *
 * The tag is what makes a later write conditional. Without it the only thing
 * available is read-modify-write, which silently loses one of two concurrent
 * updates - and at the gate a lost update means one ticket admitting two
 * people.
 */
export async function getVersioned(storeFactory, key) {
  try {
    const { data, etag } = await storeFactory().getWithMetadata(key, { type: 'text' })
    if (data == null) return { value: null, version: null }
    return { value: JSON.parse(data), version: etag || null }
  } catch { return { value: null, version: null } }
}

/**
 * Write only if the record still looks the way it did when it was read.
 *
 * Returns true if the write landed, false if someone else got there first.
 * A false is not an error - it is the answer to "did I win the race", and the
 * caller is expected to act on it rather than assume success.
 *
 * `version: null` means "only if this key does not exist yet", which is the
 * same guarantee for a record being created rather than updated.
 */
export async function setIfUnchanged(storeFactory, key, data, version) {
  const condition = version ? { onlyIfMatch: version } : { onlyIfNew: true }
  try {
    const result = await storeFactory().set(key, JSON.stringify(data), condition)
    return result?.modified === true
  } catch {
    // A write that threw did not land. Reporting it as a win is how a failed
    // update becomes a second person through the gate.
    return false
  }
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
