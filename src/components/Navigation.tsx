import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, UtensilsCrossed, LogOut } from 'lucide-react';
import { useCart } from '../utils/useCart';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname.startsWith('/admin')) {
    return (
      <nav className="bg-green-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/admin" className="text-2xl font-bold">Potes - Admin</Link>
          <button
            onClick={() => {  }}
            className="flex items-center gap-2 bg-green-700 px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <UtensilsCrossed className="text-green-600" />
            Potes
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Home size={20} />
              <span className="hidden sm:block">Inicio</span>
            </Link>
            
            <Link
              to="/menu"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
                isActive('/menu') 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:block">Menú</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* {isAdmin && (
              <Link
                to="/admin"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Admin
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;