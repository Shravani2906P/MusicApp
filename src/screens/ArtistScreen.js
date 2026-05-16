import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import TrackCard from '../components/TrackCard';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import { getArtist, getArtistTracks } from '../services/deezerService';

const { width } = Dimensions.get('window');

export default function ArtistScreen({ navigation, route }) {
  const { playTrack, currentTrack } = usePlayer();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const incoming = route.params?.artist;
        if (!incoming) throw new Error('No artist provided.');

        if (incoming.deezerArtistId) {
          const [artistData, artistTracks] = await Promise.all([
            getArtist(incoming.deezerArtistId),
            getArtistTracks(incoming.deezerArtistId),
          ]);
          setArtist(artistData);
          setTracks(artistTracks);
        } else {
          // Fallback for artists without deezer ID
          setArtist(incoming);
          setTracks([]);
        }
      } catch (e) {
        setError('Could not load artist. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [route.params?.artist]);

  const handleTrackPress = (track) => {
    playTrack(track, tracks);
    navigation.navigate('Player', { track });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading artist...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Go Back</Text>
        </TouchableOpacity>
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
            <View style={styles.heroContainer}>
              {artist?.image
                ? <Image source={{ uri: artist.image }} style={styles.heroImage} />
                : <View style={[styles.heroImage, styles.heroPlaceholder]}>
                    <Text style={styles.heroInitial}>{artist?.name?.charAt(0)}</Text>
                  </View>
              }
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <View style={styles.heroOverlay}>
                <Text style={styles.artistName}>{artist?.name}</Text>
                <Text style={styles.followers}>{artist?.followers} fans</Text>
              </View>
            </View>

            {artist?.bio ? (
              <View style={styles.bioContainer}>
                <Text style={styles.bioTitle}>About</Text>
                <Text style={styles.bioText}>{artist.bio}</Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>
              Top Tracks {tracks.length > 0 ? `(${tracks.length})` : ''}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TrackCard track={item} onPress={() => handleTrackPress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tracks found for this artist.</Text>
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
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { color: '#888', marginTop: 12, fontSize: 14 },
  errorText: { color: '#FF4C4C', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  backLink: { color: '#1DB954', fontSize: 15 },
  heroContainer: { width, height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%', backgroundColor: '#333' },
  heroPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1DB954' },
  heroInitial: { fontSize: 80, fontWeight: 'bold', color: '#000' },
  backBtn: {
    position: 'absolute', top: 52, left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  backText: { color: '#FFF', fontSize: 20 },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', padding: 16,
  },
  artistName: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  followers: { color: '#AAA', fontSize: 13, marginTop: 4 },
  bioContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  bioTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  bioText: { color: '#AAA', fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 16, paddingVertical: 12 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#555', fontSize: 15 },
});