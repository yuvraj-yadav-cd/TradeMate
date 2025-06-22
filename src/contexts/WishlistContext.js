import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlistItems');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const saveWishlist = async (items) => {
    try {
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(items));
      setWishlistItems(items);
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const addToWishlist = async (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (!isInWishlist) {
      const newWishlist = [...wishlistItems, product];
      await saveWishlist(newWishlist);
    }
  };

  const removeFromWishlist = async (productId) => {
    const newWishlist = wishlistItems.filter(item => item.id !== productId);
    await saveWishlist(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);