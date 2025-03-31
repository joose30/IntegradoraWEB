import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

const PantallaPerfilUsuario: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<User>("http://localhost:8082/api/users/usuario", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
        setError("No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserData();
  };

  const updateUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8082/api/users/usuario",
        {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Datos actualizados correctamente.");
      setError("");
    } catch (err) {
      console.error("Error al actualizar los datos del usuario:", err);
      setError("No se pudieron actualizar los datos.");
      setSuccessMessage("");
    } finally {
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
        <p className="premium-loading-text">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="particle-background"></div>
      
      <div className="premium-card profile-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Perfil</span> de Usuario
          </h1>
          <div className="title-decoration"></div>
        </div>

        {error && (
          <div className="error-message-container">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="success-message-container">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>{successMessage}</p>
          </div>
        )}

        <div className="profile-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
              </svg>
            </div>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Nombre"
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
              </svg>
            </div>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Apellido"
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Correo Electrónico"
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Teléfono"
              required
            />
          </div>

          <button type="submit" className="profile-button" disabled={loading}>
            {loading ? (
              <span className="button-spinner"></span>
            ) : (
              <>
                Guardar Cambios
                <svg className="button-icon" viewBox="0 0 24 24">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
              </>
            )}
          </button>
        </form>
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
          margin-bottom: 2rem;
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

        .profile-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(92, 107, 192, 0.2);
          border-radius: 50%;
          padding: 1rem;
        }

        .profile-icon svg {
          width: 60px;
          height: 60px;
          fill: #5c6bc0;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .input-icon svg {
          width: 100%;
          height: 100%;
          fill: rgba(255, 255, 255, 0.6);
        }

        .form-input {
          padding: 0.8rem 1rem 0.8rem 3rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.3);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .profile-button {
          padding: 1rem;
          background: linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .profile-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(92, 107, 192, 0.4);
        }

        .profile-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        .error-message-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.8rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .success-message-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.8rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          color: #10b981;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .error-icon, .success-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
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

        /* Animations */
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PantallaPerfilUsuario;