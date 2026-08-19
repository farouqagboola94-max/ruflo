import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
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
