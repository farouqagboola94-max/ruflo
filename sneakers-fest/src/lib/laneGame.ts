export type LaneGame = { lane: number; obstacle: number; distance: number; score: number; running: boolean; hit: boolean }
export const initialGame: LaneGame = { lane: 1, obstacle: 1, distance: -18, score: 0, running: false, hit: false }
export function advanceGame(game: LaneGame): LaneGame {
 if (!game.running) return game
 const distance = game.distance + Math.min(2.5 + game.score * 0.15, 6)
 if (distance + 17 >= 73 && distance <= 93 && game.obstacle === game.lane) return { ...game, distance, running: false, hit: true }
 if (distance > 105) return { ...game, distance: -18, score: game.score + 1, obstacle: ((game.score + 1) * 2 + 1) % 3 }
 return { ...game, distance }
}
