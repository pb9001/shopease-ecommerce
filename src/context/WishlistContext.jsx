import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isLoggedIn, currentUser } = useAuth();

  const [wishlistItems, setWishlistItems] =
    useState([]);

  // Load wishlist for the logged-in account
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email) {
      setWishlistItems([]);
      return;
    }

    const wishlistKey =
      `shopease_wishlist_${currentUser.email.toLowerCase()}`;

    const savedWishlist =
      localStorage.getItem(wishlistKey);

    setWishlistItems(
      savedWishlist
        ? JSON.parse(savedWishlist)
        : []
    );
  }, [isLoggedIn, currentUser]);

  // Save wishlist for the current account
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email) {
      return;
    }

    const wishlistKey =
      `shopease_wishlist_${currentUser.email.toLowerCase()}`;

    localStorage.setItem(
      wishlistKey,
      JSON.stringify(wishlistItems)
    );
  }, [
    wishlistItems,
    isLoggedIn,
    currentUser,
  ]);

  const toggleWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [
        ...currentItems,
        product,
      ];
    });
  };

  const isWishlisted = (id) => {
    return wishlistItems.some(
      (item) => item.id === id
    );
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}