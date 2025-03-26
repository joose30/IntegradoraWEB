import React, { useState } from 'react';
import axios from 'axios';

const RegistrarHuella: React.FC = () => {
    const [fingerprint, setFingerprint] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtén el token del usuario
            const response = await axios.post<{ message: string }>(
                'http://localhost:8082/api/users/register-fingerprint',
                { fingerprint },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Envía el token en el encabezado
                    },
                }
            );

            setMessage(response.data.message);
        } catch (error: any) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error al conectar con el servidor.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Registrar Huella</h1>
            <input
                type="text"
                placeholder="Introduce tu huella"
                value={fingerprint}
                onChange={(e) => setFingerprint(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleRegister} style={styles.button}>
                Registrar
            </button>
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
    input: {
        width: '300px',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
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
    buttonHover: {
        backgroundColor: '#28A745',
    },
    message: {
        marginTop: '15px',
        fontSize: '16px',
        color: '#333',
    },
};

export default RegistrarHuella;