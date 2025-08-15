import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Order, Customer, Salad, Ingredient } from '../types';
import { salads as initialSalads } from '../data/salads';
import { ingredients as initialIngredients } from '../data/ingredients';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  addOrder: (customer: Customer, items: CartItem[]) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Admin
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Salads
  salads: Salad[];
  addSalad: (salad: Salad) => void;
  updateSalad: (salad: Salad) => void;
  toggleSaladStatus: (saladId: string) => void;

  // Ingredients
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [salads, setSalads] = useState<Salad[]>(initialSalads);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const addOrder = (customer: Customer, items: CartItem[]) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customer,
      items,
      total: items.reduce((total, item) => total + item.totalPrice, 0),
      status: 'Pendiente',
      date: new Date().toLocaleDateString('es-AR'),
      time: new Date().toLocaleTimeString('es-AR'),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'potes123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const addSalad = (salad: Salad) => {
    setSalads(prev => [...prev, salad]);
  };

  const updateSalad = (updatedSalad: Salad) => {
    setSalads(prev => 
      prev.map(salad => 
        salad.id === updatedSalad.id ? updatedSalad : salad
      )
    );
  };

  const toggleSaladStatus = (saladId: string) => {
    setSalads(prev => 
      prev.map(salad => 
        salad.id === saladId ? { ...salad, active: !salad.active } : salad
      )
    );
  };

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients(prev => [...prev, ingredient]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(prev => 
      prev.map(ingredient => 
        ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
      )
    );
  };

  const removeIngredient = (ingredientId: string) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId));
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      orders,
      addOrder,
      updateOrderStatus,
      isAdmin,
      login,
      logout,
      salads,
      addSalad,
      updateSalad,
      toggleSaladStatus,
      ingredients,
      addIngredient,
      updateIngredient,
      removeIngredient,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};