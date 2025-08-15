import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, addOrder, clearCart, ingredients } = useApp();
  const [customer, setCustomer] = useState<Customer>({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    gps: '-34.6118, -58.3960', // Buenos Aires coordinates as default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.nombre || !customer.apellido || !customer.telefono || !customer.direccion) {
      alert('Por favor completá todos los campos requeridos');
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setIsSubmitting(true);

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    addOrder(customer, cart);
    clearCart();
    setOrderCompleted(true);
    setIsSubmitting(false);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-600 mb-6">
            <CheckCircle size={80} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-6">
            Gracias por tu pedido. Te contactaremos pronto para confirmar la entrega.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agregá algunas ensaladas antes de finalizar tu pedido</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Ver menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Finalizar Pedido</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Resumen de tu pedido</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.salad.name}</h3>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                  
                  {/* Ingredientes incluidos */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Incluye:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedIngredients.map(ingredientId => {
                        const ingredient = ingredients.find(i => i.id === ingredientId);
                        return ingredient ? (
                          <span key={ingredientId} className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {ingredient.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Ingredientes extra */}
                  {item.extraIngredients.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Extras:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.extraIngredients.map(ingredientId => {
                          const ingredient = ingredients.find(i => i.id === ingredientId);
                          return ingredient ? (
                            <span key={ingredientId} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {ingredient.name} (+{formatPrice(ingredient.price)})
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between items-center text-xl font-bold pt-4">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Datos de entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={customer.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    required
                    value={customer.apellido}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  required
                  value={customer.telefono}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  required
                  value={customer.direccion}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Calle, número, piso, depto"
                />
              </div>

              <div>
                <label htmlFor="gps" className="block text-sm font-medium text-gray-700 mb-2">
                  Coordenadas GPS (opcional)
                </label>
                <input
                  type="text"
                  id="gps"
                  name="gps"
                  value={customer.gps}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="-34.6118, -58.3960"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Las coordenadas GPS nos ayudan a encontrarte más fácil
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  'Confirmar pedido'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;