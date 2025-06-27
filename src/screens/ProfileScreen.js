import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import authService from '../services/authService';

// Simulated user data
const USER = {
  username: 'astro_player',
  // Using a simple emoji avatar instead of external URL
  avatar: '👨‍🚀',
};

const MENU_ITEMS = [
  {
    label: 'Wallet',
    icon: 'wallet',
    screen: 'WalletScreen',
  },
  {
    label: 'Refer a Friend',
    icon: 'person-add',
    screen: 'ReferralScreen',
  },
  {
    label: 'Settings',
    icon: 'settings',
    screen: 'SettingsScreen',
  },
  {
    label: 'Support',
    icon: 'help-circle',
    url: 'https://help.planetleague.gg',
  },
  {
    label: 'Logout',
    icon: 'log-out',
    action: 'logout',
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();

  const userStats = {
    username: 'CosmicExplorer',
    level: 15,
    experience: 1250,
    nextLevelExp: 2000,
    totalPLT: 1250,
    gamesPlayed: 47,
    stickersCollected: 23,
    achievements: 8,
  };

  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '👣',
      unlocked: true,
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Sticker Collector',
      description: 'Collect 10 different stickers',
      icon: '📱',
      unlocked: true,
      date: '2024-01-20',
    },
    {
      id: 3,
      name: 'Craft Master',
      description: 'Craft your first epic sticker',
      icon: '⚒️',
      unlocked: false,
      progress: '0/1',
    },
    {
      id: 4,
      name: 'PLT Millionaire',
      description: 'Earn 10,000 PLT tokens',
      icon: '💰',
      unlocked: false,
      progress: '1250/10000',
    },
  ];

  const progressPercentage = (userStats.experience / userStats.nextLevelExp) * 100;

  const handleMenuPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.url) {
      Linking.openURL(item.url);
    } else if (item.action === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('Starting logout process...');
                await authService.signOut();
                console.log('User signed out successfully, attempting navigation...');
                
                // Try multiple navigation approaches
                try {
                  // First try: replace the current screen
                  navigation.replace('Login');
                  console.log('Navigation replace completed');
                } catch (navError) {
                  console.error('Navigation replace failed:', navError);
                  // Second try: reset navigation
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                  console.log('Navigation reset completed');
                }
              } catch (e) {
                console.error('Logout error:', e);
                Alert.alert('Logout Failed', e.message || 'Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  const renderAchievement = (achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        !achievement.unlocked && styles.lockedAchievement,
      ]}
    >
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
        </View>
        {achievement.unlocked ? (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>✓</Text>
          </View>
        ) : (
          <Text style={styles.progressText}>{achievement.progress}</Text>
        )}
      </View>
      {achievement.unlocked && (
        <Text style={styles.achievementDate}>Unlocked {achievement.date}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{USER.avatar}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{userStats.username}</Text>
              <Text style={styles.level}>Level {userStats.level}</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userStats.experience} / {userStats.nextLevelExp} XP
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPLT}</Text>
              <Text style={styles.statLabel}>PLT Tokens</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.stickersCollected}</Text>
              <Text style={styles.statLabel}>Stickers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.achievements}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name={item.icon} size={24} color="#00ff88" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888888" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map(renderAchievement)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 40,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  lockedAchievement: {
    opacity: 0.6,
    borderColor: '#666666',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#cccccc',
  },
  unlockedBadge: {
    backgroundColor: '#00ff88',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  achievementDate: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  menuItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333333',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
});

export default ProfileScreen; 