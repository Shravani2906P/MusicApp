import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer({ onPress }) {
  const { currentTrack, isPlaying, isLoading, togglePlayPause } = usePlayer();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artistName}</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}
      >
        {isLoading
          ? <ActivityIndicator color="#1DB954" size="small" />
          : <Text style={styles.btnText}>{isPlaying ? '⏸' : '▶'}</Text>
        }
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 8,
    right: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#1DB954',
    fontSize: 22,
  },
});