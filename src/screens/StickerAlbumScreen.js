import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Use emoji placeholders for stickers and crowns
const GENERIC_STICKER = '🪐';
const GENERIC_CROWN = '👑';

// Simulated global sticker definitions for the current season
const STICKERS = Array.from({ length: 15 }, (_, i) => ({
  id: `s${i + 1}`,
  name: `Sticker ${i + 1}`,
  rarity: ['Common', 'Uncommon', 'Rare', 'Epic'][i % 4],
  season: 1,
}));

// Simulated user's owned stickers
const USER_STICKERS = {
  's1': 2, // Owned 2 copies
  's3': 1, // Owned 1 copy
  's5': 3, // Owned 3 copies
  's7': 1, // Owned 1 copy
};

const StickerAlbumScreen = () => {
  const [stickers, setStickers] = useState(STICKERS);
  const [userStickers, setUserStickers] = useState(USER_STICKERS);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(stickers.length / itemsPerPage);

  useEffect(() => {
    // TODO: Fetch stickers from Firestore
    // TODO: Fetch user's owned stickers from Firestore
  }, []);

  const isOwned = (stickerId) => {
    return userStickers[stickerId] && userStickers[stickerId] > 0;
  };

  const getOwnedCount = (stickerId) => {
    return userStickers[stickerId] || 0;
  };

  const handleStickerPress = (sticker) => {
    setSelectedSticker(sticker);
    setModalVisible(true);
  };

  const handleListOnMarketplace = () => {
    if (selectedSticker && getOwnedCount(selectedSticker.id) > 1) {
      Alert.alert(
        'List on Marketplace',
        `List ${selectedSticker.name} on the marketplace?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'List', onPress: () => {
            // TODO: Call Cloud Function to list sticker
            Alert.alert('Success', 'Sticker listed on marketplace!');
            setModalVisible(false);
          }},
        ]
      );
    }
  };

  const renderSticker = ({ item }) => {
    const owned = isOwned(item.id);
    const count = getOwnedCount(item.id);

    return (
      <TouchableOpacity
        style={styles.stickerCard}
        onPress={() => handleStickerPress(item)}
      >
        <View style={styles.stickerImageContainer}>
          <View style={[
            styles.stickerImage,
            owned ? styles.stickerOwned : styles.stickerSilhouette
          ]}>
            <Text style={styles.stickerText}>
              {owned ? item.name.charAt(0) : '?'}
            </Text>
          </View>
          {count > 1 && (
            <View style={styles.crownContainer}>
              <View style={styles.crown}>
                <Text style={styles.crownText}>👑</Text>
              </View>
            </View>
          )}
        </View>
        <Text style={styles.stickerName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.stickerRarity}>{item.rarity}</Text>
      </TouchableOpacity>
    );
  };

  const renderPageIndicator = () => {
    return (
      <View style={styles.pageIndicator}>
        {Array.from({ length: totalPages }, (_, i) => (
          <View
            key={i}
            style={[
              styles.pageDot,
              i === currentPage && styles.pageDotActive
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sticker Album</Text>
      <Text style={styles.subtitle}>Season 1 Collection</Text>
      
      <FlatList
        data={stickers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)}
        renderItem={renderSticker}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.stickerRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stickerGrid}
      />

      {renderPageIndicator()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSticker && (
              <>
                <View style={styles.modalStickerContainer}>
                  <View style={[
                    styles.modalStickerImage,
                    isOwned(selectedSticker.id) ? styles.stickerOwned : styles.stickerSilhouette
                  ]}>
                    <Text style={styles.modalStickerText}>
                      {isOwned(selectedSticker.id) ? selectedSticker.name.charAt(0) : '?'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalStickerName}>{selectedSticker.name}</Text>
                <Text style={styles.modalStickerRarity}>{selectedSticker.rarity}</Text>
                <Text style={styles.modalStickerCount}>
                  Owned: {getOwnedCount(selectedSticker.id)}
                </Text>
                
                {getOwnedCount(selectedSticker.id) > 1 && (
                  <TouchableOpacity
                    style={styles.listButton}
                    onPress={handleListOnMarketplace}
                  >
                    <Text style={styles.listButtonText}>List on Marketplace</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181c24',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7ad7ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  stickerGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stickerRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  stickerCard: {
    width: (width - 60) / 3,
    backgroundColor: '#23283a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  stickerImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  stickerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerOwned: {
    backgroundColor: '#4CAF50',
  },
  stickerSilhouette: {
    backgroundColor: '#666',
  },
  stickerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  crownContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  crown: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownText: {
    fontSize: 12,
  },
  stickerName: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  stickerRarity: {
    fontSize: 10,
    color: '#7ad7ff',
    textAlign: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 4,
  },
  pageDotActive: {
    backgroundColor: '#7ad7ff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23283a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  modalStickerContainer: {
    marginBottom: 16,
  },
  modalStickerImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStickerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalStickerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalStickerRarity: {
    fontSize: 16,
    color: '#7ad7ff',
    marginBottom: 8,
  },
  modalStickerCount: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  listButton: {
    backgroundColor: '#7ad7ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  listButtonText: {
    color: '#181c24',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StickerAlbumScreen; 