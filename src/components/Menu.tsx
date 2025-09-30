"use client"

import { useState, useEffect } from "react"
import { Plus, ShoppingCart, Check, X, Minus } from "lucide-react"
import { useCart } from "../utils/useCart"
import { makeQuery } from "../utils/api"
import { useSnackbar } from "notistack"

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

export default function MenuPage() {
  const { addToCart, getItemCount } = useCart()
  const [salads, setSalads] = useState<Salad[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedSalad, setSelectedSalad] = useState<Salad | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<Ingredient[]>([])
  const [removedIngredients, setRemovedIngredients] = useState<Ingredient[]>([])
  const [showCustomization, setShowCustomization] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const {enqueueSnackbar} = useSnackbar()

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    fetchSalads()
    fetchIngredients()
  }, [])

  const fetchSalads = () => {
    makeQuery(
      localStorage.getItem("token"),
      "getSalads",
      {},
      enqueueSnackbar,
      (data: Salad[]) => {
        setSalads(data)
      },
      setLoading,
      undefined,
    )
  }

  const fetchIngredients = () => {
    makeQuery(
      localStorage.getItem("token"),
      "getIngredients",
      {},
      enqueueSnackbar,
      (data: Ingredient[]) => {
        setIngredients(data)
      },
      setLoading,
      undefined,
    )
  }

  const openCustomization = (salad: Salad) => {
    setSelectedSalad(salad)
    setSelectedExtras([])
    setRemovedIngredients([])
    setShowCustomization(true)
  }

  const closeCustomization = () => {
    setShowCustomization(false)
    setSelectedSalad(null)
    setSelectedExtras([])
    setRemovedIngredients([])
  }

  const toggleExtra = (ingredient: Ingredient) => {
    setSelectedExtras((prev) =>
      prev.find((i) => i._id === ingredient._id) ? prev.filter((i) => i._id !== ingredient._id) : [...prev, ingredient],
    )
  }

  const toggleRemovedIngredient = (ingredient: Ingredient) => {
    setRemovedIngredients((prev) =>
      prev.find((i) => i._id === ingredient._id) ? prev.filter((i) => i._id !== ingredient._id) : [...prev, ingredient],
    )
  }

  const addCustomizedSaladToCart = () => {
    if (selectedSalad) {
      addToCart(selectedSalad, selectedExtras, removedIngredients.length ? `Sin: ${removedIngredients.map((ing) => ing.name).join(", ")}` : "")
      showNotification("Ensalada agregada al carrito", "success")
      closeCustomization()
    }
  }

  const calculateCustomPrice = () => {
    if (!selectedSalad) return 0
    const extrasPrice = selectedExtras.reduce((sum, ing) => sum + ing.priceAsExtra, 0)
    return selectedSalad.price + extrasPrice
  }

  const ingredientsByType = ingredients.reduce(
    (acc, ingredient) => {
      if (!acc[ingredient.type]) {
        acc[ingredient.type] = []
      }
      acc[ingredient.type].push(ingredient)
      return acc
    },
    {} as Record<string, Ingredient[]>,
  )

  const typeLabels: Record<string, string> = {
    base: "Bases",
    vegetal: "Vegetales",
    premium: "Premium",
    proteina: "Proteínas",
    aderezo: "Aderezos",
    extra: "Extras",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando menú...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestro Menú</h1>
          <p className="text-xl text-gray-600">Elegí tu ensalada favorita y personalizala a tu gusto</p>
        </div>

        {getItemCount() > 0 && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">{getItemCount()} producto(s) en tu carrito</span>
            </div>
            <a
              href="/checkout"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Ver carrito
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {salads.map((salad) => (
            <div
              key={salad._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img src={salad.image || "/placeholder.svg"} alt={salad.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{salad.name}</h3>
                <p className="text-gray-600 mb-4">{salad.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Ingredientes base:</h4>
                  <div className="flex flex-wrap gap-2">
                    {salad.base.map((ingredient) => (
                      <span key={ingredient._id} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                        {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">${salad.price}</span>
                  <button
                    onClick={() => openCustomization(salad)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Personalizar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCustomization && selectedSalad && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Personalizar {selectedSalad.name}</h2>
                <button onClick={closeCustomization} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ingredientes base (podés quitar los que no quieras)</h3>
                    <div className="space-y-3">
                      {selectedSalad.base.map((ingredient) => {
                        const isRemoved = removedIngredients.find((i) => i._id === ingredient._id)
                        return (
                          <div
                            key={ingredient._id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                              isRemoved ? "bg-red-50 border-red-200 opacity-60" : "bg-green-50 border-green-200"
                            }`}
                            onClick={() => toggleRemovedIngredient(ingredient)}
                          >
                            <span className={isRemoved ? "text-red-700 line-through" : "text-green-700"}>
                              {ingredient.name}
                            </span>
                            {isRemoved ? (
                              <Minus className="h-5 w-5 text-red-600" />
                            ) : (
                              <Check className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Agregar extras</h3>
                    <div className="space-y-6">
                      {Object.entries(ingredientsByType).map(([type, typeIngredients]) => (
                        <div key={type}>
                          <h4 className="font-medium text-gray-800 mb-3">{typeLabels[type] || type}</h4>
                          <div className="space-y-2">
                            {typeIngredients.map((ingredient) => {
                              const isSelected = selectedExtras.find((i) => i._id === ingredient._id)

                              return (
                                <div
                                  key={ingredient._id}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-200"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                  }`}
                                  onClick={() => toggleExtra(ingredient)}
                                >
                                  <div>
                                    <span className={isSelected ? "text-blue-700 font-medium" : "text-gray-700"}>
                                      {ingredient.name}
                                    </span>
                                    {ingredient.priceAsExtra > 0 && (
                                      <span className="text-sm text-gray-500 ml-2">+${ingredient.priceAsExtra}</span>
                                    )}
                                  </div>
                                  <div className={`p-1 rounded-full ${isSelected ? "bg-blue-500" : "bg-gray-300"}`}>
                                    {isSelected && <Check className="h-4 w-4 text-white" />}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg text-gray-600">Precio total: </span>
                      <span className="text-2xl font-bold text-green-600">${calculateCustomPrice()}</span>
                    </div>
                    <button
                      onClick={addCustomizedSaladToCart}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Agregar al carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
