import React, { useState } from 'react';
import { Phone, MapPin, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, ingredients } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Preparado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En entrega':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusOptions: Order['status'][] = ['Pendiente', 'Preparado', 'En entrega', 'Completado'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pedidos</h1>
        <p className="text-gray-600">Administra todos los pedidos del negocio</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No hay pedidos</h2>
          <p className="text-gray-500">Los pedidos aparecerán aquí cuando se realicen</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lista de pedidos */}
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-green-500' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {order.customer.nombre} {order.customer.apellido}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Pedido #{order.id.split('-').pop()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded border text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {order.customer.telefono}
                  </span>
                  <span>{order.date} - {order.time}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detalle del pedido seleccionado */}
          <div className="sticky top-4">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Pedido #{selectedOrder.id.split('-').pop()}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span>Estado:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-gray-600">{selectedOrder.date} - {selectedOrder.time}</p>
                </div>

                {/* Información del cliente */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Datos del cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {selectedOrder.customer.nombre} {selectedOrder.customer.apellido}</p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} />
                      {selectedOrder.customer.telefono}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} />
                      {selectedOrder.customer.direccion}
                    </p>
                    {selectedOrder.customer.gps && (
                      <p className="text-gray-600">
                        <strong>GPS:</strong> {selectedOrder.customer.gps}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Items del pedido</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.salad.name}</h4>
                          <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Ingredientes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedIngredients.map(ingredientId => {
                              const ingredient = ingredients.find(i => i.id === ingredientId);
                              return ingredient ? (
                                <span key={ingredientId} className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                                  {ingredient.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {item.extraIngredients.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Extras:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.extraIngredients.map(ingredientId => {
                                const ingredient = ingredients.find(i => i.id === ingredientId);
                                return ingredient ? (
                                  <span key={ingredientId} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                                    +{ingredient.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Selecciona un pedido
                </h3>
                <p className="text-gray-500">
                  Haz clic en un pedido para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;