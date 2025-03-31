import React from "react";
import { Link } from "react-router-dom";

// En HeaderPublico.tsx
const HeaderPublico: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        {/* Envolver el título en un Link para redirigir al inicio */}
        <Link to="/" style={styles.brand}>
          SEGURIX
        </Link>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/login" style={styles.navLink}>Empieza ahora</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/empresaPublico" style={styles.navLink}>Empresa</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/productosPublico" style={styles.navLink}>Productos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
  },
  nav: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
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
  brand: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#FFFFFF",
    textDecoration: "none", // Asegurarse de que no tenga subrayado
  },
};

export default HeaderPublico;