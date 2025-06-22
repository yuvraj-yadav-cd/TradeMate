import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'INIT_CART':
      return {
        ...state,
        items: action.payload,
      };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      break;

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      break;

    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
      };
      break;

    default:
      return state;
  }

  // Save to AsyncStorage whenever the cart changes
  AsyncStorage.setItem('cartItems', JSON.stringify(newState.items))
    .catch(error => console.error('Error saving cart:', error));

  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart items from AsyncStorage on initial render
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cartItems');
        if (savedCart) {
          dispatch({ type: 'INIT_CART', payload: JSON.parse(savedCart) });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCartItems();
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);