import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';
import { usernameService } from '../services/usernameService';

const UsernameScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState({
    available: false,
    error: null,
    loading: false
  });
  const [fadeAnim] = useState(new Animated.Value(0));

  // Debounced username check
  const debouncedCheck = useCallback(
    usernameService.debouncedCheckUsername,
    []
  );

  // Handle username input changes
  const handleUsernameChange = (text) => {
    setUsername(text);
    
    // Clear previous availability state
    setAvailability({ available: false, error: null, loading: false });
    
    // Trigger debounced check
    debouncedCheck(text, (result) => {
      setAvailability(result);
      
      // Animate the result
      if (result.loading === false) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  // Handle confirm button press
  const handleConfirm = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (!availability.available) {
      Alert.alert('Error', availability.error || 'Please choose a valid username');
      return;
    }

    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'User session not found');
        return;
      }

      // Call the setUsername Cloud Function
      const result = await usernameService.setUsername(username.trim(), currentUser.id);
      
      if (result.success) {
        // Update the user's username in our auth service
        await authService.updateUsername(username.trim());
        
        // Navigate to MainApp
        navigation.navigate('MainApp');
      } else {
        Alert.alert('Error', result.error || 'Failed to set username');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Reset animation when username changes
  useEffect(() => {
    fadeAnim.setValue(0);
  }, [username, fadeAnim]);

  // Render availability indicator
  const renderAvailabilityIndicator = () => {
    if (availability.loading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size="small" color="#4A90E2" />
        </View>
      );
    }

    if (username.length >= 3) {
      if (availability.available) {
        return (
          <Animated.View style={[styles.indicator, { opacity: fadeAnim }]}>
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        );
      } else if (availability.error) {
        return (
          <Animated.View style={[styles.indicator, { opacity: fadeAnim }]}>
            <Text style={styles.xmark}>✗</Text>
          </Animated.View>
        );
      }
    }

    return null;
  };

  // Render error message
  const renderErrorMessage = () => {
    if (availability.error && username.length >= 3) {
      return (
        <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>
          {availability.error}
        </Animated.Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Choose Your Username</Text>
          <Text style={styles.subtitle}>
            This will be your display name in Planet League
          </Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  availability.available && styles.inputSuccess,
                  availability.error && styles.inputError
                ]}
                placeholder="Enter username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                autoFocus
              />
              {renderAvailabilityIndicator()}
            </View>
            {renderErrorMessage()}
          </View>

          {/* Test Info */}
          <View style={styles.testInfo}>
            <Text style={styles.testInfoText}>Test usernames:</Text>
            <Text style={styles.testInfoText}>Available: "newuser", "gamer2024"</Text>
            <Text style={styles.testInfoText}>Taken: "testuser", "admin", "gamer123"</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.button,
              (!availability.available || loading) && styles.buttonDisabled
            ]}
            onPress={handleConfirm}
            disabled={!availability.available || loading}
          >
            <LinearGradient
              colors={availability.available ? ['#4A90E2', '#357ABD'] : ['#666', '#555']}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 50, // Space for indicator
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    textAlign: 'center',
  },
  inputSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  inputError: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  indicator: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  xmark: {
    color: '#F44336',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  testInfo: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    width: '100%',
  },
  testInfoText: {
    color: '#4A90E2',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
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
  buttonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
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

export default UsernameScreen; 