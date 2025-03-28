import React, { useState } from 'react';
import axios from 'axios';

const PantallaHuella: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistrarHuella = async () => {
    try {
      setLoading(true); // Mostrar animación de carga
      const response = await axios.get('http://localhost:8082/api/huella/registrar'); // Cambia la IP según tu configuración
      setMessage(response.data); // Mostrar el mensaje recibido del backend
    } catch (error) {
      console.error('Error al registrar huella:', error);
      setMessage('Error al registrar huella.');
    } finally {
      setLoading(false); // Ocultar animación de carga
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registro de Huella</h1>

      <div style={styles.iconContainer}>
        <i className="fas fa-fingerprint" style={styles.icon}></i>
      </div>

      <button
        onClick={handleRegistrarHuella}
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrar Huella'}
      </button>

      {loading && <div className="spinner"></div>}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '150px',
    color: '#1E1E1E',
  },
  button: {
    backgroundColor: '#2ECC71',
    color: '#FFF',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    marginTop: '15px',
    fontSize: '16px',
    color: '#333',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
};

export default PantallaHuella;

/* Move this keyframes block to a CSS file or use a styled-components approach */