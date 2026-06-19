import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('quickbite_wishlist');
    if (savedWishlist) {
      try {
        return JSON.parse(savedWishlist);
      } catch (e) {
        localStorage.removeItem('quickbite_wishlist');
      }
    }
    return [];
  });

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem('quickbite_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (item) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((i) => i._id === item._id);
      if (exists) {
        // Remove
        return prevItems.filter((i) => i._id !== item._id);
      } else {
        // Add
        return [...prevItems, item];
      }
    });
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some((item) => item._id === itemId);
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prevItems) => prevItems.filter((i) => i._id !== itemId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
