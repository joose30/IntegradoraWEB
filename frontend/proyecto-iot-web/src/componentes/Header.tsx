import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

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
    <HeaderWrapper>
      <LeftSection>
        <BrandLink to="/home">
          SEGURIX
        </BrandLink>
      </LeftSection>
      <Nav>
        <NavList>
          {/* Enlace común para todos los usuarios */}
          <NavItem>
            <NavLink to="/home">
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Inicio</span>
            </NavLink>
          </NavItem>

          {/* Enlaces exclusivos para administradores */}
          {userRole === "admin" && (
            <>
              <NavItem>
                <NavLink to="/admin-empresa">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                  <span>Datos Empresa</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/admin-productos">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Agregar Producto</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/admin/gestionar-usuarios">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Gestionar Usuarios</span>
                </NavLink>
              </NavItem>
            </>
          )}

          {/* Enlaces exclusivos para usuarios normales */}
          {userRole === "user" && (
            <>
              <NavItem>
                <NavLink to="/empresa">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <rect width="12" height="9" x="6" y="12" />
                  </svg>
                  <span>Empresa</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/productos">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                    <path d="M2 7h20" />
                  </svg>
                  <span>Productos</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/dispositivo">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="12" x2="12" y1="9" y2="15" />
                    <line x1="9" x2="15" y1="12" y2="12" />
                  </svg>
                  <span>Dispositivo IoT</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/perfil">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>Perfil</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <CartLink to="/carrito">
                  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span>Carrito ({cart.length})</span>
                </CartLink>
              </NavItem>
            </>
          )}
        </NavList>
      </Nav>
      <RightSection>
        {userName && <WelcomeText>Bienvenido, {userName}</WelcomeText>}
        <LogoutButton onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar Sesión</span>
        </LogoutButton>
      </RightSection>
    </HeaderWrapper>
  );
};

// Estilos con styled-components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(36, 40, 50, 1);
  background-image: linear-gradient(
    139deg,
    rgba(36, 40, 50, 1) 0%,
    rgba(36, 40, 50, 1) 0%,
    rgba(37, 28, 40, 1) 100%
  );
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const BrandLink = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #bd89ff;
  }
`;

const Nav = styled.nav`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7e8590;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
  }
`;

const CartLink = styled(NavLink)`
  color: #bd89ff;
  
  svg {
    stroke: #bd89ff;
  }
  
  &:hover {
    color: #FFFFFF;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  font-weight: normal;
  color: #7e8590;
  margin: 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: transparent;
  color: #7e8590;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
  }
`;

export default Header;