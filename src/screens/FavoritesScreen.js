import React from 'react';
import {
  View, Text, FlatList,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';
import MiniPlayer from '../components/MiniPlayer';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { playTrack, currentTrack } = usePlayer();

  const handleTrackPress = (track) => {
    playTrack(track);
    navigation.navigate('Player', { track });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>❤️ Favorites</Text>
            <Text style={styles.subtitle}>
              {favorites.length === 0
                ? 'No favorites yet'
                : `${favorites.length} track${favorites.length > 1 ? 's' : ''}`}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            onPress={() => handleTrackPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the 🤍 on any track to save it here.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.browseLink}>Browse tracks →</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 140, flexGrow: 1 }}
      />

      <MiniPlayer onPress={() => navigation.navigate('Player', { track: currentTrack })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
    marginBottom: 8,
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  browseLink: { color: '#1DB954', fontSize: 15, marginTop: 20 },
});