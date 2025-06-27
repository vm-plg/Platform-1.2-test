import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LeaderboardWidget = ({ leaderboardData = [], userRank, onSeeAllPress }) => {
  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          index < 3 ? styles.topRankText : null
        ]}>
          #{item.rank}
        </Text>
        {index < 3 && (
          <Ionicons 
            name="trophy" 
            size={16} 
            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
          />
        )}
      </View>
      
      <View style={styles.playerInfo}>
        <Text style={styles.playerIcon}>{item.profileIcon}</Text>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{item.username}</Text>
          <Text style={styles.playerStats}>
            Level {item.level} • {item.gamesPlayed} games
          </Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{item.totalScore.toLocaleString()}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  );

  const displayedLeaderboard = leaderboardData.slice(0, 5); // Show only top 5

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {userRank && (
        <View style={styles.userRankCard}>
          <Text style={styles.userRankTitle}>Your Rank</Text>
          <Text style={styles.userRankText}>#{userRank}</Text>
        </View>
      )}

      {displayedLeaderboard.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyTitle}>No Leaderboard Data</Text>
          <Text style={styles.emptyDescription}>
            Play games to climb the leaderboard!
          </Text>
        </View>
      ) : (
        <View style={styles.leaderboardList}>
          {displayedLeaderboard.map((item, index) => renderLeaderboardItem({ item, index }))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
  },
  userRankCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  userRankTitle: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
  userRankText: {
    color: '#00ff88',
    fontSize: 24,
    fontWeight: 'bold',
  },
  leaderboardList: {
    paddingHorizontal: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888888',
    marginRight: 4,
  },
  topRankText: {
    color: '#FFD700',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  playerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 10,
    color: '#888888',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#888888',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LeaderboardWidget; 