'use client';

import { createContext, useContext } from 'react';

type CartItem = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
    image: {
      url: string;
    };
    priceV2: {
      amount: string;
      currencyCode: string;
    };
  };
};

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: CartItem;
    }>;
  };
};

type CartContextType = {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<Cart | null>;
  refreshCart: () => Promise<Cart | null>;
  isLoading: boolean;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}