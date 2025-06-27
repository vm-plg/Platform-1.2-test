import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Simulated season pass rewards data
const SEASON_PASS_REWARDS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  free: {
    type: i % 3 === 0 ? 'plt' : i % 3 === 1 ? 'element' : 'sticker',
    amount: i % 3 === 0 ? Math.floor(Math.random() * 50) + 10 : 1,
    itemId: i % 3 === 1 ? `element_${i}` : i % 3 === 2 ? `sticker_${i}` : null,
    rarity: i % 3 === 1 ? ['common', 'uncommon', 'rare'][i % 3] : null,
  },
  premium: {
    type: i % 4 === 0 ? 'plt' : i % 4 === 1 ? 'element' : i % 4 === 2 ? 'sticker' : 'exclusive',
    amount: i % 4 === 0 ? Math.floor(Math.random() * 100) + 50 : 1,
    itemId: i % 4 === 1 ? `premium_element_${i}` : i % 4 === 2 ? `premium_sticker_${i}` : i % 4 === 3 ? `exclusive_${i}` : null,
    rarity: i % 4 === 1 ? ['rare', 'epic', 'legendary'][i % 3] : null,
  },
}));

// Simulated user data
const USER_DATA = {
  seasonPassLevel: 15,
  hasPremiumPass: false,
  claimedRewards: {
    free: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    premium: [], // Premium rewards are not claimed until user has premium pass
  },
};

const SeasonPassScreen = () => {
  const [rewards, setRewards] = useState(SEASON_PASS_REWARDS);
  const [userData, setUserData] = useState(USER_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch season pass rewards from Firestore
    // TODO: Fetch user season pass data from Firestore
  }, []);

  const getRewardIcon = (type) => {
    switch (type) {
      case 'plt':
        return 'logo-bitcoin';
      case 'element':
        return 'flame';
      case 'sticker':
        return 'star';
      case 'exclusive':
        return 'diamond';
      default:
        return 'gift';
    }
  };

  const getRewardColor = (type) => {
    switch (type) {
      case 'plt':
        return '#FFD700';
      case 'element':
        return '#FF6B6B';
      case 'sticker':
        return '#4ECDC4';
      case 'exclusive':
        return '#9B59B6';
      default:
        return '#95A5A6';
    }
  };

  const getRewardText = (reward) => {
    if (reward.type === 'plt') {
      return `${reward.amount} $PLT`;
    } else if (reward.type === 'element') {
      return `${reward.rarity} Element`;
    } else if (reward.type === 'sticker') {
      return `${reward.rarity} Sticker`;
    } else if (reward.type === 'exclusive') {
      return 'Exclusive Item';
    }
    return 'Reward';
  };

  const isClaimed = (level, track) => {
    return userData.claimedRewards[track].includes(level);
  };

  const isClaimable = (level, track) => {
    if (track === 'premium' && !userData.hasPremiumPass) return false;
    return level <= userData.seasonPassLevel && !isClaimed(level, track);
  };

  const isFuture = (level) => {
    return level > userData.seasonPassLevel;
  };

  const handleClaimReward = (level, track) => {
    if (!isClaimable(level, track)) return;
    
    Alert.alert(
      'Claim Reward',
      `Claim ${track} reward for level ${level}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => {
            // TODO: Call Cloud Function to claim reward
            console.log(`Claiming ${track} reward for level ${level}`);
            // Simulate claiming the reward
            setUserData(prev => ({
              ...prev,
              claimedRewards: {
                ...prev.claimedRewards,
                [track]: [...prev.claimedRewards[track], level]
              }
            }));
          },
        },
      ]
    );
  };

  const handleUpgradeToPremium = () => {
    console.log('Upgrade button pressed'); // Debug log
    Alert.alert(
      'Upgrade to Premium',
      'Purchase Premium Season Pass for 1000 $PLT?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            console.log('Purchase confirmed'); // Debug log
            setLoading(true);
            // TODO: Call Cloud Function to purchase premium pass
            setTimeout(() => {
              console.log('Updating user data to premium'); // Debug log
              setUserData(prev => ({ 
                ...prev, 
                hasPremiumPass: true,
                claimedRewards: {
                  ...prev.claimedRewards,
                  premium: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // Auto-claim first 15 premium rewards
                }
              }));
              setLoading(false);
              Alert.alert('Success', 'Premium Season Pass purchased! You can now claim premium rewards.');
            }, 1000);
          },
        },
      ]
    );
  };

  const RewardItem = ({ reward, level, track, isClaimed, isClaimable, isFuture, isPremiumLocked }) => {
    const icon = getRewardIcon(reward.type);
    const color = getRewardColor(reward.type);
    const text = getRewardText(reward);

    return (
      <TouchableOpacity
        style={[
          styles.rewardItem,
          isClaimed && styles.rewardClaimed,
          isClaimable && styles.rewardClaimable,
          isFuture && styles.rewardFuture,
          isPremiumLocked && styles.rewardLocked,
        ]}
        onPress={() => handleClaimReward(level, track)}
        disabled={!isClaimable || isPremiumLocked}
      >
        <View style={[styles.rewardIcon, { backgroundColor: color }]}>
          {isPremiumLocked ? (
            <Ionicons name="lock-closed" size={16} color="#FFF" />
          ) : (
            <Ionicons name={icon} size={16} color="#FFF" />
          )}
        </View>
        <Text style={[
          styles.rewardText,
          isClaimed && styles.rewardTextClaimed,
          isFuture && styles.rewardTextFuture,
          isPremiumLocked && styles.rewardTextLocked,
        ]}>
          {text}
        </Text>
        {isClaimed && (
          <Ionicons name="checkmark-circle" size={16} color="#27AE60" style={styles.claimedIcon} />
        )}
      </TouchableOpacity>
    );
  };

  const LevelItem = ({ level, freeReward, premiumReward }) => {
    const isFreeClaimed = isClaimed(level, 'free');
    const isFreeClaimable = isClaimable(level, 'free');
    const isPremiumClaimed = isClaimed(level, 'premium');
    const isPremiumClaimable = isClaimable(level, 'premium');
    const isFutureLevel = isFuture(level);
    const isPremiumLocked = !userData.hasPremiumPass;

    return (
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <View style={[
            styles.levelBadge,
            level <= userData.seasonPassLevel && styles.levelBadgeCompleted,
          ]}>
            <Text style={[
              styles.levelText,
              level <= userData.seasonPassLevel && styles.levelTextCompleted,
            ]}>
              {level}
            </Text>
          </View>
          {level <= userData.seasonPassLevel && (
            <View style={styles.progressLine} />
          )}
        </View>
        
        <View style={styles.rewardsContainer}>
          <View style={styles.rewardRow}>
            <Text style={styles.trackLabel}>Free</Text>
            <RewardItem
              reward={freeReward}
              level={level}
              track="free"
              isClaimed={isFreeClaimed}
              isClaimable={isFreeClaimable}
              isFuture={isFutureLevel}
            />
          </View>
          
          <View style={styles.rewardRow}>
            <Text style={styles.trackLabel}>Premium</Text>
            <RewardItem
              reward={premiumReward}
              level={level}
              track="premium"
              isClaimed={isPremiumClaimed}
              isClaimable={isPremiumClaimable}
              isFuture={isFutureLevel}
              isPremiumLocked={isPremiumLocked}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Season Pass</Text>
        <View style={styles.levelInfo}>
          <Text style={styles.levelLabel}>Level {userData.seasonPassLevel}</Text>
          <Text style={styles.progressText}>Progress: {userData.seasonPassLevel}/50</Text>
        </View>
        {!userData.hasPremiumPass && (
          <TouchableOpacity
            style={[styles.upgradeButton, loading && styles.upgradeButtonDisabled]}
            onPress={handleUpgradeToPremium}
            disabled={loading}
          >
            <Ionicons name="medal" size={16} color="#FFF" />
            <Text style={styles.upgradeButtonText}>
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.trackContainer}>
          {rewards.map((levelData) => (
            <LevelItem
              key={levelData.level}
              level={levelData.level}
              freeReward={levelData.free}
              premiumReward={levelData.premium}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  progressText: {
    fontSize: 14,
    color: '#CCC',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B59B6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  upgradeButtonDisabled: {
    opacity: 0.6,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  trackContainer: {
    padding: 20,
  },
  levelContainer: {
    marginBottom: 30,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  levelBadgeCompleted: {
    backgroundColor: '#27AE60',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCC',
  },
  levelTextCompleted: {
    color: '#FFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#27AE60',
  },
  rewardsContainer: {
    marginLeft: 55,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackLabel: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: '#CCC',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#404040',
  },
  rewardClaimed: {
    backgroundColor: '#1e3a1e',
    borderColor: '#27AE60',
  },
  rewardClaimable: {
    backgroundColor: '#2d2d2d',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rewardFuture: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  rewardLocked: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    opacity: 0.6,
  },
  rewardIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  rewardTextClaimed: {
    color: '#27AE60',
  },
  rewardTextFuture: {
    color: '#666',
  },
  rewardTextLocked: {
    color: '#666',
  },
  claimedIcon: {
    marginLeft: 8,
  },
});

export default SeasonPassScreen; 