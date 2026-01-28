import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, Package, BarChart3 } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { makeQuery } from '../../utils/api';

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
  price: number
  image: string
}

interface CartItem {
  salad: string
  quantity: number
  removedIngredients: string
  extra: string[]
}

interface Customer {
  name: string
  email: string
  address: string
}

interface Order {
  _id: string
  cart: {
    salad: Salad | string
    quantity: number
    removedIngredients: string
    extra: (Ingredient | string)[]
  }[]
  totalPrice: number
  customer: Customer
  status: "Pending" | "In Progress" | "Shipped" | "Delivered" | "Cancelled"
  createdAt?: string
  updatedAt?: string
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalSalads: 0,
    totalIngredients: 0,
    activeOrders: 0,
  })
    const [orders, setOrders] = useState<Order[]>([])
  const {enqueueSnackbar} = useSnackbar();

  const stats = [
    {
      title: 'Pedidos Totales',
      value: statsData.totalOrders,
      icon: <ShoppingBag size={24} />,
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: 'Pedidos Pendientes',
      value: statsData.activeOrders,
      icon: <BarChart3 size={24} />,
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
    {
      title: 'Ensaladas Activas',
      value: statsData.totalSalads,
      icon: <UtensilsCrossed size={24} />,
      color: 'bg-green-500',
      link: '/admin/salads',
    },
    {
      title: 'Ingredientes',
      value: statsData.totalIngredients,
      icon: <Package size={24} />,
      color: 'bg-purple-500',
      link: '/admin/ingredients',
    },
  ];

  const fetchData = async () => {
    makeQuery(
      localStorage.getItem('token'),
      'getStats',
      '',
      enqueueSnackbar,
      (data) => setStatsData(data),
    );
  };
  
  
    const fetchOrders = async () => {
  await makeQuery(
    null,
    "getOrders",
    {},
    enqueueSnackbar,
    (data: any) => {
      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data?.orders) ? data.orders :
        []

      setOrders(list)
    },
  )
}
  

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, []);

  const recentOrders = (Array.isArray(orders) ? orders : []).slice(-5).reverse()
  

  const getSaladName = (salad: Salad | string): string => {
    if (typeof salad === "string") return "N/A"
    return salad?.name||''
  }

  const getIngredientNames = (extras: (Ingredient | string)[]): string => {
    return extras.map((e) => (typeof e === "string" ? "N/A" : e.name)).join(", ") || "Ninguno"
  }
  

  const formatDate = (date?: string): string => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                        <div className="text-sm text-gray-500">{order.customer.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.cart.map((item, idx) => (
                            <div key={idx} className="mb-2">
                              <span className="font-medium">{getSaladName(item.salad)||''}</span>
                              <span className="text-gray-500"> x{item.quantity}</span>
                              {item.extra.length > 0 && (
                                <div className="text-xs text-gray-500 ml-2">
                                  Extras: {getIngredientNames(item.extra)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;