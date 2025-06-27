import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import MainHubScreen from '../screens/MainHubScreen';
import GamesScreen from '../screens/GamesScreen';
import ForgeScreen from '../screens/ForgeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StickerAlbumScreen from '../screens/StickerAlbumScreen';
import StoreScreen from '../screens/StoreScreen';
import SeasonPassScreen from '../screens/SeasonPassScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Hub') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Album') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Forge') {
            iconName = focused ? 'hammer' : 'hammer-outline';
          } else if (route.name === 'Store') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Season Pass') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Hub" 
        component={MainHubScreen}
        options={{
          title: 'Hub',
        }}
      />
      <Tab.Screen 
        name="Games" 
        component={GamesScreen}
        options={{
          title: 'Games',
        }}
      />
      <Tab.Screen 
        name="Album" 
        component={StickerAlbumScreen}
        options={{
          title: 'Album',
        }}
      />
      <Tab.Screen 
        name="Forge" 
        component={ForgeScreen}
        options={{
          title: 'Forge',
        }}
      />
      <Tab.Screen 
        name="Store" 
        component={StoreScreen}
        options={{
          title: 'Store',
        }}
      />
      <Tab.Screen 
        name="Season Pass" 
        component={SeasonPassScreen}
        options={{
          title: 'Season Pass',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 