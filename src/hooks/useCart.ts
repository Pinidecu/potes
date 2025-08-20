import { useState, useCallback } from 'react';
import { CartItem, Salad, Ingredient } from '../data/sampleData';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((salad: Salad, removedIngredients: string[] = [], addedIngredients: Ingredient[] = []) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === salad.id && 
        JSON.stringify(item.removedIngredients.sort()) === JSON.stringify(removedIngredients.sort()) &&
        JSON.stringify(item.addedIngredients.map(i => i.id).sort()) === JSON.stringify(addedIngredients.map(i => i.id).sort())
      );

      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const newItem: CartItem = {
        ...salad,
        removedIngredients,
        addedIngredients,
        quantity: 1,
      };

      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCartItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const addedIngredientsPrice = item.addedIngredients.reduce((sum, ing) => sum + ing.price, 0);
      return total + (item.price + addedIngredientsPrice) * item.quantity;
    }, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
};