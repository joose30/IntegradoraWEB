import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Politica {
  id: string;
  descripcion: string;
}

const PoliticasPage: React.FC = () => {
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/empresa/politicas');
        setPoliticas(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error('Error al cargar políticas:', err);
        setError('Error al cargar las políticas');
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
  }, []);

  if (loading) return <div style={styles.loading}>Cargando políticas...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Políticas de la Empresa</h1>
      
      <div style={styles.list}>
        {politicas.map(politica => (
          <div key={politica.id} style={styles.item}>
            <p>{politica.descripcion}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate(-1)} 
        style={styles.button}
      >
        Volver
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '30px',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#f4f4f9',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  item: {
    padding: '15px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  itemHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  button: {
    marginTop: '30px',
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
    transform: 'scale(1.05)',
  },
  loading: {
    textAlign: 'center',
    color: '#3498db',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
};

export default PoliticasPage;