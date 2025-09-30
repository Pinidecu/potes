"use client"

import { useState, useEffect, useCallback } from "react"

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
  removedIngredients: String
}

const CART_STORAGE_KEY = "salad-cart"

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        try {
          setCartItems(JSON.parse(stored))
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addToCart = useCallback(
    (salad: Salad, selectedExtras: Ingredient[] = [], removedIngredients: String = "") => {
      setCartItems((prev) => {
        const existingItem = prev.find(
          (item) =>
            item.salad._id === salad._id &&
            JSON.stringify(item.extra.map((i) => i._id).sort()) ===
              JSON.stringify(selectedExtras.map((i) => i._id).sort()) &&
            JSON.stringify(item.removedIngredients) ===
              JSON.stringify(removedIngredients),
        )

        if (existingItem) {
          return prev.map((item) => (item === existingItem ? { ...item, quantity: item.quantity + 1 } : item))
        }

        const newItem: CartItem = {
          salad,
          extra: selectedExtras,
          removedIngredients,
          quantity: 1,
        }

        return [...prev, newItem]
      })
    },
    [],
  )

  const removeFromCart = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((_, i) => i !== index))
      return
    }

    setCartItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const extrasPrice = item.extra.reduce((sum, ing) => sum + ing.priceAsExtra, 0)
      return total + (item.salad.price + extrasPrice) * item.quantity
    }, 0)
  }, [cartItems])

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  }
}
