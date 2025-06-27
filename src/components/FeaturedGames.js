import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const gameCardWidth = screenWidth * 0.4;
const gameCardSpacing = 12;

const FeaturedGames = ({ games = [], onGamePress, onSeeAllPress }) => {
  const renderGameCard = (game) => (
    <TouchableOpacity
      key={game.id}
      style={styles.gameCard}
      onPress={() => onGamePress?.(game)}
    >
      <LinearGradient
        colors={game.gradient || ['#2c3e50', '#34495e']}
        style={styles.gameCardGradient}
      >
        <View style={styles.gameCardContent}>
          <View style={styles.gameIconContainer}>
            <Text style={styles.gameIcon}>{game.icon}</Text>
          </View>
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
          </View>

          <View style={styles.gameStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statText}>{game.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statText}>{game.players}</Text>
            </View>
          </View>

          <View style={styles.gameReward}>
            <Text style={styles.rewardText}>{game.reward}</Text>
            <Text style={styles.rewardLabel}>PLT</Text>
          </View>

          {game.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}

          {game.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>🔥</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Games</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎮</Text>
          <Text style={styles.emptyTitle}>No Games Available</Text>
          <Text style={styles.emptyDescription}>
            Check back soon for new games!
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={gameCardWidth + gameCardSpacing}
          snapToAlignment="start"
        >
          {games.map(renderGameCard)}
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  gameCard: {
    width: gameCardWidth,
    marginRight: gameCardSpacing,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gameCardGradient: {
    padding: 16,
    minHeight: 160,
  },
  gameCardContent: {
    flex: 1,
  },
  gameIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  gameIcon: {
    fontSize: 32,
  },
  gameInfo: {
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
    marginBottom: 2,
  },
  statText: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.8,
  },
  gameReward: {
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  rewardLabel: {
    fontSize: 10,
    color: '#888888',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00ff88',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontSize: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 20,
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

export default FeaturedGames; 