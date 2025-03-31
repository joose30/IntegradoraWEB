"use client"

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PantallaRecuperarContraseña: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Limpia el mensaje anterior
    setIsSuccess(false); // Limpia el estado de éxito anterior

    try {
      const response = await axios.post<{ message: string }>(
        "http://localhost:8082/api/users/recover-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message); // Establece el mensaje de éxito
      setIsSuccess(true); // Marca el estado como exitoso
    } catch (error: any) {
      setIsSuccess(false); // Marca el estado como fallido
      if (error.response) {
        setMessage(error.response.data.message || "Error al procesar la solicitud");
      } else if (error.request) {
        setMessage("No se recibió respuesta del servidor");
      } else {
        setMessage("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false); // Detiene el estado de carga
    }
  };

  return (
    <div className="premium-container">
      <div className="particle-background"></div>
      
      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Recuperar</span> Contraseña
          </h1>
          <div className="title-decoration"></div>
        </div>

        <form onSubmit={handleRecoverPassword} className="premium-form">
          <div className="form-group">
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Correo electrónico"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`premium-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        {message && (
          <div className={`message-container ${isSuccess ? "success" : "error"}`}>
            <svg className="message-icon" viewBox="0 0 24 24">
              {isSuccess ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              )}
            </svg>
            {message}
          </div>
        )}

        <div className="footer-links">
          <button className="text-button" onClick={() => navigate("/recuperar-con-pregunta")}>
            ¿Prefieres recuperar con pregunta secreta?
          </button>
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
          max-width: 500px;
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
          margin-bottom: 2.5rem;
          position: relative;
        }

        .premium-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
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
          margin: 0.5rem auto 1.5rem;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(92, 107, 192, 0.5);
        }

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          width: 20px;
          height: 20px;
          fill: #5c6bc0;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
          font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
          border-color: #5c6bc0;
          box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .premium-button {
          margin-top: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #5c6bc0, #3949ab);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(92, 107, 192, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .premium-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(92, 107, 192, 0.4);
        }

        .premium-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .premium-button.loading {
          color: transparent;
        }

        .loading-dots {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .message-container {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          font-weight: 500;
          animation: fadeIn 0.3s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .message-container.error {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .message-container.success {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .message-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .footer-links {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .text-button {
          background: none;
          border: none;
          color: #a5b4fc;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          padding: 0.5rem;
        }

        .text-button:hover {
          color: #818cf8;
          text-decoration: underline;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .premium-card {
            padding: 2rem;
          }
          
          .premium-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .premium-container {
            padding: 1rem;
          }
          
          .premium-card {
            padding: 1.5rem;
          }
          
          .premium-title {
            font-size: 1.5rem;
          }
          
          .form-input {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
          }
          
          .input-icon {
            left: 0.75rem;
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default PantallaRecuperarContraseña;