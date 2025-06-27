// Simulated Firestore Service
// This mimics Firestore behavior for development/testing

// Simulated data
let userData = {
  id: '1',
  username: 'CosmicExplorer',
  level: 15,
  xp: 1250,
  pltBalance: 1250,
  profileIcon: '👨‍🚀',
  gamesPlayed: 47,
  stickersCollected: 23,
  achievements: 8,
};

let featuredContent = [
  {
    id: '1',
    title: 'Space Runner Challenge',
    description: 'Navigate through asteroid fields and collect cosmic rewards',
    icon: '🚀',
    reward: '50 PLT',
    gradient: ['#4A90E2', '#357ABD'],
    badge: 'FEATURED',
    duration: '5 min',
    players: '1-4',
    active: true,
    priority: 1,
  },
  {
    id: '2',
    title: 'Planet Defender Tournament',
    description: 'Protect your homeworld from alien invaders',
    icon: '🛡️',
    reward: '75 PLT',
    gradient: ['#E74C3C', '#C0392B'],
    badge: 'TOURNAMENT',
    duration: '10 min',
    players: '2-8',
    active: true,
    priority: 2,
  },
  {
    id: '3',
    title: 'Stellar Puzzle Master',
    description: 'Solve cosmic puzzles to unlock rare stickers',
    icon: '🧩',
    reward: '100 PLT',
    gradient: ['#9B59B6', '#8E44AD'],
    badge: 'NEW',
    duration: '15 min',
    players: '1',
    active: true,
    priority: 3,
  },
];

let userQuests = [
  {
    id: '1',
    userId: '1',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '👣',
    progress: 1,
    target: 1,
    reward: 25,
    status: 'completed',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    title: 'Sticker Collector',
    description: 'Collect 10 different stickers',
    icon: '📱',
    progress: 7,
    target: 10,
    reward: 50,
    status: 'active',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    userId: '1',
    title: 'Craft Master',
    description: 'Craft your first epic sticker',
    icon: '⚒️',
    progress: 0,
    target: 1,
    reward: 100,
    status: 'active',
    createdAt: '2024-01-25T00:00:00Z',
  },
];

let featuredGames = [
  {
    id: '1',
    title: 'Space Runner',
    description: 'Navigate through asteroid fields',
    icon: '🚀',
    reward: '50 PLT',
    duration: '5 min',
    players: '1-4',
    featured: true,
    active: true,
    popularity: 95,
    gradient: ['#2c3e50', '#34495e'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '2',
    title: 'Planet Defender',
    description: 'Protect your homeworld',
    icon: '🛡️',
    reward: '75 PLT',
    duration: '10 min',
    players: '2-8',
    featured: true,
    active: true,
    popularity: 88,
    gradient: ['#e74c3c', '#c0392b'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '3',
    title: 'Stellar Puzzle',
    description: 'Solve cosmic puzzles',
    icon: '🧩',
    reward: '100 PLT',
    duration: '15 min',
    players: '1',
    featured: true,
    active: true,
    popularity: 92,
    gradient: ['#9b59b6', '#8e44ad'],
    isNew: true,
    isPopular: false,
  },
  {
    id: '4',
    title: 'Galaxy Racing',
    description: 'Race through nebulas',
    icon: '🏎️',
    reward: '60 PLT',
    duration: '8 min',
    players: '1-6',
    featured: true,
    active: true,
    popularity: 85,
    gradient: ['#f39c12', '#e67e22'],
    isNew: false,
    isPopular: false,
  },
];

class FirestoreService {
  // Get user data in real-time (simulated)
  subscribeToUserData(userId, callback) {
    if (!userId) {
      console.warn('No userId provided for user data subscription');
      return () => {};
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(userData);
    }, 100);

    return () => clearInterval(interval);
  }

  // Get featured content in real-time (simulated)
  subscribeToFeaturedContent(callback) {
    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(featuredContent);
    }, 100);

    return () => clearInterval(interval);
  }

  // Get user quests in real-time (simulated)
  subscribeToUserQuests(userId, callback) {
    if (!userId) {
      console.warn('No userId provided for quests subscription');
      return () => {};
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(userQuests);
    }, 100);

    return () => clearInterval(interval);
  }

  // Get featured games in real-time (simulated)
  subscribeToFeaturedGames(callback) {
    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(featuredGames);
    }, 100);

    return () => clearInterval(interval);
  }

  // Get all games (simulated)
  subscribeToAllGames(callback) {
    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(featuredGames);
    }, 100);

    return () => clearInterval(interval);
  }

  // Get all quests for a user (simulated)
  subscribeToAllQuests(userId, callback) {
    if (!userId) {
      console.warn('No userId provided for all quests subscription');
      return () => {};
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(userQuests);
    }, 100);

    return () => clearInterval(interval);
  }

  // Update user data (simulated)
  async updateUserData(userId, updates) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user data
      userData = { ...userData, ...updates };
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false, error: error.message };
    }
  }

  // Complete a quest (simulated)
  async completeQuest(questId, userId) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the quest
      const questIndex = userQuests.findIndex(q => q.id === questId);
      if (questIndex === -1) {
        throw new Error('Quest not found');
      }

      const quest = userQuests[questIndex];
      
      // Update quest status
      userQuests[questIndex] = {
        ...quest,
        status: 'completed',
        progress: quest.target,
        completedAt: new Date().toISOString(),
      };
      
      // Update user XP and PLT
      userData.xp += quest.reward;
      userData.pltBalance += quest.reward;
      userData.level = Math.floor(userData.xp / 1000) + 1;
      
      return { success: true };
    } catch (error) {
      console.error('Error completing quest:', error);
      return { success: false, error: error.message };
    }
  }

  // Crafting functions
  async getCraftingPreview(elementIds) {
    try {
      // For now, simulate the Cloud Function call
      // In production, this would call the actual Cloud Function
      const filledSlots = elementIds;
      
      if (filledSlots.length === 0) {
        return { success: true, preview: null };
      }

      // Simulated preview logic
      const elementTypes = filledSlots;
      const uniqueElements = [...new Set(elementTypes)];
      
      if (uniqueElements.length === 2 && elementTypes.length === 2) {
        const combinations = {
          'fire,water': { name: 'Steam Element', icon: '💨', rarity: 'Rare', successRate: 0.8, reward: 50 },
          'fire,earth': { name: 'Lava Element', icon: '🌋', rarity: 'Rare', successRate: 0.7, reward: 60 },
          'water,earth': { name: 'Mud Element', icon: '🌊', rarity: 'Common', successRate: 0.9, reward: 30 },
          'air,fire': { name: 'Flame Element', icon: '🔥', rarity: 'Rare', successRate: 0.75, reward: 55 },
          'lightning,water': { name: 'Storm Element', icon: '⛈️', rarity: 'Epic', successRate: 0.6, reward: 100 },
          'ice,fire': { name: 'Steam Element', icon: '💨', rarity: 'Rare', successRate: 0.8, reward: 50 },
        };
        
        const key = elementTypes.sort().join(',');
        const preview = combinations[key];
        
        if (preview) {
          return {
            success: true,
            preview: {
              ...preview,
              elements: filledSlots,
            }
          };
        } else {
          return {
            success: true,
            preview: {
              name: 'Unknown Combination',
              icon: '❓',
              rarity: 'Unknown',
              successRate: 0.3,
              reward: 10,
              elements: filledSlots,
            }
          };
        }
      } else if (uniqueElements.length === 3 && elementTypes.length === 3) {
        return {
          success: true,
          preview: {
            name: 'Complex Element',
            icon: '🌟',
            rarity: 'Epic',
            successRate: 0.5,
            reward: 150,
            elements: filledSlots,
          }
        };
      } else {
        return {
          success: true,
          preview: {
            name: 'Mixed Elements',
            icon: '🌀',
            rarity: 'Common',
            successRate: 0.4,
            reward: 20,
            elements: filledSlots,
          }
        };
      }
    } catch (error) {
      console.error('Error getting crafting preview:', error);
      return { success: false, error: error.message };
    }
  }

  async performCraft(elementIds) {
    try {
      // For now, simulate the Cloud Function call
      // In production, this would call the actual Cloud Function
      
      // Simulate crafting success/failure
      const isSuccess = Math.random() < 0.7; // 70% success rate for demo
      const reward = isSuccess ? Math.floor(Math.random() * 100) + 20 : 0;
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isSuccess) {
        return {
          success: true,
          reward: reward,
          message: `Crafting successful! You earned ${reward} $PLT!`
        };
      } else {
        return {
          success: false,
          reward: 0,
          message: 'Crafting failed! Elements were consumed.'
        };
      }
    } catch (error) {
      console.error('Error performing craft:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user elements from Firestore
  subscribeToUserElements(userId, callback) {
    if (!userId) {
      console.warn('No userId provided for user elements subscription');
      return null;
    }

    // For now, simulate user elements data with a good variety for testing
    const simulatedElements = [
      { id: 'fire', name: 'Fire Element', icon: '🔥', rarity: 'Common', count: 8 },
      { id: 'water', name: 'Water Element', icon: '💧', rarity: 'Common', count: 6 },
      { id: 'earth', name: 'Earth Element', icon: '🌍', rarity: 'Common', count: 7 },
      { id: 'air', name: 'Air Element', icon: '💨', rarity: 'Common', count: 5 },
      { id: 'lightning', name: 'Lightning Element', icon: '⚡', rarity: 'Rare', count: 3 },
      { id: 'ice', name: 'Ice Element', icon: '❄️', rarity: 'Rare', count: 4 },
      { id: 'shadow', name: 'Shadow Element', icon: '🌑', rarity: 'Epic', count: 2 },
      { id: 'light', name: 'Light Element', icon: '✨', rarity: 'Epic', count: 2 },
    ];
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      callback(simulatedElements);
    }, 100);

    return () => clearInterval(interval);
  }
}

export const firestoreService = new FirestoreService(); 