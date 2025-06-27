import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Planet League!</Text>
          <Text style={styles.subtitle}>
            Your journey to becoming a gaming legend starts here.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featureText}>🎮 Play hundreds of fun games</Text>
            <Text style={styles.featureText}>💎 Earn Elements and Stickers</Text>
            <Text style={styles.featureText}>⚒️ Craft crypto tokens</Text>
            <Text style={styles.featureText}>🏪 Trade with other players</Text>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MainApp')}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Your Adventure</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default OnboardingScreen; 