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
    <View style={[styles.card, isActive && styles.activeCard]}>
      {/* Main area — tap to play */}
      <TouchableOpacity
        style={styles.mainArea}
        onPress={() => {
          console.log('Track tapped:', track.title);
          if (onPress) onPress();
        }}
        activeOpacity={0.7}
      >
        <Image source={{ uri: track.cover }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>{track.artistName}</Text>
          {track.noPreview && (
            <Text style={styles.noPreview}>Preview unavailable</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Right side buttons */}
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => {
            console.log('Favorite tapped:', track.title);
            toggle(track);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.heart}>{liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {isActive && (
          <Text style={styles.playingBadge}>{isPlaying ? '▶' : '⏸'}</Text>
        )}
        <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
      </View>
    </View>
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
    backgroundColor: '#121212',
  },
  activeCard: {
    backgroundColor: '#1A2E1A',
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  activeText: {
    color: '#1DB954',
  },
  artist: {
    color: '#888',
    fontSize: 13,
    marginTop: 3,
  },
  noPreview: {
    color: '#FF4C4C',
    fontSize: 11,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  heartBtn: {
    padding: 4,
  },
  heart: {
    fontSize: 16,
  },
  playingBadge: {
    color: '#1DB954',
    fontSize: 12,
  },
  duration: {
    color: '#555',
    fontSize: 12,
  },
});