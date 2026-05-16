import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, ActivityIndicator,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TrackCard from '../components/TrackCard';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import { searchTracks, loadHomeTracks } from '../services/deezerService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEATURED_ARTISTS = [
  { id: 'dz_artist_13', name: 'Arijit Singh', deezerArtistId: 13579 },
  { id: 'dz_artist_2', name: 'AR Rahman', deezerArtistId: 64775 },
  { id: 'dz_artist_3', name: 'Shreya Ghoshal', deezerArtistId: 1059870 },
  { id: 'dz_artist_4', name: 'Pritam', deezerArtistId: 1282440 },
];

const DEFAULT_QUERY = 'bollywood hits 2024';

export default function HomeScreen({ navigation }) {
  const { playTrack, currentTrack } = usePlayer();
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const loadDefault = async () => {
    try {
      setLoading(true);
      setError('');
      const results = await loadHomeTracks();
      if (results.length === 0) throw new Error('No tracks found.');
      setTracks(results);
    } catch (e) {
      setError('Could not load tracks. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadDefault(); }, []));

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      setSearching(true);
      setError('');
      const results = await searchTracks(search.trim());
      if (results.length === 0) setError('No results found.');
      setTracks(results);
    } catch {
      setError('Search failed. Try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleTrackPress = (track) => {
    playTrack(track, tracks);
    navigation.navigate('Player', { track });
  };

  const handleArtistPress = (artist) => {
    navigation.navigate('Artist', { artist });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading Bollywood hits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Good vibes 🎵</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logout}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search songs, artists..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearch}
                disabled={searching}
              >
                {searching
                  ? <ActivityIndicator color="#000" size="small" />
                  : <Text style={styles.searchBtnText}>Search</Text>
                }
              </TouchableOpacity>
            </View>

            {/* Featured Artists */}
            <Text style={styles.sectionTitle}>Featured Artists</Text>
            <FlatList
              data={FEATURED_ARTISTS}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.artistList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.artistCard}
                  onPress={() => handleArtistPress(item)}
                >
                  <View style={styles.artistImagePlaceholder}>
                    <Text style={styles.artistInitial}>
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Tracks Header */}
            <Text style={styles.sectionTitle}>
              {search.trim() ? `Results for "${search}"` : '🔥 Bollywood Hits'}
            </Text>

            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadDefault}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            onPress={() => handleTrackPress(item)}
          />
        )}
        ListEmptyComponent={
          !error ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No tracks found.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <MiniPlayer onPress={() => navigation.navigate('Player', { track: currentTrack })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 24 },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  greeting: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  logout: { color: '#888', fontSize: 14 },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  artistList: { paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  artistCard: { alignItems: 'center', width: 80 },
  artistImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  artistInitial: { color: '#000', fontSize: 28, fontWeight: 'bold' },
  artistName: { color: '#FFF', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  errorContainer: { alignItems: 'center', padding: 16 },
  errorText: { color: '#FF4C4C', fontSize: 14, marginBottom: 8 },
  retryText: { color: '#1DB954', fontSize: 14 },
  emptyText: { color: '#555', fontSize: 15 },
});