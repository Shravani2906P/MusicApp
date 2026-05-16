import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, toggleFavorite } from '../services/favoritesService';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const toggle = async (track) => {
    const updated = await toggleFavorite(track);
    setFavorites(updated);
  };

  const isLiked = (trackId) => favorites.some(t => t.id === trackId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isLiked }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);