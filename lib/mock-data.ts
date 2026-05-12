import type { Player, GameState } from './game-data';

// Mock Players for quick testing
export const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Minh',
    completed: 0,
    skipped: 0
  },
  {
    id: 'p2',
    name: 'Lan',
    completed: 0,
    skipped: 0
  },
  {
    id: 'p3',
    name: 'Hùng',
    completed: 0,
    skipped: 0
  },
  {
    id: 'p4',
    name: 'Thu',
    completed: 0,
    skipped: 0
  }
];

// Mock Game State for testing
export const MOCK_GAME_STATE_CLASSIC: GameState = {
  mode: 'classic',
  spicyLevel: 'spicy',
  players: MOCK_PLAYERS,
  currentPlayerIndex: 0,
  currentRound: 1,
  maxRounds: 5,
  currentCard: null,
  usedCardIds: []
};

export const MOCK_GAME_STATE_CHAOS: GameState = {
  mode: 'chaos',
  spicyLevel: 'wild',
  players: MOCK_PLAYERS.slice(0, 3),
  currentPlayerIndex: 0,
  currentRound: 1,
  maxRounds: 3,
  currentCard: null,
  usedCardIds: []
};

// Quick setup presets
export const QUICK_SETUPS = {
  twoPlayers: {
    players: MOCK_PLAYERS.slice(0, 2),
    mode: 'classic' as const,
    spicyLevel: 'chill' as const,
    maxRounds: 3
  },
  threePlayers: {
    players: MOCK_PLAYERS.slice(0, 3),
    mode: 'classic' as const,
    spicyLevel: 'spicy' as const,
    maxRounds: 5
  },
  partyMode: {
    players: MOCK_PLAYERS,
    mode: 'chaos' as const,
    spicyLevel: 'wild' as const,
    maxRounds: 10
  }
};
