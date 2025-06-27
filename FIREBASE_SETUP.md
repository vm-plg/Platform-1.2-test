# Firebase Functions Setup Guide

## Overview
The Firebase Cloud Functions for Planet League are located in the `functions/` directory and are completely separate from the React Native app. This guide will help you set up and deploy the functions.

## Quick Setup

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
cd functions
firebase init
```

When prompted:
- Select "Functions" 
- Choose "Create a new project" or use existing
- Select JavaScript
- Say "No" to ESLint
- Say "Yes" to installing dependencies

### 4. Install Dependencies
```bash
cd functions
npm install
```

### 5. Deploy Functions
```bash
firebase deploy --only functions
```

## Project Structure

```
Platform 1.2/
├── src/                    # React Native app
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Main functions
│   ├── package.json       # Function dependencies
│   ├── firebase.json      # Firebase config
│   ├── firestore.rules    # Security rules
│   └── README.md          # Function documentation
├── .expoignore            # Excludes functions from Expo
└── .gitignore             # Git ignore rules
```

## Available Functions

### 1. `checkUsername`
- **Purpose**: Check if username is available
- **Authentication**: Not required
- **Usage**: `checkUsername({ username: 'gamer123' })`

### 2. `setUsername`
- **Purpose**: Set username and give onboarding rewards
- **Authentication**: Required
- **Usage**: `setUsername({ username: 'gamer123' })`

### 3. `getUserProfile`
- **Purpose**: Get user profile data
- **Authentication**: Required
- **Usage**: `getUserProfile()`

## Integration with React Native

### Current Status
- ✅ **Simulated functions** working in React Native app
- ✅ **Real Firebase functions** ready for deployment
- 🔄 **Integration pending** - need to replace simulated functions

### Next Steps
1. Deploy Firebase functions (see above)
2. Update React Native app to use real Firebase
3. Test complete authentication flow

## Troubleshooting

### Metro Bundler Error
If you see errors about `functions/package.json`, the `.expoignore` file should fix this by excluding the functions directory from Expo's file watching.

### Firebase Project Issues
If you get "No currently active project" errors:
```bash
firebase projects:list
firebase use --add
```

### Function Deployment Issues
```bash
firebase functions:log
```

## Development Workflow

### Local Development
```bash
cd functions
firebase emulators:start --only functions
```

### Testing Functions
```bash
cd functions
npm run serve
```

### Deploying Changes
```bash
cd functions
firebase deploy --only functions
```

## Security Notes

- Functions are protected by Firebase Authentication
- Firestore rules ensure data security
- Username validation prevents malicious inputs
- Transactions prevent race conditions

## Support

For Firebase-specific issues:
1. Check Firebase Console
2. Review function logs
3. Test with emulator
4. Check Firestore rules

The functions are production-ready and follow Firebase best practices! 