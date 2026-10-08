import React from 'react'
import { createRoot } from 'react-dom/client'
import { FONTS } from '../tokens'
import DoorApp from './DoorApp'

// Standalone operator entry point. Deliberately not part of the festival
// site: no nav link, no siteIndex entry, and its own bundle.
const style = document.createElement('style')
style.textContent = FONTS + `
  *{margin:0;padding:0;box-sizing:border-box}
  body{-webkit-font-smoothing:antialiased;background:#0A0A0A}
  input::placeholder{color:rgba(255,255,255,.25)}
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <React.StrictMode><DoorApp /></React.StrictMode>
)
