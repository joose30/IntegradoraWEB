import React, { useState } from 'react';
import axios from 'axios';

const PantallaHuella: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegistrarHuella = async () => {
    try {
      setLoading(true);
      setMessage('');
      setSuccess(false);
      
      const response = await axios.get('http://localhost:8082/api/huella/registrar');
      
      setMessage(response.data);
      setSuccess(true);
    } catch (error) {
      console.error('Error al registrar huella:', error);
      setMessage('Error al registrar huella. Por favor, intente nuevamente.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="huella-container">
      <div className="particle-background"></div>
      
      <div className="huella-card">
        <div className="header-container">
          <h1 className="huella-title">
            <span className="title-highlight">Registro de</span> Huella Digital
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="fingerprint-icon-container">
          <div className={`fingerprint-icon ${loading ? 'scanning' : ''} ${success ? 'success' : ''}`}>
            <svg viewBox="0 0 24 24">
              <path d="M17.81 4.16c-1.53-1.53-3.58-2.37-5.76-2.37-2.18 0-4.23.84-5.76 2.37-1.53 1.53-2.37 3.58-2.37 5.76 0 2.18.84 4.23 2.37 5.76 1.53 1.53 3.58 2.37 5.76 2.37 2.18 0 4.23-.84 5.76-2.37 1.53-1.53 2.37-3.58 2.37-5.76 0-2.18-.84-4.23-2.37-5.76zm-1.41 10.15c-1.17 1.17-2.73 1.82-4.39 1.82-1.66 0-3.22-.65-4.39-1.82-1.17-1.17-1.82-2.73-1.82-4.39 0-1.66.65-3.22 1.82-4.39 1.17-1.17 2.73-1.82 4.39-1.82 1.66 0 3.22.65 4.39 1.82 1.17 1.17 1.82 2.73 1.82 4.39 0 1.66-.65 3.22-1.82 4.39z"/>
              <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
            </svg>
          </div>
        </div>

        <button 
          className={`huella-button ${loading ? 'loading' : ''}`} 
          onClick={handleRegistrarHuella}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Escaneando...
            </>
          ) : (
            'Iniciar Registro'
          )}
        </button>

        {message && (
          <div className={`message ${success ? 'success' : 'error'}`}>
            <div className="message-icon">
              {success ? (
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
            </div>
            <p>{message}</p>
          </div>
        )}

        <div className="instructions">
          <p>Coloca tu dedo en el sensor de huellas para registrarte</p>
        </div>
      </div>

      <style>{`
        .huella-container {
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

        .huella-card {
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
          text-align: center;
        }

        .huella-card::before {
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

        .huella-title {
          font-size: 2rem;
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

        .fingerprint-icon-container {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }

        .fingerprint-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(30, 30, 60, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #5c6bc0;
          transition: all 0.3s ease;
          position: relative;
        }

        .fingerprint-icon svg {
          width: 60px;
          height: 60px;
          fill: #a5b4fc;
          transition: all 0.3s ease;
        }

        .fingerprint-icon.scanning {
          animation: pulse 2s infinite;
          border-color: #2ecc71;
        }

        .fingerprint-icon.scanning svg {
          fill: #2ecc71;
        }

        .fingerprint-icon.success {
          border-color: #2ecc71;
          background: rgba(46, 204, 113, 0.1);
        }

        .fingerprint-icon.success svg {
          fill: #2ecc71;
        }

        .huella-button {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .huella-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          background: linear-gradient(135deg, #6d7bd1 0%, #4a5ac2 100%);
        }

        .huella-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .huella-button.loading {
          background: linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%);
        }

        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        .message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .message.success {
          background: rgba(46, 204, 113, 0.2);
          border: 1px solid rgba(46, 204, 113, 0.3);
          color: #a5d6a7;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .message-icon svg {
          width: 20px;
          height: 20px;
        }

        .message.success .message-icon svg {
          fill: #2ecc71;
        }

        .message.error .message-icon svg {
          fill: #ef4444;
        }

        .instructions {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PantallaHuella;