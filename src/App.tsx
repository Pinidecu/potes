import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import Menu from './components/Menu';
import Checkout from './components/Checkout';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Orders from './components/admin/Orders';

// Componente para proteger rutas de admin
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useApp();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// Layout principal con navegación
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={
              <MainLayout>
                <Landing />
              </MainLayout>
            } />
            <Route path="/menu" element={
              <MainLayout>
                <Menu />
              </MainLayout>
            } />
            <Route path="/checkout" element={
              <MainLayout>
                <Checkout />
              </MainLayout>
            } />

            {/* Login de admin */}
            <Route path="/admin/login" element={<Login />} />

            {/* Rutas de admin protegidas */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="salads" element={
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestión de Ensaladas</h1>
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">Funcionalidad de gestión de ensaladas próximamente</p>
                  </div>
                </div>
              } />
              <Route path="ingredients" element={
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestión de Ingredientes</h1>
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">Funcionalidad de gestión de ingredientes próximamente</p>
                  </div>
                </div>
              } />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;