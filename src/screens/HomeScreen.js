import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TRACKS, ARTISTS } from '../data/mockData';
import TrackCard from '../components/TrackCard';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const { playTrack, currentTrack } = usePlayer();
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);

  // Simulate fetching data
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await new Promise(res => setTimeout(res, 600));
        setTracks(TRACKS);
        setArtists(ARTISTS);
        setLoading(false);
      };
      load();
    }, [])
  );

  const handleTrackPress = (track) => {
    playTrack(track);
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
        <Text style={styles.loadingText}>Loading your music...</Text>
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

            {/* Artists Section */}
            <Text style={styles.sectionTitle}>Artists</Text>
            <FlatList
              data={artists}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.artistList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.artistCard}
                  onPress={() => handleArtistPress(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.artistImage} />
                  <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.artistGenre}>{item.genre}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Tracks Section */}
            <Text style={styles.sectionTitle}>All Tracks</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            onPress={() => handleTrackPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No tracks available.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <MiniPlayer onPress={() => navigation.navigate('Player', { track: currentTrack })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  greeting: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  logout: { color: '#888', fontSize: 14 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  artistList: { paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  artistCard: { alignItems: 'center', width: 90 },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    marginBottom: 6,
  },
  artistName: { color: '#FFF', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  artistGenre: { color: '#888', fontSize: 11, textAlign: 'center' },
  emptyText: { color: '#555', fontSize: 15 },
});