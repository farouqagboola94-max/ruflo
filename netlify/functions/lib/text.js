// Shared input sanitising for user-supplied display text.

// Written as escape sequences on purpose. Typing the control characters
// literally puts raw NUL bytes in the source, which makes git and grep treat
// the file as binary. It is also easy to mistype the class as space-to-hyphen,
// which JS reads as the RANGE 0x20-0x2D and silently strips spaces and
// punctuation out of every name.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

/**
 * Normalise a name or label for storage and display: drop control
 * characters, collapse runs of whitespace, trim, and cap the length.
 * Internal spaces are preserved.
 */
export function cleanName(raw, max) {
  return String(raw || '')
    .replace(CONTROL_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}
