import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, Package, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Dashboard: React.FC = () => {
  const { orders, salads, ingredients } = useApp();

  const stats = [
    {
      title: 'Pedidos Totales',
      value: orders.length,
      icon: <ShoppingBag size={24} />,
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: 'Pedidos Pendientes',
      value: orders.filter(order => order.status === 'Pendiente').length,
      icon: <BarChart3 size={24} />,
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
    {
      title: 'Ensaladas Activas',
      value: salads.filter(salad => salad.active).length,
      icon: <UtensilsCrossed size={24} />,
      color: 'bg-green-500',
      link: '/admin/salads',
    },
    {
      title: 'Ingredientes',
      value: ingredients.length,
      icon: <Package size={24} />,
      color: 'bg-purple-500',
      link: '/admin/ingredients',
    },
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel Administrativo</h1>
        <p className="text-gray-600">Gestiona tu negocio de ensaladas desde aquí</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-600">No hay pedidos recientes</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {order.customer.nombre} {order.customer.apellido}
                    </p>
                    <p className="text-sm text-gray-600">{order.customer.telefono}</p>
                    <p className="text-sm text-gray-600">{order.date} - {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toLocaleString('es-AR')}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Preparado' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'En entrega' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;