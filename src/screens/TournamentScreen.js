import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import leaderboardService from '../services/leaderboardService';
import authService from '../services/authService';

const TournamentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tournamentId } = route.params;
  
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userParticipant, setUserParticipant] = useState(null);

  useEffect(() => {
    loadTournamentData();
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      
      // Get tournament details
      const tournamentData = leaderboardService.getTournamentById(tournamentId);
      setTournament(tournamentData);

      // Simulate participants data
      const mockParticipants = generateMockParticipants(tournamentData);
      setParticipants(mockParticipants);

      // Simulate matches data
      const mockMatches = generateMockMatches(tournamentData, mockParticipants);
      setMatches(mockMatches);

      // Check if current user is a participant
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const user = mockParticipants.find(p => p.userId === currentUser.uid);
        setUserParticipant(user);
      }

    } catch (error) {
      console.error('Error loading tournament data:', error);
      Alert.alert('Error', 'Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockParticipants = (tournament) => {
    const participantNames = [
      'ProGamer123', 'SpaceWarrior', 'GalacticHero', 'CosmicExplorer',
      'NebulaGuardian', 'QuantumWizard', 'StellarDragon', 'MeteorMiner',
      'AlienBotanist', 'RocketPup', 'AstroCat', 'CosmicRacer',
      'NebulaPilot', 'StellarKnight', 'QuantumMage', 'SpaceDefender'
    ];

    const currentUser = authService.getCurrentUser();
    const participants = [];

    for (let i = 0; i < tournament.currentParticipants; i++) {
      const isCurrentUser = currentUser && i === 0; // Make current user first participant
      participants.push({
        id: `p${i + 1}`,
        userId: isCurrentUser ? currentUser.uid : `user${i + 1}`,
        username: isCurrentUser ? (currentUser.displayName || 'You') : participantNames[i],
        profileIcon: ['👑', '🚀', '⭐', '🌌', '🛡️', '🔮', '🐉', '⛏️', '🌱', '🐕', '🐱', '🏎️', '✈️', '⚔️', '🧙‍♂️', '🛸'][i],
        level: Math.floor(Math.random() * 20) + 5,
        winRate: Math.floor(Math.random() * 40) + 40,
        gamesPlayed: Math.floor(Math.random() * 100) + 50,
        status: 'active', // active, eliminated, winner
        seed: i + 1,
        isCurrentUser
      });
    }

    return participants;
  };

  const generateMockMatches = (tournament, participants) => {
    const matches = [];
    const rounds = Math.ceil(Math.log2(participants.length));
    
    for (let round = 1; round <= rounds; round++) {
      const roundMatches = [];
      const matchesInRound = Math.ceil(participants.length / Math.pow(2, round));
      
      for (let match = 1; match <= matchesInRound; match++) {
        const matchId = `r${round}m${match}`;
        const player1Index = (match - 1) * 2;
        const player2Index = player1Index + 1;
        
        const player1 = participants[player1Index];
        const player2 = participants[player2Index];
        
        if (player1 && player2) {
          // Simulate match result based on player stats
          const player1Score = player1.level * 10 + player1.winRate;
          const player2Score = player2.level * 10 + player2.winRate;
          const winner = player1Score > player2Score ? player1 : player2;
          
          roundMatches.push({
            id: matchId,
            round,
            player1,
            player2,
            winner,
            status: round === 1 ? 'completed' : 'upcoming', // First round completed, others upcoming
            player1Score: round === 1 ? Math.floor(Math.random() * 100) + 50 : null,
            player2Score: round === 1 ? Math.floor(Math.random() * 100) + 50 : null,
            startTime: round === 1 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : null,
            duration: round === 1 ? Math.floor(Math.random() * 10) + 5 : null
          });
        }
      }
      
      matches.push({
        round,
        matches: roundMatches,
        title: round === 1 ? 'Round 1' : round === 2 ? 'Quarter Finals' : round === 3 ? 'Semi Finals' : 'Finals'
      });
    }
    
    return matches;
  };

  const renderParticipant = (participant, index) => (
    <View key={participant.id} style={styles.participantItem}>
      <View style={styles.participantRank}>
        <Text style={styles.rankText}>#{participant.seed}</Text>
      </View>
      
      <View style={styles.participantInfo}>
        <Text style={styles.participantIcon}>{participant.profileIcon}</Text>
        <View style={styles.participantDetails}>
          <Text style={[
            styles.participantName,
            participant.isCurrentUser && styles.currentUserText
          ]}>
            {participant.username} {participant.isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.participantStats}>
            Level {participant.level} • {participant.winRate}% win rate
          </Text>
        </View>
      </View>
      
      <View style={styles.participantStatus}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: participant.status === 'active' ? '#00ff88' : '#ff4444' }
        ]}>
          <Text style={styles.statusText}>{participant.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  const renderMatch = (match) => (
    <View key={match.id} style={styles.matchItem}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>Match #{match.id}</Text>
        <View style={[
          styles.matchStatus,
          { backgroundColor: match.status === 'completed' ? '#00ff88' : '#ffaa00' }
        ]}>
          <Text style={styles.matchStatusText}>{match.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.matchPlayers}>
        <View style={[
          styles.playerCard,
          match.winner?.id === match.player1?.id && styles.winnerCard
        ]}>
          <Text style={styles.playerIcon}>{match.player1?.profileIcon}</Text>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{match.player1?.username}</Text>
            <Text style={styles.playerLevel}>Level {match.player1?.level}</Text>
          </View>
          {match.player1Score !== null && (
            <Text style={styles.playerScore}>{match.player1Score}</Text>
          )}
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        <View style={[
          styles.playerCard,
          match.winner?.id === match.player2?.id && styles.winnerCard
        ]}>
          <Text style={styles.playerIcon}>{match.player2?.profileIcon}</Text>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{match.player2?.username}</Text>
            <Text style={styles.playerLevel}>Level {match.player2?.level}</Text>
          </View>
          {match.player2Score !== null && (
            <Text style={styles.playerScore}>{match.player2Score}</Text>
          )}
        </View>
      </View>
      
      {match.status === 'completed' && (
        <View style={styles.matchDetails}>
          <Text style={styles.matchDetailText}>
            Winner: {match.winner?.username} • Duration: {match.duration} min
          </Text>
        </View>
      )}
    </View>
  );

  const renderRound = (round) => (
    <View key={round.round} style={styles.roundContainer}>
      <Text style={styles.roundTitle}>{round.title}</Text>
      {round.matches.map(renderMatch)}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
        <Text style={styles.loadingText}>Loading tournament...</Text>
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tournament not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournament</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tournament Info */}
        <View style={styles.tournamentInfo}>
          <View style={styles.tournamentHeader}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <View style={styles.tournamentTitleContainer}>
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <Text style={styles.tournamentGame}>{tournament.game}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: tournament.status === 'active' ? '#00ff88' : '#ffaa00' }
            ]}>
              <Text style={styles.statusText}>{tournament.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.tournamentDescription}>{tournament.description}</Text>
          
          <View style={styles.tournamentStats}>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text style={styles.statText}>{tournament.prizePool.toLocaleString()} $PLT</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color="#00ff88" />
              <Text style={styles.statText}>{participants.length}/{tournament.maxParticipants}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={20} color="#ffaa00" />
              <Text style={styles.statText}>
                {tournament.startDate.toLocaleDateString()} - {tournament.endDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* User Status */}
        {userParticipant && (
          <View style={styles.userStatusCard}>
            <Text style={styles.userStatusTitle}>Your Status</Text>
            <View style={styles.userStatusContent}>
              <Text style={styles.userStatusIcon}>{userParticipant.profileIcon}</Text>
              <View style={styles.userStatusInfo}>
                <Text style={styles.userStatusName}>{userParticipant.username}</Text>
                <Text style={styles.userStatusDetails}>
                  Seed #{userParticipant.seed} • Level {userParticipant.level}
                </Text>
              </View>
              <View style={[
                styles.userStatusBadge,
                { backgroundColor: userParticipant.status === 'active' ? '#00ff88' : '#ff4444' }
              ]}>
                <Text style={styles.userStatusText}>{userParticipant.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Participants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
          <View style={styles.participantsList}>
            {participants.map(renderParticipant)}
          </View>
        </View>

        {/* Tournament Bracket */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Bracket</Text>
          <View style={styles.bracketContainer}>
            {matches.map(renderRound)}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginLeft: -40,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
  },
  tournamentInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  tournamentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tournamentGame: {
    fontSize: 16,
    color: '#00ff88',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  tournamentDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 16,
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
  userStatusCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  userStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  userStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  userStatusInfo: {
    flex: 1,
  },
  userStatusName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  userStatusDetails: {
    fontSize: 12,
    color: '#888888',
  },
  userStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  userStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  participantsList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  participantRank: {
    width: 40,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888888',
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  participantIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  currentUserText: {
    color: '#00ff88',
  },
  participantStats: {
    fontSize: 12,
    color: '#888888',
  },
  participantStatus: {
    marginLeft: 12,
  },
  bracketContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  roundContainer: {
    marginBottom: 24,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  matchItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444444',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  matchStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  matchPlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
  },
  winnerCard: {
    backgroundColor: '#00ff88',
  },
  playerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  playerLevel: {
    fontSize: 12,
    color: '#888888',
  },
  playerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  vsContainer: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  matchDetails: {
    borderTopWidth: 1,
    borderTopColor: '#444444',
    paddingTop: 8,
  },
  matchDetailText: {
    fontSize: 12,
    color: '#888888',
  },
  backButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TournamentScreen; 