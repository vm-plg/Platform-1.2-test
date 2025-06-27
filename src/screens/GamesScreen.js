import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const GamesScreen = () => {
  const games = [
    {
      id: 1,
      name: 'Space Runner',
      description: 'Navigate through asteroid fields and collect cosmic rewards',
      icon: '🚀',
      status: 'Available',
      reward: '50 PLT',
    },
    {
      id: 2,
      name: 'Planet Defender',
      description: 'Protect your homeworld from alien invaders',
      icon: '🛡️',
      status: 'Available',
      reward: '75 PLT',
    },
    {
      id: 3,
      name: 'Stellar Puzzle',
      description: 'Solve cosmic puzzles to unlock rare stickers',
      icon: '🧩',
      status: 'Coming Soon',
      reward: '100 PLT',
    },
    {
      id: 4,
      name: 'Galaxy Racing',
      description: 'Race through nebulas and wormholes',
      icon: '🏎️',
      status: 'Coming Soon',
      reward: '60 PLT',
    },
  ];

  const renderGameCard = (game) => (
    <TouchableOpacity
      key={game.id}
      style={[
        styles.gameCard,
        game.status === 'Coming Soon' && styles.comingSoonCard,
      ]}
      disabled={game.status === 'Coming Soon'}
    >
      <View style={styles.gameHeader}>
        <Text style={styles.gameIcon}>{game.icon}</Text>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{game.name}</Text>
          <Text style={styles.gameStatus}>{game.status}</Text>
        </View>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>{game.reward}</Text>
        </View>
      </View>
      <Text style={styles.gameDescription}>{game.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <Text style={styles.subtitle}>Choose your adventure</Text>
      </View>
      
      <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
        {games.map(renderGameCard)}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  gamesList: {
    flex: 1,
    padding: 20,
  },
  gameCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  comingSoonCard: {
    opacity: 0.6,
    borderColor: '#666666',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  gameStatus: {
    fontSize: 14,
    color: '#00ff88',
  },
  rewardContainer: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  gameDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
});

export default GamesScreen; 