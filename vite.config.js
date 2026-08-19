import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Writes the real precache list into dist/sw.js.
 *
 * The service worker registers on window.load, by which point the browser has
 * already fetched every script the page needed without going through it. Its
 * runtime handlers therefore cache almost nothing on a first visit - measured:
 * three entries, and a blank page offline. The fix is to precache explicitly,
 * and the filenames are content-hashed, so the list has to come from the
 * build.
 *
 * What goes in is deliberately not "everything". Precaching all 61 chunks
 * would re-download the entire site and undo the reason sections are deferred
 * in the first place. It precaches:
 *
 *   - both HTML entries and their static import graphs, so the app can boot
 *   - the CSS
 *   - MyPass, because a ticket you cannot display is a ticket you do not have,
 *     and at the gate there are thousands of people on one cell tower
 *
 * Everything else stays on demand and is cached as it is visited.
 */
function swPrecache() {
  // Sections worth having without a network, beyond what booting needs.
  const OFFLINE_CRITICAL = ['sections/MyPass']
  let bundle = null

  return {
    name: 'sw-precache',
    apply: 'build',
    generateBundle(_options, b) { bundle = b },
    async closeBundle() {
      if (!bundle) return
      const { readFileSync, writeFileSync, existsSync } = await import('fs')
      const { resolve: r } = await import('path')
      const { createHash } = await import('crypto')

      const chunks = Object.values(bundle)
      const byName = new Map(chunks.map(c => [c.fileName, c]))
      const keep = new Set()

      // An entry is only usable with everything it statically imports, and
      // those imports have imports of their own.
      const follow = fileName => {
        if (!fileName || keep.has(fileName)) return
        keep.add(fileName)
        for (const dep of byName.get(fileName)?.imports || []) follow(dep)
      }

      for (const c of chunks) {
        if (c.type === 'chunk' && c.isEntry) follow(c.fileName)
        if (c.type === 'asset' && c.fileName.endsWith('.css')) keep.add(c.fileName)
        if (c.type === 'chunk' && OFFLINE_CRITICAL.some(m => (c.facadeModuleId || '').includes(m))) {
          follow(c.fileName)
        }
      }

      const list = [
        '/', '/door.html', '/manifest.json', '/favicon.svg',
        ...[...keep].sort().map(f => '/' + f),
      ]

      // Name the cache after its contents so a deploy invalidates the old one
      // and never serves a half-old, half-new mix of chunks.
      const version = createHash('sha256').update(list.join('\n')).digest('hex').slice(0, 12)

      const swPath = r(__dirname, 'dist/sw.js')
      if (!existsSync(swPath)) {
        this.warn('dist/sw.js missing - the site will have no offline support')
        return
      }
      let sw = readFileSync(swPath, 'utf8')
      const before = sw
      sw = sw.replace(/const CACHE_NAME = '[^']*'/, `const CACHE_NAME = 'sf26-${version}'`)
      sw = sw.replace(/const PRECACHE = \[[\s\S]*?\n\]/,
        'const PRECACHE = [\n' + list.map(u => `  '${u}',`).join('\n') + '\n]')

      if (sw === before) {
        // Failing loudly beats shipping a worker that silently caches nothing.
        this.error('sw-precache could not find CACHE_NAME/PRECACHE in dist/sw.js')
      }
      writeFileSync(swPath, sw)
      console.log(`\n  sw-precache: ${list.length} files precached as sf26-${version}`)
    },
  }
}

export default defineConfig({
  plugins: [react(), swPrecache()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Two entry points: the festival site, and the staff door app which
      // must never be bundled into or linked from the public page.
      input: {
        main: resolve(__dirname, 'index.html'),
        door: resolve(__dirname, 'door.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor'
            return 'vendor'
          }

          // The shared core must be named BEFORE the section groups below.
          // Without this rule Rollup has nowhere obvious to put tokens.js,
          // Shared.jsx and auth.jsx - every lazy section imports them - so it
          // folds them into whichever manual chunk it reaches first. That was
          // sections-culture, which dragged the 200-sneaker dataset onto the
          // critical path: 247 kB downloaded before a single section could
          // paint, on a page most visitors scroll two screens of.
          if (
            id.includes('/src/tokens.js') ||
            id.includes('/src/components/') ||
            id.includes('/src/lib/')
          ) return 'core'

          // Big datasets belong with nothing. Only the section that reads a
          // dataset should pay to download it.
          if (id.includes('/src/data/')) return 'data'

          const gameSections = [
            'SneakerTrivia', 'MemoryMatch', 'Soledle', 'ShoeColorizer',
            'OutfitMatcher', 'SpinWheel', 'CrewVoteOff', 'BadgeMaker',
            'MysteryDrop', 'SneakerWorth', 'SneakerBingo', 'HypeCounter',
          ]
          if (gameSections.some(s => id.includes(`sections/${s}`))) return 'sections-games'

          const cultureSections = [
            'ArchitectVault', 'SneakerBible', 'CommunityWall', 'CultureMuseum',
            'CultureHistory', 'SoleOfLagos', 'Comics', 'Gallery', 'PhotoTools',
            'TradeBoard', 'EggHuntTracker',
          ]
          if (cultureSections.some(s => id.includes(`sections/${s}`))) return 'sections-culture'
        },
      },
    },
  },
})
