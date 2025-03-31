import React, { useEffect } from "react";

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-entry');
      elements.forEach(el => el.classList.add('animated'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-content animate-entry">
        <div className="admin-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,13.6 14.1,15.3 12,15.3C9.9,15.3 8.2,13.6 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M7,18V10.6C5.8,11.8 5,13.5 5,15.4C5,16.3 5.2,17.2 5.5,18H7M17,18H18.5C18.8,17.2 19,16.3 19,15.4C19,13.5 18.2,11.8 17,10.6V18Z" />
          </svg>
        </div>
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Bienvenido, administrador</p>
        <div className="admin-decoration"></div>
      </div>

      <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .admin-container::before {
          content: '';
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

        .admin-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 90%;
        }

        .admin-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(92, 107, 192, 0.2);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s ease-out;
        }

        .admin-icon svg {
          width: 40px;
          height: 40px;
          fill: url(#admin-gradient);
        }

        .admin-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 15px rgba(165, 180, 252, 0.3);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out 0.1s;
        }

        .admin-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out 0.2s;
        }

        .admin-decoration {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          margin: 2rem auto 0;
          border-radius: 2px;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: center;
          transition: all 0.6s ease-out 0.3s;
        }

        .animate-entry.animated {
          .admin-icon {
            opacity: 1;
            transform: scale(1);
          }
          .admin-title, .admin-subtitle {
            opacity: 1;
            transform: translateY(0);
          }
          .admin-decoration {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .admin-content:hover {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .admin-icon:hover {
          animation: iconFloat 3s ease-in-out infinite;
        }
      `}</style>

      {/* Definición del gradiente para el icono */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="admin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AdminDashboard;