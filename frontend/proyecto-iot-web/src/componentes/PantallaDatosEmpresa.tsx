import React, { useState, useEffect } from "react";
import axios from "axios";

const PantallaDatosEmpresa: React.FC = () => {
  const API_BASE = "http://localhost:8082/api";

  const [formData, setFormData] = useState({
    mision: "",
    vision: "",
    valor: "",
    politica: "",
  });

  const [misionsList, setMisionsList] = useState<any[]>([]);
  const [visionsList, setVisionsList] = useState<any[]>([]);
  const [valoresList, setValoresList] = useState<any[]>([]);
  const [politicasList, setPoliticasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [misionesRes, visionesRes, valoresRes, politicasRes] = await Promise.all([
          axios.get<any[]>(`${API_BASE}/empresa/misions`),
          axios.get<any[]>(`${API_BASE}/empresa/visions`),
          axios.get<any[]>(`${API_BASE}/empresa/valors`),
          axios.get<any[]>(`${API_BASE}/empresa/politicas`),
        ]);
        setMisionsList(misionesRes.data);
        setVisionsList(visionesRes.data);
        setValoresList(valoresRes.data);
        setPoliticasList(politicasRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos de la empresa");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all([
        formData.mision &&
          axios.post(`${API_BASE}/empresa/misions`, { contenido: formData.mision }),
        formData.vision &&
          axios.post(`${API_BASE}/empresa/visions`, { contenido: formData.vision }),
        formData.valor &&
          axios.post(`${API_BASE}/empresa/valors`, { contenido: formData.valor }),
        formData.politica &&
          axios.post(`${API_BASE}/empresa/politicas`, { descripcion: formData.politica }),
      ]);

      // Recarga los datos listados
      const [misionesRes, visionesRes, valoresRes, politicasRes] = await Promise.all([
        axios.get<any[]>(`${API_BASE}/empresa/misions`),
        axios.get<any[]>(`${API_BASE}/empresa/visions`),
        axios.get<any[]>(`${API_BASE}/empresa/valors`),
        axios.get<any[]>(`${API_BASE}/empresa/politicas`),
      ]);
      setMisionsList(misionesRes.data);
      setVisionsList(visionesRes.data);
      setValoresList(valoresRes.data);
      setPoliticasList(politicasRes.data);

      setFormData({
        mision: "",
        vision: "",
        valor: "",
        politica: "",
      });

      // Mostrar mensaje de éxito
      setSuccessMessage("¡Datos guardados correctamente!");
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar después de 3 segundos

      setLoading(false);
    } catch (error) {
      console.error("Error insertando datos:", error);
      setError("Hubo un error al guardar los datos");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="premium-loading-container">
        <div className="premium-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="premium-loading-text">Cargando datos empresariales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-icon-container">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
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
            <span className="title-highlight">Datos</span> Empresariales
          </h1>
          <div className="title-decoration"></div>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Secciones de formulario */}
        {/* Misión */}
        <div className="form-section">
          <h3 className="section-title">Misión</h3>
          <input
            type="text"
            className="form-input"
            placeholder="Ingrese la misión de la empresa"
            value={formData.mision}
            onChange={(e) => setFormData({ ...formData, mision: e.target.value })}
          />
          {misionsList.length > 0 && (
            <div className="list-container">
              <h4 className="list-title">Misiones registradas:</h4>
              {misionsList.map((item) => (
                <div key={item._id} className="list-item">
                  <p>{item.contenido}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visión */}
        <div className="form-section">
          <h3 className="section-title">Visión</h3>
          <input
            type="text"
            className="form-input"
            placeholder="Ingrese la visión de la empresa"
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          />
          {visionsList.length > 0 && (
            <div className="list-container">
              <h4 className="list-title">Visiones registradas:</h4>
              {visionsList.map((item) => (
                <div key={item._id} className="list-item">
                  <p>{item.contenido}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Valores */}
        <div className="form-section">
          <h3 className="section-title">Valores</h3>
          <input
            type="text"
            className="form-input"
            placeholder="Ingrese los valores de la empresa"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          />
          {valoresList.length > 0 && (
            <div className="list-container">
              <h4 className="list-title">Valores registrados:</h4>
              {valoresList.map((item) => (
                <div key={item._id} className="list-item">
                  <p>{item.contenido}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Políticas */}
        <div className="form-section">
          <h3 className="section-title">Políticas</h3>
          <input
            type="text"
            className="form-input"
            placeholder="Ingrese las políticas de la empresa"
            value={formData.politica}
            onChange={(e) => setFormData({ ...formData, politica: e.target.value })}
          />
          {politicasList.length > 0 && (
            <div className="list-container">
              <h4 className="list-title">Políticas registradas:</h4>
              {politicasList.map((item) => (
                <div key={item._id} className="list-item">
                  <p>{item.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Guardar Datos
        </button>
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
          max-width: 800px;
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
          margin-bottom: 2rem;
          position: relative;
        }

        .premium-title {
          font-size: 2.2rem;
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

        /* Mensaje de éxito */
        .success-message {
          display: flex;
          align-items: center;
          background: rgba(46, 125, 50, 0.2);
          border: 1px solid rgba(46, 125, 50, 0.3);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease-in-out;
        }

        .success-icon {
          width: 24px;
          height: 24px;
          fill: #4caf50;
          margin-right: 1rem;
        }

        .success-message p {
          margin: 0;
          color: #a5d6a7;
          font-weight: 500;
        }

        .form-section {
          margin-bottom: 2rem;
          background: rgba(30, 30, 60, 0.4);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .form-section:hover {
          border-color: rgba(92, 107, 192, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #a5b4fc;
          display: flex;
          align-items: center;
        }

        .section-title:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #5c6bc0;
          margin-right: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 30, 60, 0.8);
          color: white;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.3);
        }

        .list-container {
          margin-top: 1rem;
          background: rgba(40, 40, 80, 0.4);
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #5c6bc0;
        }

        .list-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .list-item {
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 0.5rem;
          transition: all 0.2s ease;
        }

        .list-item:hover {
          background: rgba(92, 107, 192, 0.1);
        }

        .list-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .list-item p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%);
          color: white;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #6d7bd1 0%, #4a5ac2 100%);
        }

        .submit-button:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }

        .submit-button:focus:not(:active)::after {
          animation: ripple 1s ease-out;
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

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 1;
          }
          20% {
            transform: scale(25, 25);
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
      `}</style>
    </div>
  );
};

export default PantallaDatosEmpresa;