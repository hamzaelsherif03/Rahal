'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCart, createCart, addToCart as addItemToCart } from '@/lib/shopify';
import { CartContext } from './cart-context';
import Cookies from 'js-cookie';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart on initial render
  useEffect(() => {
    const loadCart = async () => {
      const cartId = Cookies.get('cartId');
      if (cartId) {
        setIsLoading(true);
        try {
          const cartData = await getCart(cartId);
          setCart(cartData);
        } catch (error) {
          console.error('Error loading cart:', error);
          // If cart can't be loaded, remove the invalid cart ID
          Cookies.remove('cartId');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCart();
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (variantId, quantity = 1) => {
    setIsLoading(true);
    try {
      const cartId = Cookies.get('cartId');
      let updatedCart;
      
      if (cartId) {
        // Add to existing cart
        updatedCart = await addItemToCart(cartId, variantId, quantity);
      } else {
        // Create new cart
        updatedCart = await createCart(variantId, quantity);
        if (updatedCart?.id) {
          Cookies.set('cartId', updatedCart.id, { expires: 30 }); // 30 days
        }
      }
      
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh cart data
  const refreshCart = useCallback(async () => {
    const cartId = Cookies.get('cartId');
    if (cartId) {
      setIsLoading(true);
      try {
        const cartData = await getCart(cartId);
        setCart(cartData);
        return cartData;
      } catch (error) {
        console.error('Error refreshing cart:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    return null;
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      setCart, 
      addToCart, 
      refreshCart, 
      isLoading 
    }}>
      {children}
    </CartContext.Provider>
  );
}