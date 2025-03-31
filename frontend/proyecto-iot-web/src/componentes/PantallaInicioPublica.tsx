import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const icon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface FAQ {
  _id: string;
  pregunta: string;
  respuesta: string;
}

const PantallaInicioPublica: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [error, setError] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const huejutlaLocation: L.LatLngExpression = [21.1416751, -98.4201608];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoadingFaqs(true);
        const response = await axios.get<FAQ[]>("http://localhost:8082/api/preguntasFrecuentes");
        setFaqs(response.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar preguntas frecuentes:", err);
        setError("No se pudieron cargar las preguntas frecuentes");
        setFaqs([
          { 
            _id: "1", 
            pregunta: "¿Para qué sirve Segurix?", 
            respuesta: "Segurix es una plataforma para gestionar y controlar dispositivos IoT de seguridad." 
          },
          { 
            _id: "2", 
            pregunta: "¿Cómo conectar mi dispositivo IoT?", 
            respuesta: "Ve a la sección de dispositivos y sigue las instrucciones de configuración." 
          },
        ]);
      } finally {
        setLoadingFaqs(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFaqExpansion = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleCardHover = (id: string | null) => {
    setHoveredCard(id);
  };

  if (loadingFaqs) {
    return (
      <div className="premium-loading-screen">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p className="loading-text">Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-screen">
        <div className="error-icon">
          <svg viewBox="0 0 24 24">
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
        <div className="hero-section">
          <div className="hero-image-container">
            <img
              src="https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Dispositivos IoT de seguridad"
              className="hero-image"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-highlight">Segurix</span> Seguridad IoT
            </h1>
            <p className="hero-subtitle">
              La solución inteligente para controlar y asegurar tus dispositivos IoT
            </p>
            <div className="hero-decoration"></div>
          </div>
        </div>

        <div className="map-section">
          <div className="section-header">
            <div className="section-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h2 className="section-title">Nuestra Ubicación</h2>
          </div>
          <div className="map-container">
            <MapContainer 
              center={huejutlaLocation} 
              zoom={13} 
              className="map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={huejutlaLocation} icon={icon}>
                <Popup className="map-popup">
                  <div className="popup-content">
                    <h3 className="popup-title">Huejutla de Reyes, Hidalgo</h3>
                    <p className="popup-text">Sede principal de Segurix</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="section-header">
            <div className="section-icon">
              <svg viewBox="0 0 24 24">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
              </svg>
            </div>
            <h2 className="section-title">Preguntas Frecuentes</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={faq._id}
                className={`faq-card ${expandedFaq === faq._id ? 'active' : ''} ${hoveredCard === faq._id ? 'hover' : ''}`}
                onClick={() => toggleFaqExpansion(faq._id)}
                onMouseEnter={() => handleCardHover(faq._id)}
                onMouseLeave={() => handleCardHover(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="faq-header">
                  <h3 className="faq-question">{faq.pregunta}</h3>
                  <div className={`toggle-icon ${expandedFaq === faq._id ? 'active' : ''}`}>
                    <svg viewBox="0 0 24 24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
                {expandedFaq === faq._id && (
                  <div className="faq-answer">
                    <p>{faq.respuesta}</p>
                    <div className="answer-decoration"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos CSS premium */}
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

        /* Hero Section Styles */
        .hero-section {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          margin-bottom: 3rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .hero-image-container {
          position: relative;
          width: 100%;
          height: 500px;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
          transition: transform 0.5s ease;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(92, 107, 192, 0.8) 0%, rgba(57, 73, 171, 0.6) 100%);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
          padding: 0 2rem;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          background: linear-gradient(90deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .title-highlight {
          font-weight: 900;
          text-shadow: 0 0 15px rgba(165, 180, 252, 0.7);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 400;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }

        .hero-decoration {
          height: 4px;
          width: 100px;
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          margin: 0 auto;
          border-radius: 2px;
          box-shadow: 0 0 15px rgba(92, 107, 192, 0.7);
        }

        /* Map Section Styles */
        .map-section {
          margin-bottom: 3rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(92, 107, 192, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .section-icon svg {
          width: 24px;
          height: 24px;
          fill: #5c6bc0;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .map-container {
          height: 500px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .map-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(92, 107, 192, 0.4);
        }

        .map {
          width: 100%;
          height: 100%;
        }

        .map-popup {
          border-radius: 10px;
          padding: 0;
          overflow: hidden;
        }

        .popup-content {
          padding: 1rem;
        }

        .popup-title {
          font-size: 1rem;
          font-weight: 700;
          color: #5c6bc0;
          margin-bottom: 0.5rem;
        }

        .popup-text {
          font-size: 0.875rem;
          color: #4a5568;
          margin: 0;
        }

        /* FAQ Section Styles */
        .faq-section {
          margin-bottom: 2rem;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .faq-card {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        .faq-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(92, 107, 192, 0.1) 0%, transparent 100%);
          z-index: -1;
        }

        .faq-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: rgba(92, 107, 192, 0.3);
        }

        .faq-card.hover {
          transform: translateY(-3px);
        }

        .faq-card.active {
          background: rgba(30, 30, 60, 0.8);
          border-color: rgba(92, 107, 192, 0.5);
        }

        .faq-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .faq-question {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          flex-grow: 1;
          color: #fff;
        }

        .toggle-icon {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }

        .toggle-icon.active {
          transform: rotate(180deg);
        }

        .toggle-icon svg {
          width: 100%;
          height: 100%;
          fill: #5c6bc0;
        }

        .faq-answer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease-out;
        }

        .faq-answer p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .answer-decoration {
          height: 3px;
          width: 50px;
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          border-radius: 3px;
          margin-top: 1rem;
        }

        /* Loading Screen */
        .premium-loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .loading-animation {
          display: flex;
          margin-bottom: 2rem;
        }

        .loading-circle {
          width: 15px;
          height: 15px;
          margin: 0 8px;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .loading-circle:nth-child(1) {
          background: #5c6bc0;
          animation-delay: 0s;
        }

        .loading-circle:nth-child(2) {
          background: #3949ab;
          animation-delay: 0.2s;
        }

        .loading-circle:nth-child(3) {
          background: #8e24aa;
          animation-delay: 0.4s;
        }

        .loading-text {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 1px;
        }

        /* Error Screen */
        .premium-error-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .error-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .error-icon svg {
          width: 40px;
          height: 40px;
          fill: #ef4444;
        }

        .error-title {
          font-size: 1.75rem;
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

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
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

export default PantallaInicioPublica;