import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Footer: React.FC = () => {
  const [address, setAddress] = useState<string>("Cargando dirección...");
  const navigate = useNavigate();

  useEffect(() => {
    // Coordenadas de Huejutla de Reyes, Hidalgo
    const lat = 21.1416751;
    const lng = -98.4201608;

    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const displayName = (response.data as { display_name?: string }).display_name || "Dirección no disponible";
        setAddress(displayName);
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        setAddress("Dirección no disponible");
      }
    };

    fetchAddress();
  }, []);

  const handleTermsClick = () => {
    navigate('/terminos-condiciones');
  };

  const handlePrivacyClick = () => {
    navigate('/politica-privacidad');
  };

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <FooterSectionHeader>
            <FooterIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </FooterIcon>
            <FooterTitle onClick={handleTermsClick}>
              Términos y condiciones
            </FooterTitle>
          </FooterSectionHeader>
          <FooterText>
            Consulta nuestros términos y condiciones para más información.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterSectionHeader>
            <FooterIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </FooterIcon>
            <FooterTitle onClick={handlePrivacyClick}>
              Privacidad
            </FooterTitle>
          </FooterSectionHeader>
          <FooterText>
            Respetamos tu privacidad. Conoce nuestra política de privacidad.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterSectionHeader>
            <FooterIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </FooterIcon>
            <FooterTitle>CONTÁCTANOS</FooterTitle>
          </FooterSectionHeader>
          <FooterText>
            {address}<br />
            <EmailLink
              href="https://mail.google.com/mail/?view=cm&fs=1&to=segurixmx@gmail.com&su=Consulta&body=Hola,%20me%20gustaría%20obtener%20más%20información."
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              segurixmx@gmail.com
            </EmailLink><br />
            <PhoneLink href="tel:+527745458510">
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +52 774 545 8510
            </PhoneLink>
          </FooterText>
        </FooterSection>
      </FooterContent>

      <FooterBottomBar>
        <FooterCopyright>
          © {new Date().getFullYear()} SEGURIX. Todos los derechos reservados.
        </FooterCopyright>
        <SocialLinks>
          <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </SocialLink>
          <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </SocialLink>
          <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </SocialLink>
        </SocialLinks>
      </FooterBottomBar>
    </FooterWrapper>
  );
};

// Componentes para las nuevas páginas
export const TerminosCondiciones: React.FC = () => {
  return (
    <StaticPageContainer>
      <StaticPageTitle>Términos y Condiciones</StaticPageTitle>
      <StaticPageContent>
        <h2>1. Aceptación de los Términos</h2>
        <p>Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos y condiciones.</p>

        <h2>2. Uso del Sitio</h2>
        <p>Este sitio está destinado para uso informativo y de gestión de usuarios. No está permitido el uso malintencionado.</p>

        <h2>3. Propiedad Intelectual</h2>
        <p>Todos los contenidos de este sitio son propiedad de Segurix MX y están protegidos por derechos de autor.</p>

        <h2>4. Limitación de Responsabilidad</h2>
        <p>Segurix MX no se hace responsable por daños derivados del uso de este sitio web.</p>
      </StaticPageContent>
    </StaticPageContainer>
  );
};

export const PoliticaPrivacidad: React.FC = () => {
  return (
    <StaticPageContainer>
      <StaticPageTitle>Política de Privacidad</StaticPageTitle>
      <StaticPageContent>
        <h2>1. Recopilación de Información</h2>
        <p>Recopilamos información personal que usted nos proporciona voluntariamente al registrarse o contactarnos.</p>

        <h2>2. Uso de la Información</h2>
        <p>La información recopilada se utiliza para proveer nuestros servicios y mejorar la experiencia del usuario.</p>

        <h2>3. Protección de Datos</h2>
        <p>Implementamos medidas de seguridad para proteger sus datos personales contra accesos no autorizados.</p>

        <h2>4. Cookies</h2>
        <p>Utilizamos cookies para mejorar la funcionalidad de nuestro sitio web. Puede gestionarlas en la configuración de su navegador.</p>
      </StaticPageContent>
    </StaticPageContainer>
  );
};

// Estilos con styled-components
const FooterWrapper = styled.footer`
  background-color: rgba(36, 40, 50, 1);
  background-image: linear-gradient(
    139deg,
    rgba(36, 40, 50, 1) 0%,
    rgba(36, 40, 50, 1) 0%,
    rgba(37, 28, 40, 1) 100%
  );
  color: #FFFFFF;
  padding: 40px 20px 20px;
  font-family: Arial, sans-serif;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 30px;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 20px;
`;

const FooterSectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const FooterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #7e8590;
  
  svg {
    stroke: #7e8590;
  }
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #7e8590;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #bd89ff;
  }
`;

const FooterText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #7e8590;
  margin: 0;
`;

const EmailLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7e8590;
  text-decoration: none;
  margin: 5px 0;
  transition: color 0.3s;
  
  &:hover {
    color: #bd89ff;
    
    svg {
      stroke: #bd89ff;
    }
  }
  
  svg {
    stroke: #7e8590;
    transition: stroke 0.3s;
  }
`;

const PhoneLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7e8590;
  text-decoration: none;
  margin: 5px 0;
  transition: color 0.3s;
  
  &:hover {
    color: #bd89ff;
    
    svg {
      stroke: #bd89ff;
    }
  }
  
  svg {
    stroke: #7e8590;
    transition: stroke 0.3s;
  }
`;

const FooterBottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(126, 133, 144, 0.2);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  gap: 15px;
`;

const FooterCopyright = styled.p`
  font-size: 14px;
  color: #7e8590;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7e8590;
  transition: color 0.3s;
  
  &:hover {
    color: #bd89ff;
    
    svg {
      stroke: #bd89ff;
    }
  }
  
  svg {
    stroke: #7e8590;
    transition: stroke 0.3s;
  }
`;

// Estilos para las páginas estáticas
const StaticPageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
`;

const StaticPageTitle = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const StaticPageContent = styled.div`
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h2 {
    color: #3949ab;
    margin-top: 25px;
    margin-bottom: 15px;
  }
  
  p {
    margin-bottom: 20px;
  }
`;

export default Footer;