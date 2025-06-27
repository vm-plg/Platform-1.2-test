import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { doc, collection, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';
import { firestoreService } from '../services/firestoreService';

const { width, height } = Dimensions.get('window');

const RECIPES = [
  // 2-element
  { elements: ['fire', 'water'], name: 'Steam Element', icon: '💨', rarity: 'Rare', successRate: 0.8 },
  { elements: ['fire', 'earth'], name: 'Lava Element', icon: '🌋', rarity: 'Rare', successRate: 0.7 },
  { elements: ['water', 'earth'], name: 'Mud Element', icon: '🌊', rarity: 'Common', successRate: 0.9 },
  { elements: ['air', 'fire'], name: 'Flame Element', icon: '🔥', rarity: 'Rare', successRate: 0.75 },
  { elements: ['lightning', 'water'], name: 'Storm Element', icon: '⛈️', rarity: 'Epic', successRate: 0.6 },
  { elements: ['ice', 'fire'], name: 'Steam Element', icon: '💨', rarity: 'Rare', successRate: 0.8 },
  { elements: ['lightning', 'earth'], name: 'Crystal Element', icon: '💎', rarity: 'Epic', successRate: 0.65 },
  { elements: ['shadow', 'light'], name: 'Balance Element', icon: '⚖️', rarity: 'Legendary', successRate: 0.4 },
  // 3-element
  { elements: ['fire', 'water', 'earth'], name: 'Life Element', icon: '🌱', rarity: 'Epic', successRate: 0.5 },
  { elements: ['air', 'fire', 'lightning'], name: 'Storm Element', icon: '🌪️', rarity: 'Epic', successRate: 0.55 },
  { elements: ['ice', 'water', 'air'], name: 'Frost Element', icon: '❄️', rarity: 'Rare', successRate: 0.7 },
  // 4-element
  { elements: ['fire', 'water', 'earth', 'air'], name: 'Primal Element', icon: '🌟', rarity: 'Legendary', successRate: 0.3 },
  { elements: ['lightning', 'ice', 'shadow', 'light'], name: 'Cosmic Element', icon: '🌌', rarity: 'Mythic', successRate: 0.2 },
];

const ELEMENT_ICONS = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  air: '💨',
  lightning: '⚡',
  ice: '❄️',
  shadow: '🌑',
  light: '✨',
};

const ForgeScreen = () => {
  const [userElements, setUserElements] = useState([]);
  const [craftingSlots, setCraftingSlots] = useState([null, null, null, null, null]);
  const [craftingPreview, setCraftingPreview] = useState(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftingResult, setCraftingResult] = useState(null);

  useEffect(() => {
    // Always load simulated elements for demo
    const unsubscribe = firestoreService.subscribeToUserElements('demo', setUserElements);
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    // Get crafting preview when slots change
    const getCraftingPreview = async () => {
      const filledSlots = craftingSlots.filter(slot => slot !== null);
      
      if (filledSlots.length === 0) {
        setCraftingPreview(null);
        return;
      }

      try {
        const elementIds = filledSlots.map(slot => slot.id);
        const result = await firestoreService.getCraftingPreview(elementIds);
        
        if (result.success) {
          setCraftingPreview(result.preview);
        } else {
          console.error('Error getting crafting preview:', result.error);
          setCraftingPreview(null);
        }
      } catch (error) {
        console.error('Error getting crafting preview:', error);
        setCraftingPreview(null);
      }
    };

    getCraftingPreview();
  }, [craftingSlots]);

  const addElementToSlot = (element, slotIndex) => {
    if (craftingSlots[slotIndex] === null) {
      const newSlots = [...craftingSlots];
      newSlots[slotIndex] = element;
      setCraftingSlots(newSlots);
      
      // Update user inventory
      const updatedElements = userElements.map(el => 
        el.id === element.id ? { ...el, count: el.count - 1 } : el
      );
      setUserElements(updatedElements);
    }
  };

  const removeElementFromSlot = (slotIndex) => {
    const element = craftingSlots[slotIndex];
    if (element) {
      const newSlots = [...craftingSlots];
      newSlots[slotIndex] = null;
      setCraftingSlots(newSlots);
      
      // Return element to inventory
      const updatedElements = userElements.map(el => 
        el.id === element.id ? { ...el, count: el.count + 1 } : el
      );
      setUserElements(updatedElements);
    }
  };

  const clearAllSlots = () => {
    const filledSlots = craftingSlots.filter(slot => slot !== null);
    const newSlots = [null, null, null, null, null];
    setCraftingSlots(newSlots);
    
    // Return all elements to inventory
    const updatedElements = [...userElements];
    filledSlots.forEach(element => {
      const elementIndex = updatedElements.findIndex(el => el.id === element.id);
      if (elementIndex !== -1) {
        updatedElements[elementIndex].count += 1;
      }
    });
    setUserElements(updatedElements);
  };

  const performCraft = async () => {
    if (!craftingPreview) return;
    
    setIsCrafting(true);
    setCraftingResult(null);
    
    try {
      const elementIds = craftingSlots.filter(slot => slot !== null).map(slot => slot.id);
      const result = await firestoreService.performCraft(elementIds);
      
      setCraftingResult({
        success: result.success,
        message: result.message,
        reward: result.reward,
      });
      
      // Clear slots after crafting
      setCraftingSlots([null, null, null, null, null]);
    } catch (error) {
      setCraftingResult({
        success: false,
        message: 'Crafting failed due to an error.',
      });
    } finally {
      setIsCrafting(false);
    }
  };

  const DraggableElement = ({ element, onDragEnd }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const gestureHandler = useAnimatedGestureHandler({
      onStart: () => {
        scale.value = withSpring(1.1);
      },
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        scale.value = withSpring(1);
        runOnJS(onDragEnd)(event.absoluteX, event.absoluteY);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.draggableElement, animatedStyle]}>
          <Text style={styles.elementIcon}>{element.icon}</Text>
          <Text style={styles.elementName}>{element.name}</Text>
          <Text style={styles.elementCount}>{element.count}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const CraftingSlot = ({ element, slotIndex, onRemove }) => {
    return (
      <View style={styles.craftingSlot}>
        {element ? (
          <TouchableOpacity
            style={styles.filledSlot}
            onPress={() => onRemove(slotIndex)}
          >
            <Text style={styles.slotElementIcon}>{element.icon}</Text>
            <Text style={styles.slotElementName}>{element.name}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptySlotText}>+</Text>
          </View>
        )}
      </View>
    );
  };

  const handleElementDragEnd = (element, absoluteX, absoluteY) => {
    // Find which slot the element was dropped on
    const slotSize = 80;
    const slotSpacing = 20;
    const startX = (width - (5 * slotSize + 4 * slotSpacing)) / 2;
    
    for (let i = 0; i < 5; i++) {
      const slotX = startX + i * (slotSize + slotSpacing);
      const slotY = height * 0.4; // Approximate Y position of crafting area
      
      if (absoluteX >= slotX && absoluteX <= slotX + slotSize &&
          absoluteY >= slotY && absoluteY <= slotY + slotSize) {
        addElementToSlot(element, i);
        break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forge</Text>
        <Text style={styles.subtitle}>Craft new elements from your collection</Text>
      </View>

      <View style={styles.mainContent}>
        {/* Inventory Panel - Right Side */}
        <View style={styles.inventoryPanel}>
          <Text style={styles.panelTitle}>Your Elements</Text>
          <ScrollView style={styles.inventoryScroll} showsVerticalScrollIndicator={false}>
            {userElements.map((element) => (
              <TouchableOpacity
                key={element.id}
                style={styles.elementCard}
                onPress={() => {
                  // Find first empty slot
                  const emptySlotIndex = craftingSlots.findIndex(slot => slot === null);
                  if (emptySlotIndex !== -1 && element.count > 0) {
                    addElementToSlot(element, emptySlotIndex);
                  }
                }}
                disabled={element.count === 0}
              >
                <Text style={styles.elementIcon}>{element.icon}</Text>
                <Text style={styles.elementName}>{element.name}</Text>
                <Text style={styles.elementCount}>{element.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Crafting Area - Center */}
        <View style={styles.craftingArea}>
          <Text style={styles.craftingTitle}>Crafting Slots</Text>
          
          <View style={styles.craftingSlots}>
            {craftingSlots.map((element, index) => (
              <CraftingSlot
                key={index}
                element={element}
                slotIndex={index}
                onRemove={removeElementFromSlot}
              />
            ))}
          </View>

          {/* Crafting Preview */}
          {craftingPreview && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewIcon}>{craftingPreview.icon}</Text>
                <Text style={styles.previewName}>{craftingPreview.name}</Text>
                <Text style={styles.previewRarity}>{craftingPreview.rarity}</Text>
                <Text style={styles.previewSuccessRate}>
                  Success Rate: {(craftingPreview.successRate * 100).toFixed(0)}%
                </Text>
                <Text style={styles.previewReward}>
                  Potential Reward: {craftingPreview.reward} $PLT
                </Text>
              </View>
            </View>
          )}

          {/* Craft Button */}
          <View style={styles.craftButtonContainer}>
            <TouchableOpacity
              style={[
                styles.craftButton,
                (!craftingPreview || isCrafting) && styles.craftButtonDisabled,
              ]}
              onPress={performCraft}
              disabled={!craftingPreview || isCrafting}
            >
              {isCrafting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.craftButtonText}>CRAFT</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllSlots}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Crafting Result */}
          {craftingResult && (
            <View style={[
              styles.resultContainer,
              craftingResult.success ? styles.successResult : styles.failureResult,
            ]}>
              <Text style={styles.resultText}>{craftingResult.message}</Text>
              {craftingResult.success && (
                <Text style={styles.rewardText}>+{craftingResult.reward} $PLT</Text>
              )}
            </View>
          )}
        </View>

        <View style={{ marginTop: 32 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Crafting Recipes</Text>
          <ScrollView style={{ maxHeight: 220 }}>
            {RECIPES.map((r, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#181818', borderRadius: 8, padding: 8 }}>
                <Text style={{ fontSize: 22, marginRight: 10 }}>{r.icon}</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold', minWidth: 120 }}>{r.name}</Text>
                <Text style={{ color: '#aaa', marginRight: 10, marginLeft: 10 }}>
                  {r.elements.map(e => ELEMENT_ICONS[e]).join(' + ')}
                </Text>
                <Text style={{ color: '#00ff88', marginRight: 10 }}>{r.rarity}</Text>
                <Text style={{ color: '#ffaa00' }}>{Math.round(r.successRate * 100)}%</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
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
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  inventoryPanel: {
    width: width * 0.3,
    backgroundColor: '#1a1a1a',
    borderRightWidth: 1,
    borderRightColor: '#333333',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    padding: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  inventoryScroll: {
    flex: 1,
    padding: 8,
  },
  draggableElement: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  elementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  elementName: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
  },
  elementCount: {
    fontSize: 10,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  craftingArea: {
    flex: 1,
    padding: 20,
  },
  craftingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  craftingSlots: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  craftingSlot: {
    width: 80,
    height: 80,
    margin: 10,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#444444',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  emptySlotText: {
    fontSize: 24,
    color: '#666666',
  },
  filledSlot: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  slotElementIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  slotElementName: {
    fontSize: 8,
    color: '#ffffff',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewContent: {
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  previewRarity: {
    fontSize: 14,
    color: '#00ff88',
    marginBottom: 8,
  },
  previewSuccessRate: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
  },
  previewReward: {
    fontSize: 14,
    color: '#ffaa00',
    fontWeight: 'bold',
  },
  craftButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  craftButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 15,
    minWidth: 120,
    alignItems: 'center',
  },
  craftButtonDisabled: {
    backgroundColor: '#666666',
  },
  craftButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successResult: {
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  failureResult: {
    backgroundColor: '#2a1a1a',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  resultText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  elementCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
});

export default ForgeScreen; 