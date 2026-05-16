import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    // Simulate network delay (mock auth)
    await new Promise(res => setTimeout(res, 1000));

    // Mock credentials check
    if (email.trim().toLowerCase() === 'demo@music.com' && password === 'password123') {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.replace('MainTabs');
    } else {
      setError('Invalid credentials. Use demo@music.com / password123');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Logo / Branding */}
        <Text style={styles.logo}>🎵</Text>
        <Text style={styles.appName}>Musify</Text>
        <Text style={styles.tagline}>Your music, your world.</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Error Message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.buttonText}>Log In</Text>
          }
        </TouchableOpacity>

        {/* Hint */}
        <Text style={styles.hint}>Demo: demo@music.com / password123</Text>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  error: {
    color: '#FF4C4C',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});