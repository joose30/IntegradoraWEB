import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mqtt from 'mqtt';

const PantallaPuerta: React.FC = () => {
  const [systemState, setSystemState] = useState({
    doorStatus: 'Cerrada',
    connectionStatus: 'Desconectado',
    presenceStatus: 'No detectado',
    rfidStatus: 'Esperando tarjeta...',
    alarmStatus: 'Normal',
    pirCount: 0,
    magneticSensor: 'Cerrado',
    pinStatus: 'No ingresado',
    loading: false,
    error: '',
    lastRFID: '',
    alarmHistory: [] as string[]
  });

  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const MQTT_CONFIG = {
    broker: 'wss://cff146d73f214b82bb19d3ae4f6a3e7d.s1.eu.hivemq.cloud:8884/mqtt',
    options: {
      username: 'PuertaIOT',
      password: '1234abcD',
      clientId: `web-client-${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 3000
    },
    topics: {
      command: 'valoresPuerta/comandos',
      doorStatus: 'valoresPuerta/estadoPuerta',
      rfid: 'valoresPuerta/valorRFID',
      pir: 'valoresPuerta/conteoPIR',
      alarm: 'valoresPuerta/alarma',
      magnetic: 'valoresPuerta/sensorMagnetico',
      pin: 'valoresPuerta/PIN',
      system: 'valoresPuerta/status'
    }
  };

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options);

    mqttClient.on('connect', () => {
      setSystemState(prev => ({ ...prev, connectionStatus: 'Conectado' }));
      // Suscribirse a todos los topics
      Object.values(MQTT_CONFIG.topics).forEach(topic => {
        mqttClient.subscribe(topic, { qos: 1 });
      });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString();
      const now = new Date().toLocaleTimeString();
      
      if (topic === MQTT_CONFIG.topics.doorStatus) {
        const newStatus = msg === 'open' ? 'Abierta' : 'Cerrada';
        setSystemState(prev => ({
          ...prev,
          doorStatus: newStatus
        }));
        
        if (newStatus === 'Abierta') {
          setTimeLeft(10); // 10 segundos para cerrar automático
          const timer = setInterval(() => {
            setTimeLeft(prev => {
              if (prev === null) return null;
              if (prev <= 1) {
                clearInterval(timer);
                handleDoorAction('cerrar');
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setTimeLeft(null);
        }
      }
      else if (topic === MQTT_CONFIG.topics.rfid) {
        const rfid = msg || 'Desconocido';
        setSystemState(prev => ({
          ...prev,
          rfidStatus: `Tarjeta detectada: ${rfid}`,
          lastRFID: rfid
        }));
        setNotification(`Tarjeta RFID detectada: ${rfid}`);
        setTimeout(() => setNotification(null), 3000);
      }
      else if (topic === MQTT_CONFIG.topics.pir) {
        const count = parseInt(msg) || 0;
        const presence = count > 0 ? 'Presencia detectada' : 'No detectado';
        setSystemState(prev => ({
          ...prev,
          pirCount: count,
          presenceStatus: presence
        }));
        if (count > 0) {
          setNotification(`Movimiento detectado (${count} veces)`);
          setTimeout(() => setNotification(null), 3000);
        }
      }
      else if (topic === MQTT_CONFIG.topics.alarm) {
        const alarmState = msg === 'activada' ? 'ALARMA ACTIVADA!' : 'Normal';
        setSystemState(prev => ({
          ...prev,
          alarmStatus: alarmState,
          alarmHistory: [...prev.alarmHistory, `${now}: ${alarmState}`].slice(-5)
        }));
        if (alarmState === 'ALARMA ACTIVADA!') {
          setNotification('¡ALARMA ACTIVADA! Verifique inmediatamente');
        }
      }
      else if (topic === MQTT_CONFIG.topics.magnetic) {
        const sensorState = msg === '1' ? 'Abierto' : 'Cerrado';
        setSystemState(prev => ({
          ...prev,
          magneticSensor: sensorState
        }));
      }
      else if (topic === MQTT_CONFIG.topics.pin) {
        setSystemState(prev => ({
          ...prev,
          pinStatus: msg ? `PIN ingresado: ${msg}` : 'No ingresado'
        }));
      }
      else if (topic === MQTT_CONFIG.topics.system) {
        setSystemState(prev => ({
          ...prev,
          connectionStatus: msg === 'online' ? 'Conectado' : 'Desconectado'
        }));
      }
    });

    mqttClient.on('error', (err) => {
      setSystemState(prev => ({
        ...prev,
        connectionStatus: 'Error de conexión',
        error: err.message
      }));
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient && mqttClient.connected) {
        mqttClient.end();
      }
    };
  }, []);

  const handleDoorAction = async (action: 'abrir' | 'cerrar') => {
    if (!client || systemState.loading) return;

    setSystemState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      await new Promise<void>((resolve, reject) => {
        client.publish(
          MQTT_CONFIG.topics.command,
          action,
          { qos: 1 },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      setSystemState(prev => ({
        ...prev,
        loading: false
      }));

    } catch (err) {
      setSystemState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al enviar comando'
      }));
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '400px',
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative'
    },
    statusSection: {
      margin: '15px 0',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#f8f9fa'
    },
    statusItem: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '8px 0'
    },
    statusLabel: {
      fontWeight: 'bold'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      margin: '25px 0'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s'
    },
    disabledButton: {
      padding: '10px 20px',
      backgroundColor: '#cccccc',
      color: '#666666',
      border: 'none',
      borderRadius: '5px',
      cursor: 'not-allowed',
      fontSize: '16px'
    },
    alarmActive: {
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
      animation: 'blink 1s infinite'
    },
    notification: {
      position: 'fixed' as 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    },
    alarmNotification: {
      backgroundColor: '#ff4444',
      animation: 'blink 1s infinite'
    },
    linkContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '25px'
    },
    link: {
      color: '#2196F3',
      textDecoration: 'none',
      fontSize: '14px'
    },
    history: {
      fontSize: '12px',
      textAlign: 'left' as 'left',
      marginTop: '10px',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      {notification && (
        <div 
          style={{
            ...styles.notification,
            ...(notification.includes('ALARMA') ? styles.alarmNotification : {})
          }}
        >
          {notification}
        </div>
      )}
      
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Control de Puerta IoT</h2>
        
        {/* Sección de Estado General */}
        <div style={styles.statusSection}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
            Estado del Sistema
          </h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Conexión:</span>
            <span>{systemState.connectionStatus}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Estado Puerta:</span>
            <span>{systemState.doorStatus}</span>
          </div>
          {timeLeft !== null && systemState.doorStatus === 'Abierta' && (
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Cierre automático en:</span>
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Sección de Seguridad */}
        <div style={styles.statusSection}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
            Seguridad
          </h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Sensor Magnético:</span>
            <span>{systemState.magneticSensor}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Estado Alarma:</span>
            <span style={systemState.alarmStatus === 'ALARMA ACTIVADA!' ? { color: 'red', fontWeight: 'bold' } : {}}>
              {systemState.alarmStatus}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>PIN:</span>
            <span>{systemState.pinStatus}</span>
          </div>
          {systemState.alarmHistory.length > 0 && (
            <div style={styles.history}>
              <div>Historial alarmas:</div>
              {systemState.alarmHistory.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Sensores */}
        <div style={styles.statusSection}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
            Sensores
          </h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Presencia:</span>
            <span>{systemState.presenceStatus} ({systemState.pirCount})</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>RFID:</span>
            <span>{systemState.rfidStatus}</span>
          </div>
          {systemState.lastRFID && (
            <div style={styles.history}>
              Último RFID: {systemState.lastRFID}
            </div>
          )}
        </div>

        {/* Mensajes de error */}
        {systemState.error && (
          <div style={{ color: 'red', margin: '10px 0' }}>{systemState.error}</div>
        )}

        {/* Controles */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleDoorAction('abrir')}
            disabled={systemState.doorStatus === 'Abierta' || systemState.loading}
            style={systemState.doorStatus === 'Abierta' ? styles.disabledButton : styles.button}
          >
            {systemState.loading ? 'Enviando...' : 'Abrir Puerta'}
          </button>
        </div>

        {/* Navegación */}
        <div style={styles.linkContainer}>
          <Link to="/configuracion" style={styles.link}>Configuración</Link>
          <Link to="/registros" style={styles.link}>Registros</Link>
        </div>
      </div>
    </div>
  );
};

export default PantallaPuerta;