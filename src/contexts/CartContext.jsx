
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('neenu_cart');
    const savedForLater = localStorage.getItem('neenu_saved_items');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
    if (savedForLater) {
      try {
        setSavedItems(JSON.parse(savedForLater));
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('neenu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('neenu_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const saveForLater = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item, quantity: 1 }]);
      removeFromCart(itemId);
    }
  };

  const moveToCart = (item) => {
    addToCart(item, 1);
    setSavedItems(prev => prev.filter(saved => saved.id !== item.id));
  };

  const removeFromSaved = (itemId) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    savedItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
