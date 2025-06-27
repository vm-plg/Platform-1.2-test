import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const QuestsWidget = ({ quests = [], onQuestPress, onSeeAllPress }) => {
  const renderQuestItem = (quest) => {
    const progressPercentage = (quest.progress / quest.target) * 100;
    const isCompleted = quest.progress >= quest.target;

    return (
      <TouchableOpacity
        key={quest.id}
        style={styles.questItem}
        onPress={() => onQuestPress?.(quest)}
      >
        <View style={styles.questHeader}>
          <View style={styles.questIconContainer}>
            <Text style={styles.questIcon}>{quest.icon}</Text>
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDescription}>{quest.description}</Text>
          </View>
          <View style={styles.questReward}>
            <Text style={styles.rewardAmount}>{quest.reward}</Text>
            <Text style={styles.rewardLabel}>PLT</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(progressPercentage, 100)}%` },
                isCompleted && styles.progressFillCompleted,
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {quest.progress}/{quest.target}
          </Text>
        </View>

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>COMPLETED</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const displayedQuests = quests.slice(0, 3); // Show only first 3 quests

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Quests</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {displayedQuests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Active Quests</Text>
          <Text style={styles.emptyDescription}>
            Complete games to unlock new quests and earn rewards!
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.questsList}
          showsVerticalScrollIndicator={false}
        >
          {displayedQuests.map(renderQuestItem)}
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
  questsList: {
    paddingHorizontal: 20,
  },
  questItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questIcon: {
    fontSize: 20,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 12,
    color: '#cccccc',
    lineHeight: 16,
  },
  questReward: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  rewardLabel: {
    fontSize: 10,
    color: '#888888',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressFillCompleted: {
    backgroundColor: '#00ff88',
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00ff88',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
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

export default QuestsWidget; 