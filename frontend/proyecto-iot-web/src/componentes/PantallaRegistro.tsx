"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PantallaRegistro: React.FC = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [questions, setQuestions] = useState<{ id: string; pregunta: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<{ id: string; pregunta: string }[]>("http://localhost:8082/api/users/secret-questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas secretas:", error);
        setMessage("Error al cargar las preguntas secretas");
        setIsSuccess(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (!secretQuestion || !secretAnswer) {
      setMessage("Debes seleccionar una pregunta secreta y proporcionar una respuesta");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8082/api/users/register", {
        name,
        lastName,
        surname,
        phone,
        email,
        password,
        secretQuestion,
        secretAnswer,
      });

      if (response.status === 201) {
        setMessage("Usuario registrado exitosamente");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      setIsSuccess(false);
      if (error.response) {
        setMessage(error.response.data.message || "Error al registrar el usuario");
      } else {
        setMessage("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-container">
      <div className="particle-background"></div>
      
      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Registro</span> de Usuario
          </h1>
          <div className="title-decoration"></div>
        </div>

        <form onSubmit={handleRegister} className="premium-form">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Apellido paterno</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ingresa tu apellido paterno"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Apellido materno</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Ingresa tu apellido materno"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ingresa tu teléfono"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#5c6bc0">
                    <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#5c6bc0">
                    <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirma tu contraseña"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#5c6bc0">
                    <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#5c6bc0">
                    <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Pregunta secreta</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <select
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Selecciona una pregunta</option>
                {questions.map((q) => (
                  <option key={q.id} value={q.pregunta}>
                    {q.pregunta}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Respuesta secreta</label>
            <div className="input-container">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z"/>
              </svg>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                placeholder="Ingresa tu respuesta"
                required
                className="form-input"
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
              "Registrarse"
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
          <button className="text-button" onClick={() => navigate("/login")}>
            ¿Ya tienes una cuenta? Inicia sesión
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

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
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

        .form-input:disabled {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.5);
        }

        .form-input:focus {
          border-color: #5c6bc0;
          box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a5b4fc'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
          padding-right: 2.5rem;
          color: #ffffff;
        }

        select.form-input option {
          background-color: #1a1a2e;
          color: #ffffff;
          padding: 10px;
        }

        select.form-input:focus {
          color: #ffffff;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
          text-align: left;
          padding-left: 1rem;
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
          background-color: rgba(40, 167, 69, 0.15);
          color: #28a745;
          border: 1px solid rgba(40, 167, 69, 0.3);
          font-weight: 600;
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

export default PantallaRegistro;