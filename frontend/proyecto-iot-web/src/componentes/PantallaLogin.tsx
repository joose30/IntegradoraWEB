import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginResponse {
  message: string;
  name: string;
  role: string;
  token: string;
}

const PantallaLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Efecto para las partículas
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = Math.floor(window.innerWidth * window.innerHeight / 10000);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        if (ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.body.removeChild(canvas);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8082/api/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email);

      if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
        window.location.reload();
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message || "Credenciales incorrectas");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="loading-text">Iniciando sesión...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="header-container">
          <h1 className="login-title">
            <span className="title-highlight">Iniciar</span> sesión
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

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="login-button">
            Ingresar
            <svg className="button-icon" viewBox="0 0 24 24">
              <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6z"/>
            </svg>
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="footer-link">Regístrate aquí</a>
          </p>
          <p className="footer-text">
            ¿Olvidaste tu contraseña?{" "}
            <a href="/recover-password" className="footer-link">Recuperar contraseña</a>
          </p>
        </div>
      </div>

      <style>{`
        .login-container {
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

        .login-card {
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

        .login-card::before {
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

        .login-title {
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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-input {
          padding: 0.8rem 1rem;
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

        .login-button {
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

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(92, 107, 192, 0.4);
        }

        .button-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .footer-text {
          margin: 0.5rem 0;
        }

        .footer-link {
          color: #a5b4fc;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #818cf8;
          text-decoration: underline;
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

        .error-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .spinner {
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

        .loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.25rem;
          letter-spacing: 1px;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default PantallaLogin;

// Removed unused and incorrect rgba function definition.
