import React from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { BarChart3, ShoppingBag, UtensilsCrossed, Package } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // 🔐 Verificar si está logueado
  const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";

  // ❌ Si NO está autenticado ➜ redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
    },
    {
      name: 'Pedidos',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Ensaladas',
      href: '/admin/salads',
      icon: UtensilsCrossed,
    },
    {
      name: 'Ingredientes',
      href: '/admin/ingredients',
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
