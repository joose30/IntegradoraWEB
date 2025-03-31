import React from "react";

const PantallaTerminosYCondiciones: React.FC = () => {
  return (
    <div className="premium-terms-container">
      <div className="particle-background"></div>
      
      <div className="premium-terms-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Términos y</span> Condiciones
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              Aceptación de los Términos
            </h2>
            <p className="section-text">
              Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos y condiciones de uso, 
              todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las 
              leyes locales aplicables.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              Uso del Sitio
            </h2>
            <p className="section-text">
              Este sitio está destinado para uso informativo y de gestión de usuarios. Queda estrictamente 
              prohibido cualquier uso malintencionado, incluyendo pero no limitado a: acceso no autorizado a 
              sistemas, modificación de contenido, o cualquier actividad que pueda dañar la plataforma.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              Propiedad Intelectual
            </h2>
            <p className="section-text">
              Todos los contenidos de este sitio (textos, gráficos, logos, imágenes, etc.) son propiedad 
              exclusiva de Segurix MX o sus licenciantes y están protegidos por leyes de derechos de autor 
              internacionales.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              Limitación de Responsabilidad
            </h2>
            <p className="section-text">
              Segurix MX no será responsable por ningún daño (incluyendo, sin limitación, daños por pérdida 
              de datos o beneficio, o debido a interrupción del negocio) que resulte del uso o la imposibilidad 
              de usar los materiales en este sitio web.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .premium-terms-container {
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

        .premium-terms-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          background: rgba(26, 26, 46, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1;
          overflow: hidden;
        }

        .premium-terms-card::before {
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

        .terms-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .terms-section {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .terms-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, transparent 100%);
          z-index: -1;
        }

        .terms-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: rgba(92, 107, 192, 0.3);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          color: #a5b4fc;
          border-bottom: 2px solid rgba(92, 107, 192, 0.5);
          padding-bottom: 0.5rem;
        }

        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          background: rgba(92, 107, 192, 0.2);
        }

        .section-icon svg {
          width: 20px;
          height: 20px;
          fill: #5c6bc0;
        }

        .section-text {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
          text-align: justify;
          margin: 0;
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
      `}</style>
    </div>
  );
};

export default PantallaTerminosYCondiciones;