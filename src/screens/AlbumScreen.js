import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const AlbumScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];

  const stickers = [
    {
      id: 1,
      name: 'Cosmic Explorer',
      category: 'Common',
      rarity: 'Common',
      icon: '👨‍🚀',
      collected: true,
      count: 3,
    },
    {
      id: 2,
      name: 'Nebula Guardian',
      category: 'Rare',
      rarity: 'Rare',
      icon: '🛡️',
      collected: true,
      count: 1,
    },
    {
      id: 3,
      name: 'Stellar Dragon',
      category: 'Epic',
      rarity: 'Epic',
      icon: '🐉',
      collected: false,
      count: 0,
    },
    {
      id: 4,
      name: 'Galaxy Emperor',
      category: 'Legendary',
      rarity: 'Legendary',
      icon: '👑',
      collected: false,
      count: 0,
    },
    {
      id: 5,
      name: 'Space Pirate',
      category: 'Common',
      rarity: 'Common',
      icon: '🏴‍☠️',
      collected: true,
      count: 2,
    },
    {
      id: 6,
      name: 'Quantum Wizard',
      category: 'Rare',
      rarity: 'Rare',
      icon: '🧙‍♂️',
      collected: false,
      count: 0,
    },
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common':
        return '#888888';
      case 'Rare':
        return '#0088ff';
      case 'Epic':
        return '#aa00ff';
      case 'Legendary':
        return '#ffaa00';
      default:
        return '#888888';
    }
  };

  const filteredStickers = selectedCategory === 'All' 
    ? stickers 
    : stickers.filter(sticker => sticker.category === selectedCategory);

  const renderStickerCard = (sticker) => (
    <TouchableOpacity
      key={sticker.id}
      style={[
        styles.stickerCard,
        !sticker.collected && styles.uncollectedCard,
      ]}
    >
      <View style={styles.stickerHeader}>
        <Text style={styles.stickerIcon}>{sticker.icon}</Text>
        <View style={styles.stickerInfo}>
          <Text style={styles.stickerName}>{sticker.name}</Text>
          <Text 
            style={[
              styles.stickerRarity,
              { color: getRarityColor(sticker.rarity) }
            ]}
          >
            {sticker.rarity}
          </Text>
        </View>
        {sticker.collected && (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>x{sticker.count}</Text>
          </View>
        )}
      </View>
      {!sticker.collected && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Album</Text>
        <Text style={styles.subtitle}>Your sticker collection</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Collected</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.stickersList} showsVerticalScrollIndicator={false}>
        <View style={styles.stickersGrid}>
          {filteredStickers.map(renderStickerCard)}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#333333',
  },
  selectedCategory: {
    backgroundColor: '#00ff88',
  },
  categoryText: {
    fontSize: 14,
    color: '#ffffff',
  },
  selectedCategoryText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  stickersList: {
    flex: 1,
    padding: 20,
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stickerCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
    position: 'relative',
  },
  uncollectedCard: {
    opacity: 0.5,
    borderColor: '#666666',
  },
  stickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  stickerInfo: {
    flex: 1,
  },
  stickerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  stickerRarity: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  countContainer: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 24,
  },
});

export default AlbumScreen; 