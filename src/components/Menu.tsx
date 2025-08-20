import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Check, X } from "lucide-react";
import { salads, ingredients, Salad, Ingredient } from "../data/sampleData";
import { useCart } from "../hooks/useCart";

const Menu: React.FC = () => {
  const { addToCart, getItemCount } = useCart();
  const [selectedSalad, setSelectedSalad] = useState<Salad | null>(null);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addedIngredients, setAddedIngredients] = useState<Ingredient[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);

  const activeSalads = salads.filter((salad) => salad.isActive);

  const openCustomization = (salad: Salad) => {
    setSelectedSalad(salad);
    setRemovedIngredients([]);
    setAddedIngredients([]);
    setShowCustomization(true);
  };

  const closeCustomization = () => {
    setShowCustomization(false);
    setSelectedSalad(null);
    setRemovedIngredients([]);
    setAddedIngredients([]);
  };

  const toggleRemovedIngredient = (ingredientId: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const toggleAddedIngredient = (ingredient: Ingredient) => {
    setAddedIngredients((prev) =>
      prev.find((i) => i.id === ingredient.id)
        ? prev.filter((i) => i.id !== ingredient.id)
        : [...prev, ingredient]
    );
  };

  const addCustomizedSaladToCart = () => {
    if (selectedSalad) {
      addToCart(selectedSalad, removedIngredients, addedIngredients);
      closeCustomization();
    }
  };

  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find((ing) => ing.id === id);
    return ingredient ? ingredient.name : "";
  };

  const calculateCustomPrice = () => {
    if (!selectedSalad) return 0;
    const addedPrice = addedIngredients.reduce(
      (sum, ing) => sum + ing.price,
      0
    );
    return selectedSalad.price + addedPrice;
  };

  const ingredientsByCategory = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestro Menú
          </h1>
          <p className="text-xl text-gray-600">
            Elegí tu ensalada favorita y personalizala a tu gusto
          </p>
        </motion.div>

        {/* Cart Summary */}
        {getItemCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-200 rounded-lg p-4 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                {getItemCount()} producto(s) en tu carrito
              </span>
            </div>
            <a
              href="/checkout"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Ver carrito
            </a>
          </motion.div>
        )}

        {/* Salads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activeSalads.map((salad, index) => (
            <motion.div
              key={salad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={salad.image}
                alt={salad.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {salad.name}
                </h3>
                <p className="text-gray-600 mb-4">{salad.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ingredientes:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {salad.ingredients.map((ingredientId) => (
                      <span
                        key={ingredientId}
                        className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full"
                      >
                        {getIngredientName(ingredientId)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${salad.price}
                  </span>
                  <button
                    onClick={() => openCustomization(salad)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Personalizar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Customization Modal */}
        {showCustomization && selectedSalad && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Personalizar {selectedSalad.name}
                </h2>
                <button
                  onClick={closeCustomization}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Current Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Ingredientes incluidos
                    </h3>
                    <div className="space-y-3">
                      {selectedSalad.ingredients.map((ingredientId) => {
                        const ingredient = ingredients.find(
                          (i) => i.id === ingredientId
                        );
                        const isRemoved =
                          removedIngredients.includes(ingredientId);

                        return (
                          <div
                            key={ingredientId}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              isRemoved
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <span
                              className={
                                isRemoved
                                  ? "text-red-700 line-through"
                                  : "text-green-700"
                              }
                            >
                              {ingredient?.name}
                            </span>
                            <button
                              onClick={() =>
                                toggleRemovedIngredient(ingredientId)
                              }
                              className={`p-1 rounded-full ${
                                isRemoved
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                            >
                              {isRemoved ? (
                                <Plus className="h-4 w-4" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Agregar ingredientes
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(ingredientsByCategory).map(
                        ([category, categoryIngredients]) => (
                          <div key={category}>
                            <h4 className="font-medium text-gray-800 mb-3">
                              {category}
                            </h4>
                            <div className="space-y-2">
                              {categoryIngredients
                                .filter(
                                  (ingredient) =>
                                    !selectedSalad.ingredients.includes(
                                      ingredient.id
                                    )
                                )
                                .map((ingredient) => {
                                  const isAdded = addedIngredients.find(
                                    (i) => i.id === ingredient.id
                                  );

                                  return (
                                    <div
                                      key={ingredient.id}
                                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                        isAdded
                                          ? "bg-blue-50 border-blue-200"
                                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                      }`}
                                      onClick={() =>
                                        toggleAddedIngredient(ingredient)
                                      }
                                    >
                                      <div>
                                        <span
                                          className={
                                            isAdded
                                              ? "text-blue-700 font-medium"
                                              : "text-gray-700"
                                          }
                                        >
                                          {ingredient.name}
                                        </span>
                                        {ingredient.price > 0 && (
                                          <span className="text-sm text-gray-500 ml-2">
                                            +${ingredient.price}
                                          </span>
                                        )}
                                      </div>
                                      <div
                                        className={`p-1 rounded-full ${
                                          isAdded
                                            ? "bg-blue-500"
                                            : "bg-gray-300"
                                        }`}
                                      >
                                        {isAdded && (
                                          <Check className="h-4 w-4 text-white" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg text-gray-600">
                        Precio total:{" "}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${calculateCustomPrice()}
                      </span>
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
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
