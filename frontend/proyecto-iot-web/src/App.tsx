import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./componentes/Header";
import HeaderPublico from "./componentes/HeaderPublico";
import Foother from "./componentes/Foother";
import FootherPublico from "./componentes/FootherPublico";
import PantallaLogin from "./componentes/PantallaLogin";
import PantallaRegistro from "./componentes/PantallaRegistro";
import PantallaInicio from "./componentes/PantallaPrincipal";
import PantallaInicioPublica from "./componentes/PantallaInicioPublica";
import AdminDashboard from "./componentes/AdminDashboard";
import PantallaDatosEmpresa from "./componentes/PantallaDatosEmpresa";
import PantallaAgregarProducto from "./componentes/PantallaAgregarProducto";
import PantallaCatalogo from "./componentes/PantallaCatalogoProductos";
import PantallaCatalogoProductosPublica from "./componentes/PantallaCatalogoProductosPublica";
import PantallaPuerta from "./componentes/PantallaPuerta";
import PantallaRfidControl from "./componentes/PantallaRfidControl";
import EmpresaInfo from "./componentes/EmpresaInfo";
import EmpresaInfoPublica from "./componentes/EmpresaInfoPublica";
import PantallaRecuperarContraseña from "./componentes/PantallaRecuperarContraseña";
import PantallaRestablecerContraseña from "./componentes/PantallaRestablecerContraseña";
import PantallaProductoDetail from "./componentes/PantallaProductoDetail";
import PantallaProductoDetailPublica from "./componentes/PantallaProductoDetailPublica";
import PantallaPerfilUsuario from "./componentes/PantallaPerfilUsuario";
import GestionarUsuarios from "./componentes/GestionarUsuarios";
import PantallaRecuperarConPregunta from "./componentes/PantallaRecuperarConPregunta"; // Importa PantallaRecuperarConPregunta
import { CartProvider } from "./context/CartContext";
import CartScreen from "./componentes/CartScreen";
import CheckoutScreen from "./componentes/CheckoutScreen";
import PantallaHuella from "./componentes/PantallaHuella"; // Importa la pantalla de registro de huellas
import PantallaPoliticasPage from "./componentes/PoliticasPage"; // Importa la pantalla de políticas

const App: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Rutas que deben mostrar header/footer públicos
  const publicRoutes = [
    '/', 
    '/login', 
    '/register',
    '/recover-password', 
    '/reset-password/:token',
    '/empresaPublico',
    '/productosPublico',
    '/productoDetailPublico',
    '/politicas',
  ];

  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes(':')) {
      const routeBase = route.split('/:')[0];
      return location.pathname.startsWith(routeBase);
    }
    return location.pathname === route;
  });

  return (
    <>
      {/* Header público para rutas públicas, privado para las demás */}
      {isPublicRoute ? <HeaderPublico /> : <Header />}
      
      <div>
        <Routes>
          {/* ========== RUTAS PÚBLICAS ========== */}
          <Route path="/" element={<PantallaInicioPublica />} />
          <Route path="/login" element={<PantallaLogin />} />
          <Route path="/register" element={<PantallaRegistro />} />
          <Route path="/recover-password" element={<PantallaRecuperarContraseña />} />
          <Route path="/reset-password/:token" element={<PantallaRestablecerContraseña />} />
          
          {/* Versiones públicas con URLs explícitas */}
          <Route path="/empresaPublico" element={<EmpresaInfoPublica />} />
          <Route path="/productosPublico" element={<PantallaCatalogoProductosPublica />} />
          <Route path="/productoDetailPublico" element={<PantallaProductoDetailPublica />} />
          <Route path="/recuperar-contraseña" element={<PantallaRecuperarContraseña />} /> {/* Ruta para Recuperar Contraseña */}
          <Route path="/recuperar-con-pregunta" element={<PantallaRecuperarConPregunta />} /> {/* Ruta para Recuperar con Pregunta */}
          <Route path="/politicas" element={<PantallaPoliticasPage />} /> {/* Ruta para las políticas */}

          {/* ========== RUTAS PRIVADAS ========== */}
          <Route path="/home" element={isAuthenticated ? <PantallaInicio /> : <Navigate to="/login" />} />
          
          {/* Admin */}
          <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/gestionar-usuarios" element={isAuthenticated ? <GestionarUsuarios /> : <Navigate to="/login" />} />
          <Route path="/admin-empresa" element={isAuthenticated ? <PantallaDatosEmpresa /> : <Navigate to="/login" />} />
          <Route path="/admin-productos" element={isAuthenticated ? <PantallaAgregarProducto /> : <Navigate to="/login" />} />
          
          {/* Versiones privadas */}
          <Route path="/empresa" element={isAuthenticated ? <EmpresaInfo /> : <Navigate to="/empresaPublico" />} />
          <Route path="/productos" element={isAuthenticated ? <PantallaCatalogo /> : <Navigate to="/productosPublico" />} />
          <Route path="/productoDetail" element={isAuthenticated ? <PantallaProductoDetail /> : <Navigate to="/productoDetailPublico" />} />
          
          {/* Dispositivos */}
          <Route path="/huella" element={isAuthenticated ? <PantallaPuerta /> : <Navigate to="/login" />} />
          <Route path="/dispositivo" element={isAuthenticated ? <PantallaPuerta /> : <Navigate to="/login" />} />
          <Route path="/rfid" element={isAuthenticated ? <PantallaRfidControl /> : <Navigate to="/login" />} />
          <Route path="/perfil" element={isAuthenticated ? <PantallaPerfilUsuario /> : <Navigate to="/login" />} />
          <Route path="/producto/:id" element={<PantallaProductoDetail />} />
          <Route path="/carrito" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/register-fingerprint" element={isAuthenticated ? <PantallaHuella /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      
      {/* Footer público para rutas públicas, privado para las demás */}
      {isPublicRoute ? <FootherPublico /> : <Foother />}
    </>
  );
};

const AppWrapper: React.FC = () => (
  <CartProvider>
    <Router>
      <App />
    </Router>
  </CartProvider>
);

export default AppWrapper;