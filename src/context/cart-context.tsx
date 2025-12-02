import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { cartApi } from '@/lib/api';
import type { CartResponse } from '@/lib/api';
import { useAuth } from './auth-context';

interface CartContextType {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const refreshCart = async () => {
    if (!token) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const cartData = await cartApi.getCart(token);
      setCart(cartData);
    } catch (err) {
      console.error('[CartContext] Failed to fetch cart:', err);
      setError('Không thể tải giỏ hàng');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh cart when user logs in/out
  useEffect(() => {
    refreshCart();
  }, [user, token]);

  const itemCount = cart?.items?.length || 0;

  return (
    <CartContext.Provider value={{ cart, isLoading, error, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

