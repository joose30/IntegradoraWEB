import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Mision {
  _id: string;
  contenido: string;
}

interface Vision {
  _id: string;
  contenido: string;
}

interface Valor {
  _id: string;
  contenido: string;
}

interface Politica {
  _id: string;
  descripcion: string;
}

const EmpresaInfoPublica: React.FC = () => {
  const [misions, setMisions] = useState<Mision[]>([]);
  const [visions, setVisions] = useState<Vision[]>([]);
  const [valors, setValors] = useState<Valor[]>([]);
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [misionRes, visionRes, valorRes, politicaRes] = await Promise.all([
          axios.get<Mision[]>('http://localhost:8082/api/empresa/misions'),
          axios.get<Vision[]>('http://localhost:8082/api/empresa/visions'),
          axios.get<Valor[]>('http://localhost:8082/api/empresa/valors'),
          axios.get<Politica[]>('http://localhost:8082/api/empresa/politicas'),
        ]);

        setMisions(misionRes.data);
        setVisions(visionRes.data);
        setValors(valorRes.data);
        setPoliticas(politicaRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Error al cargar los datos. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleMouseEnter = (section: string) => {
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  if (loading) {
    return (
      <div className="premium-loading-container">
        <div className="premium-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="premium-loading-text">Cargando información corporativa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-icon-container">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h3 className="error-title">¡Error!</h3>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="particle-background"></div>
      
      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Información</span> Corporativa
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="sections-grid">
          {/* Sección Misión */}
          <div 
            className={`premium-section mission-section ${activeSection === 'mision' ? 'active' : ''} ${hoveredSection === 'mision' ? 'hover' : ''}`}
            onClick={() => toggleSection('mision')}
            onMouseEnter={() => handleMouseEnter('mision')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="section-header">
              <div className="icon-container mission-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              <h2 className="section-title">Misión</h2>
              <div className={`toggle-arrow ${activeSection === 'mision' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </div>
            </div>
            
            {activeSection === 'mision' && (
              <div className="section-content">
                {misions.length > 0 ? (
                  misions.map(mision => (
                    <p key={mision._id} className="section-text">{mision.contenido}</p>
                  ))
                ) : (
                  <p className="section-text">No hay misión disponible</p>
                )}
              </div>
            )}
          </div>

          {/* Sección Visión */}
          <div 
            className={`premium-section vision-section ${activeSection === 'vision' ? 'active' : ''} ${hoveredSection === 'vision' ? 'hover' : ''}`}
            onClick={() => toggleSection('vision')}
            onMouseEnter={() => handleMouseEnter('vision')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="section-header">
              <div className="icon-container vision-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
              <h2 className="section-title">Visión</h2>
              <div className={`toggle-arrow ${activeSection === 'vision' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </div>
            </div>
            
            {activeSection === 'vision' && (
              <div className="section-content">
                {visions.length > 0 ? (
                  visions.map(vision => (
                    <p key={vision._id} className="section-text">{vision.contenido}</p>
                  ))
                ) : (
                  <p className="section-text">No hay visión disponible</p>
                )}
              </div>
            )}
          </div>

          {/* Sección Valores */}
          <div 
            className={`premium-section values-section ${activeSection === 'valor' ? 'active' : ''} ${hoveredSection === 'valor' ? 'hover' : ''}`}
            onClick={() => toggleSection('valor')}
            onMouseEnter={() => handleMouseEnter('valor')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="section-header">
              <div className="icon-container values-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                </svg>
              </div>
              <h2 className="section-title">Valores</h2>
              <div className={`toggle-arrow ${activeSection === 'valor' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </div>
            </div>
            
            {activeSection === 'valor' && (
              <div className="section-content">
                {valors.length > 0 ? (
                  valors.map(valor => (
                    <p key={valor._id} className="section-text">{valor.contenido}</p>
                  ))
                ) : (
                  <p className="section-text">No hay valores disponibles</p>
                )}
              </div>
            )}
          </div>

          {/* Sección Políticas */}
          <Link 
            to="/politicasPublico" 
            className={`premium-section policies-section ${hoveredSection === 'policies' ? 'hover' : ''}`}
            onMouseEnter={() => handleMouseEnter('policies')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="section-header">
              <div className="icon-container policies-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  <path d="M11 7h2v2h-2zM11 11h2v6h-2z"/>
                </svg>
              </div>
              <h2 className="section-title">Políticas</h2>
              <div className="external-link-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
              </div>
            </div>
            <div className="section-footer">
              <span className="section-badge">Ver todas</span>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .premium-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
        }

        .particle-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
          background-size: 2px 2px;
          opacity: 0.5;
          z-index: 0;
        }

        .premium-card {
          position: relative;
          width: 100%;
          max-width: 1200px;
          background: rgba(26, 26, 46, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1;
          overflow: hidden;
        }

        .premium-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(92, 107, 192, 0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
          z-index: -1;
        }

        .header-container {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .premium-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          display: inline-block;
        }

        .title-highlight {
          font-weight: 800;
          text-shadow: 0 0 10px rgba(165, 180, 252, 0.5);
        }

        .title-decoration {
          height: 4px;
          width: 100px;
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          margin: 0 auto;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(92, 107, 192, 0.5);
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .premium-section {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .premium-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, transparent 100%);
          z-index: -1;
        }

        .premium-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: rgba(92, 107, 192, 0.3);
        }

        .premium-section.hover {
          transform: translateY(-3px);
        }

        .premium-section.active {
          background: rgba(30, 30, 60, 0.8);
          border-color: rgba(92, 107, 192, 0.5);
        }

        .mission-section {
          border-top: 3px solid #5c6bc0;
        }

        .vision-section {
          border-top: 3px solid #3949ab;
        }

        .values-section {
          border-top: 3px solid #8e24aa;
        }

        .policies-section {
          border-top: 3px solid #26a69a;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .icon-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .mission-icon {
          background: rgba(92, 107, 192, 0.2);
        }

        .vision-icon {
          background: rgba(57, 73, 171, 0.2);
        }

        .values-icon {
          background: rgba(142, 36, 170, 0.2);
        }

        .policies-icon {
          background: rgba(38, 166, 154, 0.2);
        }

        .icon-container svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .mission-icon svg {
          fill: #5c6bc0;
        }

        .vision-icon svg {
          fill: #3949ab;
        }

        .values-icon svg {
          fill: #8e24aa;
        }

        .policies-icon svg {
          fill: #26a69a;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          flex-grow: 1;
          text-align: left;
        }

        .toggle-arrow {
          transition: transform 0.3s ease;
        }

        .toggle-arrow.active {
          transform: rotate(180deg);
        }

        .toggle-arrow svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .external-link-icon svg {
          width: 20px;
          height: 20px;
          fill: #26a69a;
        }

        .section-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease-out;
        }

        .section-text {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .section-footer {
          display: flex;
          justify-content: flex-end;
        }

        .section-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .mission-section .section-badge {
          background: rgba(92, 107, 192, 0.2);
          color: #a5b4fc;
        }

        .vision-section .section-badge {
          background: rgba(57, 73, 171, 0.2);
          color: #818cf8;
        }

        .values-section .section-badge {
          background: rgba(142, 36, 170, 0.2);
          color: #d8b4fe;
        }

        .policies-section .section-badge {
          background: rgba(38, 166, 154, 0.2);
          color: #5eead4;
        }

        /* Loading styles */
        .premium-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .premium-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }

        .spinner-circle {
          width: 15px;
          height: 15px;
          margin: 0 5px;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .spinner-circle:nth-child(1) {
          background: #5c6bc0;
          animation-delay: 0s;
        }

        .spinner-circle:nth-child(2) {
          background: #3949ab;
          animation-delay: 0.2s;
        }

        .spinner-circle:nth-child(3) {
          background: #8e24aa;
          animation-delay: 0.4s;
        }

        .premium-loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.25rem;
          letter-spacing: 1px;
        }

        /* Error styles */
        .premium-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .error-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          width: 40px;
          height: 40px;
          fill: #ef4444;
        }

        .error-title {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 1rem;
        }

        .error-message {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .retry-button {
          background: rgba(239, 68, 68, 0.2);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .retry-button:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default EmpresaInfoPublica;