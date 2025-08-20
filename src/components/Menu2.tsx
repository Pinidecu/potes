import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingCart, Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Salad, CartItem } from "../types";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { salads, ingredients, cart, addToCart, getCartTotal } = useApp();
  const [selectedSalad, setSelectedSalad] = useState<Salad | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [extraIngredients, setExtraIngredients] = useState<string[]>([]);

  const activeSalads = salads.filter((salad) => salad.active);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  const openCustomization = (salad: Salad) => {
    setSelectedSalad(salad);
    setSelectedIngredients([...salad.baseIngredients]);
    setExtraIngredients([]);
  };

  const closeCustomization = () => {
    setSelectedSalad(null);
    setSelectedIngredients([]);
    setExtraIngredients([]);
  };

  const toggleBaseIngredient = (ingredientId: string) => {
    if (selectedIngredients.includes(ingredientId)) {
      setSelectedIngredients((prev) =>
        prev.filter((id) => id !== ingredientId)
      );
    } else {
      setSelectedIngredients((prev) => [...prev, ingredientId]);
    }
  };

  const toggleExtraIngredient = (ingredientId: string) => {
    if (extraIngredients.includes(ingredientId)) {
      setExtraIngredients((prev) => prev.filter((id) => id !== ingredientId));
    } else {
      setExtraIngredients((prev) => [...prev, ingredientId]);
    }
  };

  const calculateItemPrice = () => {
    if (!selectedSalad) return 0;

    const extraPrice = extraIngredients.reduce((total, ingredientId) => {
      const ingredient = ingredients.find((i) => i.id === ingredientId);
      return total + (ingredient?.price || 0);
    }, 0);

    return selectedSalad.basePrice + extraPrice;
  };

  const addToCartHandler = () => {
    if (!selectedSalad) return;

    const cartItem: CartItem = {
      salad: selectedSalad,
      selectedIngredients,
      extraIngredients,
      quantity: 1,
      totalPrice: calculateItemPrice(),
      id: `${selectedSalad.id}-${Date.now()}`,
    };

    addToCart(cartItem);
    closeCustomization();
  };

  const getIngredientsByCategory = (category: string) => {
    return ingredients.filter((ing) => ing.category === category);
  };

  const categoryNames = {
    verdura: "Verduras",
    proteina: "Proteínas",
    cereal: "Cereales y Semillas",
    fruta: "Frutas",
    aderezo: "Aderezos",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carrito de compras */}
      {cart.length > 0 && (
        <div className="max-w-6xl  mx-auto px-4 py-8 bg-white rounded-lg shadow-md p-6 m-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart />
            Mi Pedido ({cart.length} {cart.length === 1 ? "item" : "items"})
          </h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.salad.name}</h3>
                    {item.extraIngredients.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Extras:{" "}
                        {item.extraIngredients
                          .map(
                            (id) => ingredients.find((i) => i.id === id)?.name
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestro Menú
          </h1>
          <p className="text-lg text-gray-600">
            Elegí tu ensalada favorita y personalizála a tu gusto
          </p>
        </div>

        {/* Grid de ensaladas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeSalads.map((salad) => (
            <div
              key={salad.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={salad.image}
                alt={salad.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{salad.name}</h3>
                <p className="text-gray-600 mb-4">{salad.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Ingredientes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {salad.baseIngredients.map((ingredientId) => {
                      const ingredient = ingredients.find(
                        (i) => i.id === ingredientId
                      );
                      return ingredient ? (
                        <span
                          key={ingredientId}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {ingredient.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(salad.basePrice)}
                  </span>
                  <button
                    onClick={() => openCustomization(salad)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Personalizar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de personalización */}
      {selectedSalad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Personalizar {selectedSalad.name}
                </h2>
                <button
                  onClick={closeCustomization}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedSalad.description}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Ingredientes base */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Ingredientes base
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedSalad.baseIngredients.map((ingredientId) => {
                    const ingredient = ingredients.find(
                      (i) => i.id === ingredientId
                    );
                    if (!ingredient) return null;

                    const isSelected =
                      selectedIngredients.includes(ingredientId);
                    return (
                      <button
                        key={ingredientId}
                        onClick={() => toggleBaseIngredient(ingredientId)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          isSelected
                            ? "bg-green-100 border-green-500 text-green-800"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? <Check size={16} /> : <X size={16} />}
                          <span>{ingredient.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ingredientes extra */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Agregar ingredientes
                </h3>
                {Object.entries(categoryNames).map(([category, name]) => {
                  const categoryIngredients =
                    getIngredientsByCategory(category);
                  const availableIngredients = categoryIngredients.filter(
                    (ing) => !selectedSalad.baseIngredients.includes(ing.id)
                  );

                  if (availableIngredients.length === 0) return null;

                  return (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium mb-3 text-gray-700">{name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableIngredients.map((ingredient) => {
                          const isSelected = extraIngredients.includes(
                            ingredient.id
                          );
                          return (
                            <button
                              key={ingredient.id}
                              onClick={() =>
                                toggleExtraIngredient(ingredient.id)
                              }
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                isSelected
                                  ? "bg-blue-100 border-blue-500 text-blue-800"
                                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{ingredient.name}</span>
                                <div className="flex items-center gap-1">
                                  {ingredient.price > 0 && (
                                    <span className="text-sm">
                                      +{formatPrice(ingredient.price)}
                                    </span>
                                  )}
                                  {isSelected ? (
                                    <Minus size={16} />
                                  ) : (
                                    <Plus size={16} />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(calculateItemPrice())}
                </span>
              </div>
              <button
                onClick={addToCartHandler}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Agregar al pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
