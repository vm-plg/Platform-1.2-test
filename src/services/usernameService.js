// Simulated Username Service
// This mimics Firebase Cloud Functions for username operations

// Simulated usernames database
let takenUsernames = [
  'admin',
  'testuser',
  'gamer123',
  'player1',
  'coolguy',
  'proplayer',
  'gamingmaster',
  'planetleague',
  'spacegamer',
  'cosmicplayer'
];

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const usernameService = {
  // Simulate Firebase Cloud Function: checkUsername
  checkUsername: async (username) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Username validation rules
    const minLength = 3;
    const maxLength = 20;
    const validChars = /^[a-zA-Z0-9_]+$/;
    
    // Check length
    if (username.length < minLength) {
      return {
        available: false,
        error: `Username must be at least ${minLength} characters long`
      };
    }
    
    if (username.length > maxLength) {
      return {
        available: false,
        error: `Username must be ${maxLength} characters or less`
      };
    }
    
    // Check for valid characters
    if (!validChars.test(username)) {
      return {
        available: false,
        error: 'Username can only contain letters, numbers, and underscores'
      };
    }
    
    // Check if username is taken
    const isTaken = takenUsernames.some(
      taken => taken.toLowerCase() === username.toLowerCase()
    );
    
    if (isTaken) {
      return {
        available: false,
        error: 'Username is already taken'
      };
    }
    
    return {
      available: true,
      error: null
    };
  },

  // Simulate Firebase Cloud Function: setUsername
  setUsername: async (username, userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username is still available (race condition protection)
    const availabilityCheck = await usernameService.checkUsername(username);
    if (!availabilityCheck.available) {
      return {
        success: false,
        error: availabilityCheck.error
      };
    }
    
    // Add username to taken list
    takenUsernames.push(username.toLowerCase());
    
    // Here you would typically update the user's Firestore document
    // For now, we'll just return success
    
    return {
      success: true,
      user: {
        id: userId,
        username: username,
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Create debounced version of checkUsername
  debouncedCheckUsername: debounce(async (username, callback) => {
    if (!username || username.length < 3) {
      callback({ available: false, error: null, loading: false });
      return;
    }
    
    callback({ available: false, error: null, loading: true });
    
    try {
      const result = await usernameService.checkUsername(username);
      callback({ ...result, loading: false });
    } catch (error) {
      callback({ available: false, error: 'Network error', loading: false });
    }
  }, 500), // 500ms debounce delay

  // Get all taken usernames (for testing)
  getTakenUsernames: () => {
    return [...takenUsernames];
  },

  // Reset taken usernames (for testing)
  resetTakenUsernames: () => {
    takenUsernames = [
      'admin',
      'testuser',
      'gamer123',
      'player1',
      'coolguy',
      'proplayer',
      'gamingmaster',
      'planetleague',
      'spacegamer',
      'cosmicplayer'
    ];
  }
};

export default usernameService; 