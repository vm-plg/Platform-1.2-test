import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, FlatList, Dimensions } from 'react-native';

// Simulated store items data
const STORE_ITEMS = [
  // Featured
  { id: 'f1', tab: 'Featured', name: 'Starter Element Pack', contents: '10 Random Elements', price: 50 },
  { id: 'f2', tab: 'Featured', name: 'Sticker Mega Pack', contents: '5 Random Stickers', price: 120 },
  // Element Packs
  { id: 'e1', tab: 'Element Packs', name: 'Small Element Pack', contents: '5 Elements', price: 25 },
  { id: 'e2', tab: 'Element Packs', name: 'Large Element Pack', contents: '20 Elements', price: 90 },
  // Sticker Packs
  { id: 's1', tab: 'Sticker Packs', name: 'Sticker Duo', contents: '2 Stickers', price: 40 },
  { id: 's2', tab: 'Sticker Packs', name: 'Sticker Collector', contents: '10 Stickers', price: 180 },
];

const TABS = ['Featured', 'Element Packs', 'Sticker Packs'];
const { width } = Dimensions.get('window');

const StoreScreen = () => {
  const [activeTab, setActiveTab] = useState('Featured');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: true/false, message: string }
  const [userBalance, setUserBalance] = useState(200); // Simulated user balance

  const items = STORE_ITEMS.filter(item => item.tab === activeTab);

  const handleBuy = async () => {
    setLoading(true);
    setResult(null);
    // Simulate Cloud Function call
    setTimeout(() => {
      if (userBalance >= selectedItem.price) {
        setUserBalance(userBalance - selectedItem.price);
        setResult({ success: true, message: 'Purchase successful!' });
      } else {
        setResult({ success: false, message: 'Insufficient $PLT balance.' });
      }
      setLoading(false);
    }, 1200);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemContents}>{item.contents}</Text>
      <Text style={styles.itemPrice}>{item.price} $PLT</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
          setResult(null);
        }}
      >
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store</Text>
      <View style={styles.balanceBar}>
        <Text style={styles.balanceText}>Balance: {userBalance} $PLT</Text>
      </View>
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        numColumns={width > 600 ? 2 : 1}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedItem && !loading && !result && (
              <>
                <Text style={styles.modalTitle}>Confirm Purchase</Text>
                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                <Text style={styles.modalItemContents}>{selectedItem.contents}</Text>
                <Text style={styles.modalItemPrice}>{selectedItem.price} $PLT</Text>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#222' }]}
                    onPress={handleBuy}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#eee' }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: '#222' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {loading && <ActivityIndicator size="large" color="#222" style={{ marginVertical: 24 }} />}
            {result && (
              <>
                <Text style={[styles.resultText, { color: result.success ? '#1abc9c' : '#e74c3c' }]}>{result.message}</Text>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#222', marginTop: 18 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    fontFamily: 'System',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  balanceBar: {
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  balanceText: {
    fontSize: 16,
    color: '#1abc9c',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f0f1f3',
    borderRadius: 10,
    padding: 4,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#222',
  },
  list: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    margin: 12,
    width: width > 600 ? 320 : 320,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  itemContents: {
    fontSize: 15,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    color: '#1abc9c',
    fontWeight: '600',
    marginBottom: 18,
  },
  buyButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    width: 340,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalItemContents: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalItemPrice: {
    fontSize: 16,
    color: '#1abc9c',
    fontWeight: '600',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 6,
    marginTop: 0,
    marginBottom: 0,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 18,
    textAlign: 'center',
  },
});

export default StoreScreen; 