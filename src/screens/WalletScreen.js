import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import authService from '../services/authService';

// Import Firebase functions
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';

const functions = getFunctions(app);
const firestore = getFirestore(app);

// Simulated data - replace with actual Firestore calls
const USER_DATA = {
  plt_balance: 1250.75,
  wallet_connected: false,
  wallet_address: null,
  on_chain_balance: 0,
};

// Simulated $PLT contract - replace with actual Web3 integration
const PLT_CONTRACT = {
  balanceOf: async (address) => {
    // Simulate blockchain call
    return Math.floor(Math.random() * 1000) + 100;
  },
};

const WalletScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(USER_DATA);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userDocData = userDoc.data();
          setUserData(prev => ({
            ...prev,
            plt_balance: userDocData.plt_balance || 0,
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual WalletConnect integration
      // const connector = new WalletConnect({
      //   bridge: "https://bridge.walletconnect.org",
      //   clientMeta: {
      //     name: "Planet League",
      //     description: "Gaming Platform",
      //     url: "https://planetleague.gg",
      //     icons: ["https://planetleague.gg/icon.png"]
      //   }
      // });
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      const onChainBalance = await PLT_CONTRACT.balanceOf(mockAddress);
      
      setUserData(prev => ({
        ...prev,
        wallet_connected: true,
        wallet_address: mockAddress,
        on_chain_balance: onChainBalance,
      }));
      
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setUserData(prev => ({
      ...prev,
      wallet_connected: false,
      wallet_address: null,
      on_chain_balance: 0,
    }));
    Alert.alert('Disconnected', 'Wallet disconnected successfully.');
  };

  const handleRefreshBalance = async () => {
    if (!userData.wallet_connected) return;
    
    setLoadingBalance(true);
    try {
      const onChainBalance = await PLT_CONTRACT.balanceOf(userData.wallet_address);
      setUserData(prev => ({
        ...prev,
        on_chain_balance: onChainBalance,
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh balance.');
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userData.wallet_connected) {
      Alert.alert('Error', 'Please connect your wallet first.');
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (amount > userData.plt_balance) {
      Alert.alert('Error', 'Insufficient balance for withdrawal.');
      return;
    }

    setIsWithdrawing(true);
    try {
      // Call the actual Cloud Function
      const initiateWithdrawalFunction = httpsCallable(functions, 'initiateWithdrawal');
      const result = await initiateWithdrawalFunction({
        amount,
        walletAddress: userData.wallet_address,
      });
      
      const { data } = result;
      
      if (data.success) {
        Alert.alert(
          'Withdrawal Initiated',
          `Withdrawal of ${amount} $PLT has been initiated.\nTransaction ID: ${data.transactionId}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setWithdrawalAmount('');
                // Update local balance
                setUserData(prev => ({
                  ...prev,
                  plt_balance: data.newBalance,
                }));
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Withdrawal failed. Please try again.');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert('Error', 'Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceSection}>
          <Text style={styles.balanceTitle}>Your $PLT Balance</Text>
          <Text style={styles.balanceAmount}>{userData.plt_balance.toLocaleString()}</Text>
          <Text style={styles.balanceLabel}>Planet League Tokens</Text>
        </View>

        {/* Wallet Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>External Wallet</Text>
          
          {!userData.wallet_connected ? (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="wallet" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.connectButtonText}>Connect Wallet</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.walletInfo}>
              <View style={styles.walletAddress}>
                <Text style={styles.walletLabel}>Connected Address:</Text>
                <Text style={styles.walletAddressText}>{formatAddress(userData.wallet_address)}</Text>
              </View>
              
              <View style={styles.onChainBalance}>
                <Text style={styles.onChainLabel}>On-Chain Balance:</Text>
                <View style={styles.balanceRow}>
                  <Text style={styles.onChainAmount}>{userData.on_chain_balance}</Text>
                  <Text style={styles.onChainSymbol}>$PLT</Text>
                  <TouchableOpacity onPress={handleRefreshBalance} disabled={loadingBalance}>
                    <Ionicons 
                      name="refresh" 
                      size={16} 
                      color={loadingBalance ? "#666" : "#00ff88"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnectWallet}
              >
                <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Withdrawal Section */}
        {userData.wallet_connected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Withdraw to Wallet</Text>
            
            <View style={styles.withdrawalInput}>
              <Text style={styles.inputLabel}>Amount ($PLT)</Text>
              <TextInput
                style={styles.amountInput}
                value={withdrawalAmount}
                onChangeText={setWithdrawalAmount}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.withdrawButton, !withdrawalAmount && styles.withdrawButtonDisabled]}
              onPress={handleWithdraw}
              disabled={!withdrawalAmount || isWithdrawing}
            >
              {isWithdrawing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181c24',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  balanceSection: {
    backgroundColor: '#23283a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#7ad7ff',
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#7ad7ff',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#23283a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#7ad7ff',
    fontWeight: '500',
    marginBottom: 8,
  },
  connectButton: {
    backgroundColor: '#7ad7ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#181c24',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  walletInfo: {
    gap: 12,
  },
  walletAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 14,
    color: '#ccc',
    marginRight: 8,
  },
  walletAddressText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
  },
  onChainBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onChainLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onChainAmount: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  onChainSymbol: {
    fontSize: 14,
    color: '#ccc',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#FF6B6B20',
    alignSelf: 'flex-start',
  },
  disconnectButtonText: {
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: 4,
  },
  withdrawalInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#181c24',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  withdrawButtonDisabled: {
    opacity: 0.6,
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default WalletScreen; 