import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    console.log('Loading cart from localStorage...');
    const savedCart = localStorage.getItem('cart');
    console.log('Saved cart from localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart:', parsedCart);
        setCartItems(parsedCart);
        updateItemCount(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    setItemCount(0);
    localStorage.removeItem('cart');
  };

  // Update item count based on cart items
  const updateItemCount = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
    setItemCount(count);
  };

  // Add item to cart
  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      return;
    }

    setCartItems(prevItems => {
      console.log('Previous cart items:', prevItems);
      const existingItem = prevItems.find(item => item && item._id === product._id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item._id === product._id 
            ? { 
                ...item, 
                quantity: (parseInt(item.quantity) || 1) + (parseInt(product.quantity) || 1)
              }
            : item
        );
      } else {
        updatedItems = [...prevItems, { 
          ...product, 
          quantity: parseInt(product.quantity) || 1
        }];
      }
      
      console.log('Updated cart items:', updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      updateItemCount(updatedItems);
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === productId);
      let updatedItems;

      if (existingItem && existingItem.quantity > 1) {
        updatedItems = prevItems.map(item =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        updatedItems = prevItems.filter(item => item._id !== productId);
      }

      localStorage.setItem('cart', JSON.stringify(updatedItems));
      updateItemCount(updatedItems);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        itemCount,
        addToCart,
        removeFromCart,
        clearCartItems: clearCart,
        clearCart,
        itemCount,
        cartItems,
        updateItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
