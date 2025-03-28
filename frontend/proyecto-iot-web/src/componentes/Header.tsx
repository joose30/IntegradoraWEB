import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    // Obtener el nombre y rol del usuario desde localStorage
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    if (name) setUserName(name);
    if (role) setUserRole(role);
  }, []);

  const handleLogout = () => {
    // Eliminar el nombre y rol del usuario de localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    // Redirigir al login
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <h1 style={styles.brand}>SEGURIX</h1>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {/* Enlace común para todos los usuarios */}
          <li style={styles.navItem}>
            <Link to="/home" style={styles.navLink}>Inicio</Link>
          </li>
          {/* Enlaces exclusivos para administradores */}
          {userRole === "admin" && (
            <>
              <li style={styles.navItem}>
                <Link to="/admin-empresa" style={styles.navLink}>Datos Empresa</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/admin-productos" style={styles.navLink}>Agregar Producto</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/admin/gestionar-usuarios" style={styles.navLink}>Gestionar Usuarios</Link>
              </li>
            </>
          )}
          {/* Enlaces exclusivos para usuarios normales */}
          {userRole === "user" && (
            <>
              <li style={styles.navItem}>
                <Link to="/empresa" style={styles.navLink}>Empresa</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/productos" style={styles.navLink}>Productos</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/dispositivo" style={styles.navLink}>Dispositivo IoT</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/rfid" style={styles.navLink}>RFID</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/perfil" style={styles.navLink}>Perfil</Link>
              </li>
            </>
          )}
          {/* Enlace para registrar huella */}
          <li style={styles.navItem}>
            <Link to="/registrar-huella" style={styles.navLink}>Registrar Huella</Link>
          </li>
        </ul>
        <Link to="/carrito" style={styles.cartLink}>
          Carrito ({cart.length})
        </Link>
      </nav>
      <div style={styles.rightSection}>
        {userName && <p style={styles.welcome}>Bienvenido, {userName}</p>}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between", // Espaciado entre las secciones
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
  },
  leftSection: {
    flex: 1, // Ocupa espacio a la izquierda
    display: "flex",
    justifyContent: "flex-start",
  },
  nav: {
    flex: 2, // Ocupa espacio en el centro
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center",
  },
  rightSection: {
    flex: 1, // Ocupa espacio a la derecha
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
  },
  brand: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#FFFFFF",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center", // Centrar los enlaces horizontalmente
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: 0,
  },
  navLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
  },
  welcome: {
    fontSize: "16px",
    fontWeight: "normal",
  },
  logoutButton: {
    padding: "5px 10px",
    backgroundColor: "#FF4D4D",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
  },
  cartLink: {
    fontSize: '18px',
    textDecoration: 'none',
    color: '#FFFFFF',
    marginLeft: '20px',
  },
};

export default Header;