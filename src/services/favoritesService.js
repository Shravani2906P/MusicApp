import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites';

export async function getFavorites() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(track) {
  try {
    const current = await getFavorites();
    const exists = current.find(t => t.id === track.id);
    const updated = exists
      ? current.filter(t => t.id !== track.id)
      : [...current, track];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function isFavorite(trackId) {
  const favs = await getFavorites();
  return favs.some(t => t.id === trackId);
}