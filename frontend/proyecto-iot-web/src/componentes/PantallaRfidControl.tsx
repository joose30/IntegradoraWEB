import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';

export default function RFIDControlScreen() {
  const [rfidUID, setRfidUID] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isReading, setIsReading] = useState(false);
  const navigate = useNavigate();

  const MQTT_CONFIG = {
    broker: 'wss://cff146d73f214b82bb19d3ae4f6a3e7d.s1.eu.hivemq.cloud:8884/mqtt',
    options: {
      username: 'PuertaIOT',
      password: '1234abcD',
      clientId: `web-client-${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 3000,
    },
    topics: {
      rfid: 'valoresPuerta/valorRFID',
    },
  };

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options);

    mqttClient.on('connect', () => {
      console.log('Conectado a MQTT');
      mqttClient.subscribe(MQTT_CONFIG.topics.rfid, { qos: 1 });
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === MQTT_CONFIG.topics.rfid && isReading) {
        const rfid = message.toString().trim();
        console.log('RFID recibido:', rfid);
        setRfidUID(rfid);
        setAccessGranted(true);
        setIsReading(false);
      }
    });

    mqttClient.on('error', (err) => {
      console.error('Error de conexión MQTT:', err);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient.connected) mqttClient.end();
    };
  }, [isReading]);

  const handleScanRFID = () => {
    if (!client) {
      alert('Cliente MQTT no conectado');
      return;
    }

    setIsReading(true);
    console.log('Esperando datos de RFID...');
  };

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div style={styles.screen}>
      <div style={styles.cardContainer}>
        <div style={styles.topBar}>
          <button onClick={handleReturn} style={styles.backButton}>
            ←
          </button>
        </div>

        <div style={styles.contentContainer}>
          <h2 style={styles.title}>Control RFID</h2>

          {loading ? (
            <div style={styles.loader}>Cargando...</div>
          ) : rfidUID ? (
            <>
              <p style={styles.uidText}>UID: {rfidUID}</p>
              {accessGranted ? (
                <p style={styles.accessGranted}>Acceso Concedido</p>
              ) : (
                <p style={styles.accessDenied}>Acceso Denegado</p>
              )}
            </>
          ) : (
            <p style={styles.promptText}>Presiona el botón para leer RFID</p>
          )}

          <button
            style={styles.scanButton}
            onClick={handleScanRFID}
            disabled={loading}
          >
            {loading ? 'Leyendo...' : 'Leer RFID'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  screen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFE2FF',
    minHeight: '100vh',
    padding: '20px',
  },
  cardContainer: {
    width: '90%',
    maxWidth: '500px',
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E0E0E0',
    marginBottom: '20px',
    paddingBottom: '10px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  backButton: {
    fontSize: '24px',
    color: '#1E1E1E',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  contentContainer: {
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1E1E1E',
  },
  promptText: {
    fontSize: '16px',
    color: '#1E1E1E',
    marginBottom: '20px',
  },
  uidText: {
    fontSize: '18px',
    color: '#1E1E1E',
    marginBottom: '10px',
  },
  accessGranted: {
    fontSize: '20px',
    color: 'green',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  accessDenied: {
    fontSize: '20px',
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  scanButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: '10px',
    padding: '12px 20px',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loader: {
    fontSize: '18px',
    color: '#1E1E1E',
  },
};