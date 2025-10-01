"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface Ingredient {
  _id: string
  name: string
  priceAsExtra: number
  type: string
}

interface Salad {
  _id: string
  name: string
  description?: string
  base: Ingredient[]
  extras: Ingredient[]
  price: number
  image: string
}

export interface CartItem {
  salad: Salad
  quantity: number
  extra: Ingredient[]
  removedIngredients: string
}

const CART_STORAGE_KEY = "salad-cart"

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (salad: Salad, extras?: Ingredient[], removed?: string) => void
  removeFromCart: (index: number) => void
  updateQuantity: (index: number, qty: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) setCartItems(JSON.parse(stored))
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addToCart = useCallback(
    (salad: Salad, selectedExtras: Ingredient[] = [], removedIngredients: string = "") => {
      setCartItems((prev) => {
        const existingItem = prev.find(
          (item) =>
            item.salad._id === salad._id &&
            JSON.stringify(item.extra.map((i) => i._id).sort()) ===
              JSON.stringify(selectedExtras.map((i) => i._id).sort()) &&
            item.removedIngredients === removedIngredients,
        )

        if (existingItem) {
          return prev.map((item) =>
            item === existingItem ? { ...item, quantity: item.quantity + 1 } : item,
          )
        }

        return [...prev, { salad, extra: selectedExtras, removedIngredients, quantity: 1 }]
      })
    },
    [],
  )

  const removeFromCart = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item)),
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const getTotal = useCallback(
    () =>
      cartItems.reduce((total, item) => {
        const extrasPrice = item.extra.reduce((sum, ing) => sum + ing.priceAsExtra, 0)
        return total + (item.salad.price + extrasPrice) * item.quantity
      }, 0),
    [cartItems],
  )

  const getItemCount = useCallback(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems],
  )

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}
