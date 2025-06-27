# Planet League

The universe's most rewarding casual gaming platform, empowering players to unify their achievements across countless games and convert their playtime into tangible, real-world value through a compelling crafting and collection economy.

## Features

- **Unified Rewards**: Your effort in any game contributes to your universal progress
- **Play-to-Craft**: Engage with fun games to earn Elements and craft $PLT tokens
- **Collection Economy**: Complete seasonal Sticker Albums and trade with other players
- **Cross-Platform**: Built with React Native for mobile and web

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd planet-league
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## Project Structure

```
planet-league/
├── src/
│   └── screens/
│       ├── SplashScreen.js    # Welcome screen with navigation
│       └── LoginScreen.js     # Authentication screen (placeholder)
├── App.js                     # Main app with navigation setup
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Current Implementation

### SplashScreen
- Full-screen space nebula background
- Futuristic "PLANET LEAGUE" title with bold styling
- "Play. Earn. Own." tagline
- Large "GET STARTED" button with gradient styling
- Navigation to LoginScreen on button press

### Navigation
- React Navigation v6 with stack navigator
- Clean transitions between screens
- Status bar configured for light content

## Next Steps

1. Implement complete authentication flow
2. Build Main Hub dashboard
3. Integrate HTML5 games
4. Create The Forge crafting system
5. Build Sticker Album collection interface
6. Implement marketplace (V2)

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI**: Native components with custom styling
- **Background**: Unsplash space nebula image
- **Gradients**: Expo Linear Gradient

## Contributing

This is the initial implementation of Planet League. The project follows a phased development approach as outlined in the execution document. 