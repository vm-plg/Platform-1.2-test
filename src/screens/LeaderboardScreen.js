import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import leaderboardService from '../services/leaderboardService';
import authService from '../services/authService';

const LeaderboardScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.initialTab || 'global';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'global') {
        await loadGlobalLeaderboard();
      } else {
        await loadTournaments();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalLeaderboard = async () => {
    try {
      // Use the shared service for consistent data
      const leaderboardData = leaderboardService.getFullLeaderboard();
      setGlobalLeaderboard(leaderboardData);
      
      // Get current user's rank
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const rank = leaderboardService.getUserRank(currentUser.uid);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Error loading global leaderboard:', error);
      throw error;
    }
  };

  const loadTournaments = async () => {
    try {
      // Use the shared service for consistent data
      const tournamentsData = leaderboardService.getAllTournaments();
      setTournaments(tournamentsData);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      throw error;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleTournamentEntry = async (tournament) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to enter tournaments.');
        return;
      }

      if (tournament.entryFee > 0) {
        // Simulate balance check - in real app this would check Firestore
        const currentBalance = 1000; // Simulated balance

        if (currentBalance < tournament.entryFee) {
          Alert.alert(
            'Insufficient Balance',
            `You need ${tournament.entryFee} $PLT to enter this tournament. Your current balance: ${currentBalance} $PLT`
          );
          return;
        }

        // Confirm entry
        Alert.alert(
          'Enter Tournament',
          `Join "${tournament.name}" for ${tournament.entryFee} $PLT?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enter', onPress: () => processTournamentEntry(tournament) }
          ]
        );
      } else {
        // Free tournament
        Alert.alert(
          'Enter Tournament',
          `Join "${tournament.name}" for free?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enter', onPress: () => processTournamentEntry(tournament) }
          ]
        );
      }
    } catch (error) {
      console.error('Error handling tournament entry:', error);
      Alert.alert('Error', 'Failed to process tournament entry. Please try again.');
    }
  };

  const processTournamentEntry = async (tournament) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      // Use the service to enter tournament
      const result = await leaderboardService.enterTournament(tournament.id, currentUser.uid);
      
      Alert.alert('Success', result.message);
      
      // If tournament is active, navigate to tournament screen
      if (tournament.status === 'active') {
        navigation.navigate('TournamentScreen', { tournamentId: tournament.id });
      } else {
        // For upcoming tournaments, just refresh the list
        loadTournaments();
      }
      
    } catch (error) {
      console.error('Error processing tournament entry:', error);
      Alert.alert('Error', error.message || 'Failed to enter tournament. Please try again.');
    }
  };

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
            size={20} 
            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
          />
        )}
      </View>
      
      <View style={styles.playerInfo}>
        <Text style={styles.playerIcon}>{item.profileIcon}</Text>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{item.username}</Text>
          <Text style={styles.playerStats}>
            Level {item.level} • {item.gamesPlayed} games • {item.winRate}% win rate
          </Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{item.totalScore.toLocaleString()}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  );

  const renderTournamentItem = ({ item }) => (
    <View style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? '#00ff88' : item.status === 'upcoming' ? '#ffaa00' : '#888888' }
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.tournamentGame}>{item.game}</Text>
      <Text style={styles.tournamentDescription}>{item.description}</Text>
      
      <View style={styles.tournamentDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="trophy" size={16} color="#FFD700" />
          <Text style={styles.detailText}>Prize Pool: {item.prizePool.toLocaleString()} $PLT</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="people" size={16} color="#00ff88" />
          <Text style={styles.detailText}>
            {item.currentParticipants}/{item.maxParticipants} participants
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#ffaa00" />
          <Text style={styles.detailText}>
            {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      {item.entryFee > 0 && (
        <View style={styles.entryFeeContainer}>
          <Text style={styles.entryFeeText}>Entry Fee: {item.entryFee} $PLT</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.entryButton,
          item.status !== 'upcoming' && item.status !== 'active' ? styles.disabledButton : null
        ]}
        onPress={() => handleTournamentEntry(item)}
        disabled={item.status !== 'upcoming' && item.status !== 'active'}
      >
        <Text style={styles.entryButtonText}>
          {item.status === 'upcoming' || item.status === 'active' ? 'Enter Tournament' : 'Registration Closed'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboards</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Ionicons 
            name="trophy" 
            size={20} 
            color={activeTab === 'global' ? '#00ff88' : '#888888'} 
          />
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
            Global
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
          onPress={() => setActiveTab('tournaments')}
        >
          <Ionicons 
            name="game-controller" 
            size={20} 
            color={activeTab === 'tournaments' ? '#00ff88' : '#888888'} 
          />
          <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>
            Tournaments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff88" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'global' && (
              <View style={styles.globalTab}>
                {userRank && (
                  <View style={styles.userRankCard}>
                    <Text style={styles.userRankTitle}>Your Rank</Text>
                    <Text style={styles.userRankText}>#{userRank}</Text>
                  </View>
                )}
                
                <FlatList
                  data={globalLeaderboard}
                  renderItem={renderLeaderboardItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            
            {activeTab === 'tournaments' && (
              <View style={styles.tournamentsTab}>
                <FlatList
                  data={tournaments}
                  renderItem={renderTournamentItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2a2a2a',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
  },
  activeTabText: {
    color: '#00ff88',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 10,
  },
  globalTab: {
    paddingTop: 20,
  },
  userRankCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  userRankTitle: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 5,
  },
  userRankText: {
    color: '#00ff88',
    fontSize: 32,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888888',
    marginRight: 5,
  },
  topRankText: {
    color: '#FFD700',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  playerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 12,
    color: '#888888',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#888888',
  },
  tournamentsTab: {
    paddingTop: 20,
  },
  tournamentCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  tournamentGame: {
    fontSize: 16,
    color: '#00ff88',
    marginBottom: 8,
  },
  tournamentDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15,
    lineHeight: 20,
  },
  tournamentDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 8,
  },
  entryFeeContainer: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  entryFeeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  entryButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#444444',
  },
  entryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default LeaderboardScreen; 