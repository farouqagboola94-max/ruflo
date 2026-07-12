import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor'
            return 'vendor'
          }
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
