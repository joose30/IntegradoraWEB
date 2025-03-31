import React from "react";

const PantallaPoliticasPrivacidad: React.FC = () => {
  return (
    <div className="premium-policy-container">
      <div className="particle-background"></div>
      
      <div className="premium-policy-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Política de</span> Privacidad
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              Recopilación de Información
            </h2>
            <p className="section-text">
              Recopilamos información personal que usted nos proporciona voluntariamente al registrarse en 
              nuestro sistema, contactarnos a través de formularios o comunicarse con nuestro equipo de soporte. 
              Esta información puede incluir nombre, correo electrónico, número telefónico y datos necesarios 
              para la prestación de nuestros servicios.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
              Uso de la Información
            </h2>
            <p className="section-text">
              La información recopilada se utiliza exclusivamente para: (a) proveer y mejorar nuestros servicios, 
              (b) personalizar la experiencia del usuario, (c) comunicarnos con usted sobre servicios y 
              actualizaciones, y (d) cumplir con requisitos legales y regulatorios.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
                </svg>
              </div>
              Protección de Datos
            </h2>
            <p className="section-text">
              Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger sus datos 
              personales contra accesos no autorizados, alteración, divulgación o destrucción. Utilizamos 
              protocolos de encriptación SSL y almacenamiento seguro para garantizar la confidencialidad de su 
              información.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">
              <div className="section-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  <path d="M11 7h2v2h-2zM11 11h2v6h-2z"/>
                </svg>
              </div>
              Cookies y Tecnologías Similares
            </h2>
            <p className="section-text">
              Utilizamos cookies y tecnologías similares para mejorar la funcionalidad de nuestro sitio web, 
              analizar el tráfico y personalizar contenido. Usted puede gestionar sus preferencias de cookies 
              a través de la configuración de su navegador, aunque esto podría afectar ciertas funcionalidades 
              del sitio.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .premium-policy-container {
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

        .premium-policy-card {
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

        .premium-policy-card::before {
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

        .policy-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .policy-section {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .policy-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, transparent 100%);
          z-index: -1;
        }

        .policy-section:hover {
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

export default PantallaPoliticasPrivacidad;