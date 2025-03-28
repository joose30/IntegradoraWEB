import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
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
import PantallaRecuperarConPregunta from "./componentes/PantallaRecuperarConPregunta";
import { CartProvider } from "./context/CartContext";
import CartScreen from "./componentes/CartScreen";
import CheckoutScreen from "./componentes/CheckoutScreen";
import PantallaHuella from "./componentes/PantallaHuella";
import PantallaPoliticasPage from "./componentes/PoliticasPage";
import FingerprintRegistrationModal from "./componentes/FingerprintRegistrationModal";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si el usuario está autenticado

  const handleCaptureComplete = (accessId: string) => {
    console.log('Huella registrada con ID:', accessId);
    alert(`Huella registrada con éxito. ID: ${accessId}`);
    navigate('/home'); // Redirigir al usuario
  };

  const handleCancel = () => {
    console.log('Registro de huella cancelado');
    alert('Registro de huella cancelado.');
    navigate('/home'); // Redirigir al usuario
  };

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
    '/politicasPublico', // Ruta pública para políticas

  ];

  // Determinar si la ruta actual es pública
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
          <Route path="/empresaPublico" element={<EmpresaInfoPublica />} />
          <Route path="/productosPublico" element={<PantallaCatalogoProductosPublica />} />
          <Route path="/productoDetailPublico" element={<PantallaProductoDetailPublica />} />
          <Route path="/recuperar-contraseña" element={<PantallaRecuperarContraseña />} />
          <Route path="/recuperar-con-pregunta" element={<PantallaRecuperarConPregunta />} />
          <Route path="/politicasPublico" element={<PantallaPoliticasPage />} />
          <Route path="/registrar-huella" element={
            <FingerprintRegistrationModal
              onCaptureComplete={handleCaptureComplete}
              onCancel={handleCancel}
              userName="Usuario"
            />
          } />

          {/* ========== RUTAS PRIVADAS ========== */}
          <Route path="/home" element={isAuthenticated ? <PantallaInicio /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/gestionar-usuarios" element={isAuthenticated ? <GestionarUsuarios /> : <Navigate to="/login" />} />
          <Route path="/admin-empresa" element={isAuthenticated ? <PantallaDatosEmpresa /> : <Navigate to="/login" />} />
          <Route path="/admin-productos" element={isAuthenticated ? <PantallaAgregarProducto /> : <Navigate to="/login" />} />
          <Route path="/empresa" element={isAuthenticated ? <EmpresaInfo /> : <Navigate to="/empresaPublico" />} />
          <Route path="/productos" element={isAuthenticated ? <PantallaCatalogo /> : <Navigate to="/productosPublico" />} />
          <Route path="/productoDetail" element={isAuthenticated ? <PantallaProductoDetail /> : <Navigate to="/productoDetailPublico" />} />
          <Route path="/huella" element={isAuthenticated ? <PantallaPuerta /> : <Navigate to="/login" />} />
          <Route path="/dispositivo" element={isAuthenticated ? <PantallaPuerta /> : <Navigate to="/login" />} />
          <Route path="/rfid" element={isAuthenticated ? <PantallaRfidControl /> : <Navigate to="/login" />} />
          <Route path="/perfil" element={isAuthenticated ? <PantallaPerfilUsuario /> : <Navigate to="/login" />} />
          <Route path="/producto/:id" element={<PantallaProductoDetail />} />
          <Route path="/carrito" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />          <Route path="/politicas" element={isAuthenticated ? <PantallaPoliticasPage /> : <Navigate to="/politicasPublico" />} />
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