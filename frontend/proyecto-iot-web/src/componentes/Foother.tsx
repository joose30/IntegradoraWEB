import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerSection}>
          <h3 
            style={{...styles.footerTitle, cursor: 'pointer'}} 
            onClick={handleTermsClick}
          >
            Términos y condiciones
          </h3>
          <p style={styles.footerText}>
            Consulta nuestros términos y condiciones para más información.
          </p>
        </div>
        <div style={styles.footerSection}>
          <h3 
            style={{...styles.footerTitle, cursor: 'pointer'}} 
            onClick={handlePrivacyClick}
          >
            Privacidad
          </h3>
          <p style={styles.footerText}>
            Respetamos tu privacidad. Conoce nuestra política de privacidad.
          </p>
        </div>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>CONTÁCTANOS</h3>
          <p style={styles.footerText}>
            {address}<br />
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=segurixmx@gmail.com&su=Consulta&body=Hola,%20me%20gustaría%20obtener%20más%20información."
              target="_blank"
              rel="noopener noreferrer"
              style={styles.emailLink}
            >
              segurixmx@gmail.com
            </a><br />
            +52 774 545 8510
          </p>
        </div>
      </div>
    </footer>
  );
};

// Componentes para las nuevas páginas
export const TerminosCondiciones: React.FC = () => {
  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.title}>Términos y Condiciones</h1>
      <div style={pageStyles.content}>
        <h2>1. Aceptación de los Términos</h2>
        <p>Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos y condiciones.</p>
        
        <h2>2. Uso del Sitio</h2>
        <p>Este sitio está destinado para uso informativo y de gestión de usuarios. No está permitido el uso malintencionado.</p>
        
        <h2>3. Propiedad Intelectual</h2>
        <p>Todos los contenidos de este sitio son propiedad de Segurix MX y están protegidos por derechos de autor.</p>
        
        <h2>4. Limitación de Responsabilidad</h2>
        <p>Segurix MX no se hace responsable por daños derivados del uso de este sitio web.</p>
      </div>
    </div>
  );
};

export const PoliticaPrivacidad: React.FC = () => {
  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.title}>Política de Privacidad</h1>
      <div style={pageStyles.content}>
        <h2>1. Recopilación de Información</h2>
        <p>Recopilamos información personal que usted nos proporciona voluntariamente al registrarse o contactarnos.</p>
        
        <h2>2. Uso de la Información</h2>
        <p>La información recopilada se utiliza para proveer nuestros servicios y mejorar la experiencia del usuario.</p>
        
        <h2>3. Protección de Datos</h2>
        <p>Implementamos medidas de seguridad para proteger sus datos personales contra accesos no autorizados.</p>
        
        <h2>4. Cookies</h2>
        <p>Utilizamos cookies para mejorar la funcionalidad de nuestro sitio web. Puede gestionarlas en la configuración de su navegador.</p>
      </div>
    </div>
  );
};

// Estilos comunes
const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: '20px',
    textAlign: 'center',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  footerSection: {
    flex: 1,
    margin: '0 10px',
    minWidth: '250px',
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  footerText: {
    fontSize: '14px',
    margin: 0,
  },
  emailLink: {
    color: '#FFFFFF',
    textDecoration: 'none',
    // Hover styles should be handled in a CSS file or with a CSS-in-JS library
  },
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
  },
  content: {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default Footer;