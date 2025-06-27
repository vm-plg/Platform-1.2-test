import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      if (result.success) {
        // Check if user is new or returning
        const isNewUser = authService.isNewUser(result.user);
        if (isNewUser) {
          navigation.navigate('Username');
        } else {
          navigation.navigate('MainApp');
        }
      } else {
        Alert.alert('Google Sign-In Error', result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleXSignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithX();
      if (result.success) {
        const isNewUser = authService.isNewUser(result.user);
        if (isNewUser) {
          navigation.navigate('Username');
        } else {
          navigation.navigate('MainApp');
        }
      } else {
        Alert.alert('X Sign-In Error', result.error || 'Failed to sign in with X');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with X. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    // Clear any previous errors
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in both email and password fields.');
      return;
    }

    setLoading(true);
    try {
      // First try to sign in
      let result = await authService.signInWithEmail(email.trim(), password);
      
      if (result.success) {
        // User exists and password is correct, check if they need to set username
        const isNewUser = authService.isNewUser(result.user);
        if (isNewUser) {
          navigation.navigate('Username');
        } else {
          navigation.navigate('MainApp');
        }
      } else {
        // Handle different error scenarios
        switch (result.error) {
          case 'auth/invalid-email':
            Alert.alert('Invalid Email', result.message || 'Please enter a valid email address.');
            break;
          case 'auth/wrong-password':
            Alert.alert('Incorrect Password', result.message || 'The password you entered is incorrect. Please try again.');
            break;
          case 'auth/user-not-found':
            // User doesn't exist, try to create account
            const createResult = await authService.createUserWithEmail(email.trim(), password);
            if (createResult.success) {
              // New user created successfully
              navigation.navigate('Username');
            } else {
              // Handle signup errors
              switch (createResult.error) {
                case 'auth/invalid-email':
                  Alert.alert('Invalid Email', createResult.message || 'Please enter a valid email address.');
                  break;
                case 'auth/weak-password':
                  Alert.alert('Weak Password', createResult.message || 'Password must be at least 6 characters long.');
                  break;
                case 'auth/email-already-in-use':
                  Alert.alert('Account Exists', createResult.message || 'An account with this email already exists. Please try signing in instead.');
                  break;
                default:
                  Alert.alert('Sign Up Error', createResult.message || 'Failed to create account. Please try again.');
              }
            }
            break;
          default:
            Alert.alert('Sign In Error', result.message || 'Failed to sign in. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.background}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>PL</Text>
            </View>
            <Text style={styles.logoTitle}>Planet League</Text>
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.xButton]}
              onPress={handleXSignIn}
              disabled={loading}
            >
              <Text style={styles.xButtonText}>Continue with X</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Test Account Info */}
          <View style={styles.testInfo}>
            <Text style={styles.testInfoText}>Test Account:</Text>
            <Text style={styles.testInfoText}>Email: test@example.com</Text>
            <Text style={styles.testInfoText}>Password: password123</Text>
            <Text style={styles.testInfoText}>Try wrong password: "wrongpass"</Text>
          </View>

          {/* Sign Up/Login Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEmailSignIn}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.primaryButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign Up / Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer Text */}
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  socialContainer: {
    marginBottom: 30,
  },
  socialButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  xButton: {
    backgroundColor: '#000000',
  },
  xButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#888',
    fontSize: 14,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  testInfo: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  testInfoText: {
    color: '#4A90E2',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 40,
  },
});

export default LoginScreen; 