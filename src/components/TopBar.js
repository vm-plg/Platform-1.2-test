import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TopBar = ({ userData, onProfilePress }) => {
  const navigation = useNavigation();
  const { username, level = 1, xp = 0, pltBalance = 0, profileIcon = '👨‍🚀' } = userData || {};
  
  // Calculate XP progress (assuming 1000 XP per level)
  const xpPerLevel = 1000;
  const currentLevelXp = xp % xpPerLevel;
  const xpProgress = (currentLevelXp / xpPerLevel) * 100;

  const handleWalletPress = () => {
    navigation.navigate('WalletScreen');
  };

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>{profileIcon}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username || 'Player'}</Text>
          <Text style={styles.level}>Level {level}</Text>
        </View>
      </TouchableOpacity>

      {/* XP Bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpBarContainer}>
          <View style={styles.xpBar}>
            <View 
              style={[
                styles.xpBarFill,
                { width: `${xpProgress}%` }
              ]}
            />
          </View>
          <Text style={styles.xpText}>{currentLevelXp}/{xpPerLevel} XP</Text>
        </View>
      </View>

      {/* PLT Balance - Now Clickable */}
      <TouchableOpacity style={styles.pltSection} onPress={handleWalletPress}>
        <View style={styles.pltContainer}>
          <Text style={styles.pltIcon}>💎</Text>
          <Text style={styles.pltAmount}>{pltBalance.toLocaleString()}</Text>
          <Text style={styles.pltLabel}>PLT</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileIconText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  level: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: '600',
  },
  xpSection: {
    flex: 2,
    marginHorizontal: 16,
  },
  xpBarContainer: {
    alignItems: 'center',
  },
  xpBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '500',
  },
  pltSection: {
    alignItems: 'flex-end',
  },
  pltContainer: {
    alignItems: 'center',
  },
  pltIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  pltAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 1,
  },
  pltLabel: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '500',
  },
});

export default TopBar; 