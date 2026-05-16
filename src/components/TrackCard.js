import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrackCard({ track, onPress }) {
  const { currentTrack, isPlaying } = usePlayer();
  const { toggle, isLiked } = useFavorites();
  const isActive = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]} onPress={onPress}>
      <Image source={{ uri: track.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artistName}</Text>
      </View>
      <View style={styles.right}>
        {/* Favorite button */}
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); toggle(track); }}
          style={styles.heartBtn}
        >
          <Text style={[styles.heart, liked && styles.heartActive]}>
            {liked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        {isActive && (
          <Text style={styles.playingBadge}>{isPlaying ? '▶' : '⏸'}</Text>
        )}
        <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  activeCard: { backgroundColor: '#1A2E1A' },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  info: { flex: 1, marginLeft: 12 },
  title: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  activeText: { color: '#1DB954' },
  artist: { color: '#888', fontSize: 13, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 4 },
  heartBtn: { padding: 4 },
  heart: { fontSize: 16 },
  heartActive: {},
  playingBadge: { color: '#1DB954', fontSize: 12 },
  duration: { color: '#555', fontSize: 12 },
});