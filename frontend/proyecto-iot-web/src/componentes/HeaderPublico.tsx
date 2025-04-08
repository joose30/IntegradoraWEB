import React from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

// En HeaderPublico.tsx
const HeaderPublico: React.FC = () => {
  return (
    <HeaderWrapper>
      <LeftSection>
        <BrandLink to="/">
          SEGURIX
        </BrandLink>
      </LeftSection>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink to="/login">
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="#7e8590" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Empieza ahora</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/empresaPublico">
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="#7e8590" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <rect width="12" height="9" x="6" y="12" />
              </svg>
              <span>Empresa</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/productosPublico">
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="#7e8590" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
              <span>Productos</span>
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
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
  
  svg {
    stroke: #7e8590;
  }
  
  &:hover {
    color: #FFFFFF;
  }
`;

export default HeaderPublico;