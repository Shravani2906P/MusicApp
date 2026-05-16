import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerProvider } from './src/context/PlayerContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [lastTrack, setLastTrack] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [isLoggedIn, savedTrack] = await Promise.all([
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('lastTrack'),
        ]);

        if (savedTrack) setLastTrack(JSON.parse(savedTrack));
        setInitialRoute(isLoggedIn === 'true' ? 'MainTabs' : 'Login');
      } catch {
        setInitialRoute('Login');
      }
    };
    restoreSession();
  }, []);

  // Show splash-like loader while restoring session
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <PlayerProvider lastTrack={lastTrack}>
      <FavoritesProvider>
        <AppNavigator initialRoute={initialRoute} lastTrack={lastTrack} />
      </FavoritesProvider>
    </PlayerProvider>
  );
}