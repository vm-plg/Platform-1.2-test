import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import leaderboardService from '../services/leaderboardService';
import TopBar from '../components/TopBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import QuestsWidget from '../components/QuestsWidget';
import LeaderboardWidget from '../components/LeaderboardWidget';
import TournamentsWidget from '../components/TournamentsWidget';

const MainHubScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const unsubscribeUser = firestoreService.subscribeToUserData(
      currentUser.id,
      (data) => {
        setUserData(data);
        setLoading(false);
      }
    );

    const unsubscribeFeatured = firestoreService.subscribeToFeaturedContent(
      (content) => {
        setFeaturedContent(content);
      }
    );

    const unsubscribeQuests = firestoreService.subscribeToUserQuests(
      currentUser.id,
      (quests) => {
        setUserQuests(quests);
      }
    );

    // Load leaderboard data
    loadLeaderboardData();
    
    // Load tournaments data
    loadTournamentsData();

    return () => {
      unsubscribeUser();
      unsubscribeFeatured();
      unsubscribeQuests();
    };
  }, []);

  const loadLeaderboardData = async () => {
    try {
      // Use the shared service for consistent data
      const topLeaderboard = leaderboardService.getTopLeaderboard();
      setLeaderboardData(topLeaderboard);
      
      // Get user rank from service
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const rank = leaderboardService.getUserRank(currentUser.uid);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
    }
  };

  const loadTournamentsData = async () => {
    try {
      // Use the shared service for consistent data
      const hubTournaments = leaderboardService.getTournamentsForHub();
      setTournaments(hubTournaments);
    } catch (error) {
      console.error('Error loading tournaments data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboardData();
    await loadTournamentsData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleFeaturedItemPress = (item) => {
    Alert.alert('Featured Content', `Selected: ${item.title}`);
  };

  const handleQuestPress = (quest) => {
    if (quest.status === 'completed') {
      Alert.alert('Quest Completed', `You've completed: ${quest.title}`);
    } else {
      Alert.alert('Quest Details', `Quest: ${quest.title}\nProgress: ${quest.progress}/${quest.target}`);
    }
  };

  const handleQuestSeeAll = () => {
    Alert.alert('Quests', 'Navigate to full quests screen');
  };

  const handleLeaderboardSeeAll = () => {
    navigation.navigate('LeaderboardScreen');
  };

  const handleTournamentPress = (tournament) => {
    if (tournament.status === 'active') {
      // Navigate to active tournament screen
      navigation.navigate('TournamentScreen', { tournamentId: tournament.id });
    } else {
      Alert.alert('Tournament', `${tournament.name} starts on ${tournament.startDate.toLocaleDateString()}`);
    }
  };

  const handleTournamentsSeeAll = () => {
    navigation.navigate('LeaderboardScreen', { initialTab: 'tournaments' });
  };

  const handleFeaturedSeeAll = () => {
    Alert.alert('Featured', 'Navigate to full featured content screen');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar 
        userData={userData} 
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00ff88"
            colors={["#00ff88"]}
          />
        }
      >
        <FeaturedCarousel
          featuredContent={featuredContent}
          onItemPress={handleFeaturedItemPress}
          onSeeAllPress={handleFeaturedSeeAll}
        />

        <QuestsWidget
          quests={userQuests}
          onQuestPress={handleQuestPress}
          onSeeAllPress={handleQuestSeeAll}
        />

        <LeaderboardWidget
          leaderboardData={leaderboardData}
          userRank={userRank}
          onSeeAllPress={handleLeaderboardSeeAll}
        />

        <TournamentsWidget
          tournaments={tournaments}
          onTournamentPress={handleTournamentPress}
          onSeeAllPress={handleTournamentsSeeAll}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
});

export default MainHubScreen; 