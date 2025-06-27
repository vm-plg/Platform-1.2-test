// Simulated Authentication Service
// This mimics Firebase behavior for development/testing

// Simulated user database
let users = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    isNewUser: false,
    createdAt: '2024-01-01T00:00:00Z',
    lastSignIn: '2024-01-15T00:00:00Z'
  }
];

// Simulated current user
let currentUser = null;

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation helper
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const authService = {
  // Simulate Google Sign In
  signInWithGoogle: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful Google sign in
    const mockUser = {
      id: 'google-user-1',
      email: 'user@gmail.com',
      displayName: 'Google User',
      isNewUser: Math.random() > 0.5, // Randomly decide if new user
      createdAt: new Date().toISOString(),
      lastSignIn: new Date().toISOString()
    };
    
    currentUser = mockUser;
    
    return {
      success: true,
      user: mockUser
    };
  },

  // Simulate X (Twitter) Sign In
  signInWithX: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'x-user-1',
      email: 'user@x.com',
      displayName: 'X User',
      isNewUser: Math.random() > 0.5,
      createdAt: new Date().toISOString(),
      lastSignIn: new Date().toISOString()
    };
    
    currentUser = mockUser;
    
    return {
      success: true,
      user: mockUser
    };
  },

  // Simulate Email/Password Sign In
  signInWithEmail: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'auth/invalid-email',
        message: 'Please enter a valid email address'
      };
    }
    
    // Validate password
    if (!isValidPassword(password)) {
      return {
        success: false,
        error: 'auth/wrong-password',
        message: 'Password must be at least 6 characters long'
      };
    }
    
    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        error: 'auth/user-not-found',
        message: 'No account found with this email address'
      };
    }
    
    // Check password
    if (user.password !== password) {
      return {
        success: false,
        error: 'auth/wrong-password',
        message: 'Incorrect password. Please try again.'
      };
    }
    
    // Success - update last sign in
    user.lastSignIn = new Date().toISOString();
    currentUser = user;
    
    return {
      success: true,
      user: user
    };
  },

  // Simulate Create User with Email
  createUserWithEmail: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate email format
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'auth/invalid-email',
        message: 'Please enter a valid email address'
      };
    }
    
    // Validate password
    if (!isValidPassword(password)) {
      return {
        success: false,
        error: 'auth/weak-password',
        message: 'Password must be at least 6 characters long'
      };
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        error: 'auth/email-already-in-use',
        message: 'An account with this email already exists'
      };
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password: password,
      username: null, // Will be set later
      isNewUser: true,
      createdAt: new Date().toISOString(),
      lastSignIn: new Date().toISOString()
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    return {
      success: true,
      user: newUser
    };
  },

  // Get current user
  getCurrentUser: () => {
    return currentUser;
  },

  // Update username (now integrates with username service)
  updateUsername: async (username) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (currentUser) {
      currentUser.username = username;
      currentUser.isNewUser = false;
      
      // Update in users array if it's an email user
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
      }
    }
    
    return {
      success: true,
      user: currentUser
    };
  },

  // Sign out
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    currentUser = null;
    return { success: true };
  },

  // Check if user is new
  isNewUser: (user) => {
    return user.isNewUser || user.username === null;
  },

  // Get all users (for testing)
  getAllUsers: () => {
    return [...users];
  },

  // Reset users (for testing)
  resetUsers: () => {
    users = [
      {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        isNewUser: false,
        createdAt: '2024-01-01T00:00:00Z',
        lastSignIn: '2024-01-15T00:00:00Z'
      }
    ];
    currentUser = null;
  }
};

export default authService; 