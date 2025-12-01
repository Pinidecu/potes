import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-green-400">PÓTE</h3>
            <p className="text-gray-300">
              En Potes, cada ensalada es un momento fresco.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/pote.alimentos/" target='_blank' className="text-gray-300 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Salta Capital</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">+54 3872572264</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">info@potes.com</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Navegación</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-green-400 transition-colors text-sm">
                Inicio
              </Link>
              <Link to="/menu" className="block text-gray-300 hover:text-green-400 transition-colors text-sm">
                Menú
              </Link>
              <a href="#" className="block text-gray-300 hover:text-green-400 transition-colors text-sm">
                Contacto
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Horarios</h4>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>Lunes - Viernes: 10:00 - 22:00</p>
              <p>Sábados: 10:00 - 23:00</p>
              <p>Domingos: 11:00 - 21:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Potes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};