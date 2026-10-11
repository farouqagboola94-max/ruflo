/**
 * safeStorage.js
 * Universal fault-tolerant Storage helper for Sneakers Fest '26.
 * Guarantees zero crashes in Safari Private Browsing, iOS WebViews,
 * disabled cookies, or QuotaExceeded scenarios by falling back to in-memory storage.
 */

const memoryStore = new Map()

export const safeStorage = {
  getItem(key, fallback = null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key)
        return val !== null ? val : fallback
      }
    } catch {}
    return memoryStore.has(key) ? memoryStore.get(key) : fallback
  },

  getJSON(key, fallback = null) {
    try {
      const raw = safeStorage.getItem(key, null)
      if (raw === null || raw === undefined) return fallback
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  },

  setItem(key, value) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized)
        return true
      }
    } catch {}
    try {
      memoryStore.set(key, serialized)
      return true
    } catch {
      return false
    }
  },

  removeItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch {}
    try {
      memoryStore.delete(key)
      return true
    } catch {
      return false
    }
  },

  clear() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear()
      }
    } catch {}
    memoryStore.clear()
  }
}

export default safeStorage
