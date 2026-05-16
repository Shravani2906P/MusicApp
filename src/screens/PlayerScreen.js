import React, { useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../context/PlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

function formatTime(ms) {
  if (!ms) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerScreen({ navigation, route }) {
  const {
    currentTrack, isPlaying, isLoading,
    progress, duration, togglePlayPause, seekTo,
    playNext, playPrevious,
  } = usePlayer();

  const track = currentTrack || route.params?.track;

  // Save last session whenever track changes
  useEffect(() => {
    if (track) {
      AsyncStorage.setItem('lastTrack', JSON.stringify(track));
    }
  }, [track]);

  if (!track) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No track selected.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>↓</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Album Art */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: track.cover }} style={styles.artwork} />
      </View>

      {/* Track Info */}
      <View style={styles.infoRow}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Artist', {
            artist: { id: track.artistId, name: track.artistName }
          })}>
            <Text style={styles.artistName}>{track.artistName}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Slider */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333"
          thumbTintColor="#1DB954"
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(progress * duration)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>

        {/* Previous */}
        <TouchableOpacity style={styles.sideBtn} onPress={playPrevious}>
          <Text style={styles.sideBtnText}>⏮</Text>
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#000" size="large" />
            : <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
          }
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity style={styles.sideBtn} onPress={playNext}>
          <Text style={styles.sideBtnText}>⏭</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16, marginBottom: 12 },
  backLink: { color: '#1DB954', fontSize: 15 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { color: '#FFF', fontSize: 26 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  artworkContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  artwork: {
    width: width - 64,
    height: width - 64,
    borderRadius: 16,
    backgroundColor: '#333',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  trackInfo: { flex: 1 },
  trackTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  artistName: { color: '#1DB954', fontSize: 15 },

  progressContainer: { paddingHorizontal: 24, marginBottom: 16 },
  slider: { width: '100%', height: 40 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -8 },
  timeText: { color: '#888', fontSize: 12 },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginTop: 8,
  },
  sideBtn: { width: 52, height: 52, justifyContent: 'center', alignItems: 'center' },
  sideBtnText: { color: '#FFF', fontSize: 28 },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  playBtnText: { color: '#000', fontSize: 28 },
});