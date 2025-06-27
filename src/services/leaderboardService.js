// Shared data service for leaderboard and tournaments
// This ensures data consistency between hub widgets and individual screens

// Simulated global leaderboard data
const GLOBAL_LEADERBOARD_DATA = [
  { id: '1', rank: 1, username: 'ProGamer123', totalScore: 15420, level: 25, gamesPlayed: 156, profileIcon: '👑', winRate: 78 },
  { id: '2', rank: 2, username: 'SpaceWarrior', totalScore: 12850, level: 22, gamesPlayed: 134, profileIcon: '🚀', winRate: 72 },
  { id: '3', rank: 3, username: 'GalacticHero', totalScore: 11230, level: 20, gamesPlayed: 98, profileIcon: '⭐', winRate: 68 },
  { id: '4', rank: 4, username: 'CosmicExplorer', totalScore: 9870, level: 18, gamesPlayed: 87, profileIcon: '🌌', winRate: 65 },
  { id: '5', rank: 5, username: 'NebulaGuardian', totalScore: 8450, level: 16, gamesPlayed: 76, profileIcon: '🛡️', winRate: 61 },
  { id: '6', rank: 6, username: 'QuantumWizard', totalScore: 7230, level: 15, gamesPlayed: 65, profileIcon: '🔮', winRate: 58 },
  { id: '7', rank: 7, username: 'StellarDragon', totalScore: 6540, level: 14, gamesPlayed: 58, profileIcon: '🐉', winRate: 55 },
  { id: '8', rank: 8, username: 'MeteorMiner', totalScore: 5890, level: 13, gamesPlayed: 52, profileIcon: '⛏️', winRate: 52 },
  { id: '9', rank: 9, username: 'AlienBotanist', totalScore: 5340, level: 12, gamesPlayed: 47, profileIcon: '🌱', winRate: 49 },
  { id: '10', rank: 10, username: 'RocketPup', totalScore: 4870, level: 11, gamesPlayed: 43, profileIcon: '🐕', winRate: 46 },
  { id: '11', rank: 11, username: 'AstroCat', totalScore: 4450, level: 10, gamesPlayed: 39, profileIcon: '🐱', winRate: 43 },
  { id: '12', rank: 12, username: 'CosmicRacer', totalScore: 4080, level: 9, gamesPlayed: 36, profileIcon: '🏎️', winRate: 40 },
  { id: '13', rank: 13, username: 'NebulaPilot', totalScore: 3740, level: 8, gamesPlayed: 33, profileIcon: '✈️', winRate: 37 },
  { id: '14', rank: 14, username: 'StellarKnight', totalScore: 3420, level: 7, gamesPlayed: 30, profileIcon: '⚔️', winRate: 34 },
  { id: '15', rank: 15, username: 'QuantumMage', totalScore: 3120, level: 6, gamesPlayed: 28, profileIcon: '🧙‍♂️', winRate: 31 },
];

// Simulated tournaments data
const TOURNAMENTS_DATA = [
  {
    id: 't1',
    name: 'Galactic Championship',
    game: 'Space Warriors',
    prizePool: 5000,
    entryFee: 50,
    status: 'active',
    maxParticipants: 100,
    currentParticipants: 67,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: 'The ultimate space combat championship! Compete against the best pilots in the galaxy.',
    rewards: {
      first: 2500,
      second: 1500,
      third: 1000
    }
  },
  {
    id: 't2',
    name: 'Cosmic Rumble',
    game: 'Nebula Fighters',
    prizePool: 3000,
    entryFee: 25,
    status: 'upcoming',
    maxParticipants: 64,
    currentParticipants: 23,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    description: 'A fierce battle in the nebula! Only the strongest fighters will survive.',
    rewards: {
      first: 1500,
      second: 900,
      third: 600
    }
  },
  {
    id: 't3',
    name: 'Stellar Showdown',
    game: 'Quantum Quest',
    prizePool: 7500,
    entryFee: 100,
    status: 'upcoming',
    maxParticipants: 32,
    currentParticipants: 8,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    description: 'The most prestigious tournament in the universe! Elite players only.',
    rewards: {
      first: 3750,
      second: 2250,
      third: 1500
    }
  },
  {
    id: 't4',
    name: 'Meteor Madness',
    game: 'Asteroid Miner',
    prizePool: 1500,
    entryFee: 10,
    status: 'active',
    maxParticipants: 50,
    currentParticipants: 34,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    description: 'Mine your way to victory! Collect the most valuable asteroids.',
    rewards: {
      first: 750,
      second: 450,
      third: 300
    }
  },
  {
    id: 't5',
    name: 'Alien Invasion',
    game: 'Space Defenders',
    prizePool: 2000,
    entryFee: 15,
    status: 'upcoming',
    maxParticipants: 80,
    currentParticipants: 12,
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    description: 'Defend Earth from alien invaders! Team up with other defenders.',
    rewards: {
      first: 1000,
      second: 600,
      third: 400
    }
  },
  {
    id: 't6',
    name: 'Quantum Racing',
    game: 'Hyper Speed',
    prizePool: 4000,
    entryFee: 30,
    status: 'upcoming',
    maxParticipants: 40,
    currentParticipants: 5,
    startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    description: 'Race through quantum tunnels at impossible speeds!',
    rewards: {
      first: 2000,
      second: 1200,
      third: 800
    }
  }
];

class LeaderboardService {
  // Get top 5 players for hub widget
  getTopLeaderboard() {
    return GLOBAL_LEADERBOARD_DATA.slice(0, 5);
  }

  // Get full leaderboard for leaderboard screen
  getFullLeaderboard() {
    return GLOBAL_LEADERBOARD_DATA;
  }

  // Get user rank (simulated)
  getUserRank(userId) {
    // Simulate user rank - in real app this would be calculated from Firestore
    const userInLeaderboard = GLOBAL_LEADERBOARD_DATA.find(player => player.id === userId);
    return userInLeaderboard ? userInLeaderboard.rank : 42; // Default rank if not in top 15
  }

  // Get active tournaments for hub widget
  getActiveTournaments() {
    return TOURNAMENTS_DATA.filter(t => t.status === 'active');
  }

  // Get upcoming tournaments for hub widget
  getUpcomingTournaments() {
    return TOURNAMENTS_DATA.filter(t => t.status === 'upcoming');
  }

  // Get all tournaments for tournaments screen
  getAllTournaments() {
    return TOURNAMENTS_DATA;
  }

  // Get tournaments for hub widget (mix of active and upcoming)
  getTournamentsForHub() {
    const active = this.getActiveTournaments();
    const upcoming = this.getUpcomingTournaments();
    return [...active, ...upcoming].slice(0, 3);
  }

  // Get tournament by ID
  getTournamentById(tournamentId) {
    return TOURNAMENTS_DATA.find(t => t.id === tournamentId);
  }

  // Simulate tournament entry
  async enterTournament(tournamentId, userId) {
    const tournament = this.getTournamentById(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      throw new Error('Tournament is full');
    }

    // In real app, this would update Firestore
    // For now, just simulate success
    return { success: true, message: `Successfully entered ${tournament.name}` };
  }
}

export default new LeaderboardService(); 