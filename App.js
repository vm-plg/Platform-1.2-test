import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import UsernameScreen from './src/screens/UsernameScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import TabNavigator from './src/navigation/TabNavigator';
import WalletScreen from './src/screens/WalletScreen';
import ReferralScreen from './src/screens/ReferralScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import TournamentScreen from './src/screens/TournamentScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Username" component={UsernameScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen 
          name="WalletScreen" 
          component={WalletScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ReferralScreen" 
          component={ReferralScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="SettingsScreen" 
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="LeaderboardScreen" 
          component={LeaderboardScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="TournamentScreen" 
          component={TournamentScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 