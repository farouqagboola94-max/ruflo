/**
 * clipboard.js
 * Universal clipboard copy utility for Sneakers Fest '26.
 * Supports Modern Async Clipboard API, iOS Safari fallback, and iframe/WebView fallbacks.
 */

export async function copyToClipboard(text) {
  if (!text) return false

  // 1. Try modern navigator.clipboard API if available and in secure context
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {}
  }

  // 2. Fallback using invisible textarea and execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.top = '0'
      el.style.left = '-9999px'
      el.style.opacity = '0'
      el.style.fontSize = '16px' // Prevent auto-zoom on iOS Safari
      document.body.appendChild(el)
      
      const selection = document.getSelection()
      const originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
      
      el.select()
      el.setSelectionRange(0, 99999) // For mobile devices
      
      const successful = document.execCommand('copy')
      document.body.removeChild(el)
      
      if (selection && originalRange) {
        selection.removeAllRanges()
        selection.addRange(originalRange)
      }
      
      return successful
    } catch {
      return false
    }
  }

  return false
}

export default copyToClipboard
