import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";
import Login from "./components/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Orders from "./components/admin/Orders";
import { Footer } from "./components/Footer";
import Ingredients from "./components/admin/Ingredients";
import SaladsPage from "./components/admin/Salads";
import { SnackbarProvider } from "notistack";
import { CartProvider } from "./context/CartProvider";
import DistanciaPage from "./components/distancia";

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
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Landing />
                  </MainLayout>
                }
              />
              <Route
                path="/menu"
                element={
                  <MainLayout>
                    <Menu />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                }
              />
              <Route
                path="/distancia"
                element={
                  <MainLayout>
                    <DistanciaPage />
                  </MainLayout>
                }
              />

              {/* Login de admin */}
              <Route path="/admin/login" element={<Login />} />

              {/* Rutas de admin protegidas */}
              <Route
                path="/admin"
                element={
                  <AdminLayout />
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route
                  path="salads"
                  element={
                    <SaladsPage />
                  }
                />
                <Route
                  path="ingredients"
                  element={<Ingredients />}
                />
              </Route>

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </CartProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
};

export default App;
