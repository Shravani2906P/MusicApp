import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayerContext = createContext();

export function PlayerProvider({ children, lastTrack }) {
  const [currentTrack, setCurrentTrack] = useState(lastTrack || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);
  const trackListRef = useRef([]);

  useEffect(() => {
    if (lastTrack) setCurrentTrack(lastTrack);
  }, []);

  const playTrack = async (track, allTracks) => {
    try {
      if (!track.url) {
        alert('Preview not available for this track in your region.');
        return;
      }

      if (allTracks) trackListRef.current = allTracks;

      setIsLoading(true);

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setCurrentTrack(track);
      setProgress(0);
      setDuration(0);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis || 0);
            if (status.durationMillis) {
              setProgress(status.positionMillis / status.durationMillis);
            }
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
            }
          }
        }
      );

      soundRef.current = sound;
      await AsyncStorage.setItem('lastTrack', JSON.stringify(track));
      setIsLoading(false);
    } catch (e) {
      console.error('Playback error:', e);
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const seekTo = async (ratio) => {
    if (!soundRef.current || !duration) return;
    await soundRef.current.setPositionAsync(ratio * duration);
  };

  const playNext = () => {
    const list = trackListRef.current;
    if (!currentTrack || list.length === 0) return;
    const idx = list.findIndex(t => t.id === currentTrack.id);
    const next = list[(idx + 1) % list.length];
    playTrack(next);
  };

  const playPrevious = () => {
    const list = trackListRef.current;
    if (!currentTrack || list.length === 0) return;
    const idx = list.findIndex(t => t.id === currentTrack.id);
    const prev = list[(idx - 1 + list.length) % list.length];
    playTrack(prev);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      duration,
      isLoading,
      playTrack,
      togglePlayPause,
      seekTo,
      playNext,
      playPrevious,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);