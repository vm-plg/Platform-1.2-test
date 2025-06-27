import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TournamentsWidget = ({ tournaments = [], onTournamentPress, onSeeAllPress }) => {
  const renderTournamentItem = (tournament) => {
    const isActive = tournament.status === 'active';
    const isUpcoming = tournament.status === 'upcoming';

    return (
      <TouchableOpacity
        key={tournament.id}
        style={styles.tournamentCard}
        onPress={() => onTournamentPress?.(tournament)}
      >
        <View style={styles.tournamentHeader}>
          <View style={styles.tournamentIconContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isActive ? '#00ff88' : isUpcoming ? '#ffaa00' : '#888888' }
          ]}>
            <Text style={styles.statusText}>{tournament.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.tournamentName}>{tournament.name}</Text>
        <Text style={styles.tournamentGame}>{tournament.game}</Text>

        <View style={styles.tournamentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{tournament.prizePool.toLocaleString()} $PLT</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people" size={16} color="#00ff88" />
            <Text style={styles.detailText}>
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </Text>
          </View>
        </View>

        {tournament.entryFee > 0 && (
          <View style={styles.entryFeeContainer}>
            <Text style={styles.entryFeeText}>Entry: {tournament.entryFee} $PLT</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const displayedTournaments = tournaments.slice(0, 3); // Show only first 3 tournaments

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Tournaments</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {displayedTournaments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyTitle}>No Active Tournaments</Text>
          <Text style={styles.emptyDescription}>
            Check back soon for exciting tournament opportunities!
          </Text>
        </View>
      ) : (
        <ScrollView 
          horizontal
          style={styles.tournamentsList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tournamentsContent}
        >
          {displayedTournaments.map(renderTournamentItem)}
        </ScrollView>
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
  tournamentsList: {
    paddingLeft: 20,
  },
  tournamentsContent: {
    paddingRight: 20,
  },
  tournamentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 280,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
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
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  tournamentGame: {
    fontSize: 14,
    color: '#00ff88',
    marginBottom: 12,
  },
  tournamentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#cccccc',
    marginLeft: 8,
  },
  entryFeeContainer: {
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  entryFeeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TournamentsWidget; 