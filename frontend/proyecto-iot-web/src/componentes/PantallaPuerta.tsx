import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mqtt from 'mqtt';
import axios from 'axios';

interface Registro {
  _id: string;
  mensaje: string;
  descripcion: string;
  fecha: string;
  tipo: string; // Added 'tipo' property
}

const PantallaPuerta: React.FC = () => {
  // Estado del sistema
  const [systemState, setSystemState] = useState({
    doorStatus: 'Cerrada',
    connectionStatus: 'Conectando...',
    presenceStatus: 'No detectado',
    rfidStatus: 'Esperando tarjeta...',
    alarmStatus: 'Normal',
    pirCount: 0,
    magneticSensor: 'Cerrado',
    pinStatus: 'No ingresado',
    loading: false,
    error: '',
    lastRFID: '',
    alarmHistory: [] as string[],
    lastPinAttempt: '',
    lastUpdate: new Date().toISOString(),
    lastAlarmState: 'Normal',
    alarmTriggered: false
  });

  // Estado para registros
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loadingRegistros, setLoadingRegistros] = useState(true);
  const [errorRegistros, setErrorRegistros] = useState('');

  // Configuración MQTT
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'warning' | 'error'} | null>(null);
  
  // Refs
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPirNotificationRef = useRef<number>(0);

  // Configuración MQTT
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

// Función para obtener registros desde la API - Versión corregida
const fetchRegistros = async () => {
  try {
    setLoadingRegistros(true);
    setErrorRegistros('');
    
    // Primero intenta con la ruta preferida
    try {
      const response = await axios.get<Registro[]>('http://localhost:8082/api/registros/ultimos');
      if (response.status === 200) {
        setRegistros(response.data);
        
        // Procesar alarmas para el historial
        const alarmEvents = response.data
          .filter(reg => reg.tipo === 'alarma') // Filtra por tipo en lugar de por mensaje
          .map(reg => `${new Date(reg.fecha).toLocaleTimeString()}: ${reg.mensaje}`)
          .slice(0, 5);
        
        setSystemState(prev => ({
          ...prev,
          alarmHistory: alarmEvents
        }));
        
        return; // Salir si tuvo éxito
      }
    } catch (primaryError) {
      console.log('Intento con /ultimos falló, probando con /get');
    }

    // Si falla, intenta con la ruta alternativa
    const response = await axios.get<Registro[]>('http://localhost:8082/api/registros/get');
    setRegistros(response.data);
    
    // Procesar alarmas para el historial
    const alarmEvents = response.data
      .filter(reg => reg.tipo === 'alarma')
      .map(reg => `${new Date(reg.fecha).toLocaleTimeString()}: ${reg.mensaje}`)
      .slice(0, 5);
    
    setSystemState(prev => ({
      ...prev,
      alarmHistory: alarmEvents
    }));

  } catch (err: any) {
    console.error("Error al cargar registros:", err);
    
    let errorMessage = 'Error al cargar registros';
    if (err.response) {
      console.error("Detalles del error:", err.response.data);
      errorMessage = err.response.data.message || errorMessage;
    }
    
    setErrorRegistros(errorMessage);
  } finally {
    setLoadingRegistros(false);
  }
};
  // Mostrar notificación
  const showNotification = (message: string, type: 'info' | 'warning' | 'error', duration = 3000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    setNotification({ message, type });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // Manejar acciones de la puerta
  const handleDoorAction = async (action: 'abrir' | 'cerrar') => {
    if (!client || systemState.loading) return;

    setSystemState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      await new Promise<void>((resolve, reject) => {
        client.publish(
          MQTT_CONFIG.topics.command,
          action,
          { qos: 1 },
          (err) => err ? reject(err) : resolve()
        );
      });

      setSystemState(prev => ({
        ...prev,
        loading: false
      }));

    } catch (err: any) {
      setSystemState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al enviar comando'
      }));
      showNotification('Error al enviar comando', 'error');
    }
  };

  // Configuración MQTT al montar el componente
  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options);

    mqttClient.on('connect', () => {
      setSystemState(prev => ({ ...prev, connectionStatus: 'Conectado', error: '' }));
      
      // Suscripción a topics
      Object.values(MQTT_CONFIG.topics).forEach(topic => {
        mqttClient.subscribe(topic, { qos: 1 });
      });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString().trim();
      if (!msg) return;

      const now = new Date();
      const updateState = (updates: Partial<typeof systemState>) => {
        setSystemState(prev => ({
          ...prev,
          ...updates,
          lastUpdate: now.toISOString()
        }));
      };

      try {
        switch (topic) {
          case MQTT_CONFIG.topics.doorStatus:
            const newStatus = msg === 'open' ? 'Abierta' : 'Cerrada';
            updateState({ doorStatus: newStatus });

            if (newStatus === 'Abierta') {
              setTimeLeft(10);
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
            break;
            
          case MQTT_CONFIG.topics.rfid:
            const rfid = msg || 'Desconocido';
            updateState({
              rfidStatus: `Tarjeta detectada: ${rfid}`,
              lastRFID: rfid
            });
            
            break;
            
          case MQTT_CONFIG.topics.pir:
            const count = parseInt(msg) || 0;
            const presence = count > 0 ? 'Presencia detectada' : 'No detectado';
            updateState({
              pirCount: count,
              presenceStatus: presence
            });
            
            const now = Date.now();
            if (count > 0 && (now - lastPirNotificationRef.current > 5000)) {
              lastPirNotificationRef.current = now;
              showNotification(`Movimiento detectado`, 'info', 2000);
            }
            break;
            
          case MQTT_CONFIG.topics.alarm:
            const alarmState = msg === 'activada' ? 'ALARMA ACTIVADA!' : 'Normal';
            
            if (systemState.lastAlarmState !== alarmState) {
              if (alarmState === 'ALARMA ACTIVADA!') {
                updateState({
                  alarmStatus: alarmState,
                  lastAlarmState: alarmState,
                  alarmTriggered: true
                });
                
                showNotification('¡ALARMA ACTIVADA!', 'error', 3000);
                
                if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
                alarmTimeoutRef.current = setTimeout(() => {
                  setSystemState(prev => ({
                    ...prev,
                    alarmTriggered: false
                  }));
                }, 3000);
              } else if (systemState.alarmStatus === 'ALARMA ACTIVADA!') {
                updateState({
                  alarmStatus: alarmState,
                  lastAlarmState: alarmState,
                  alarmTriggered: false
                });
              }
            }
            break;
            
          case MQTT_CONFIG.topics.magnetic:
            const sensorState = msg === '1' ? 'Abierto' : 'Cerrado';
            updateState({ magneticSensor: sensorState });
            break;
            
          case MQTT_CONFIG.topics.pin:
            updateState({
              pinStatus: msg ? 'PIN ingresado: ****' : 'No ingresado',
              lastPinAttempt: msg
            });
            
            break;
            
          case MQTT_CONFIG.topics.system:
            updateState({
              connectionStatus: msg === 'online' ? 'Conectado' : 'Desconectado'
            });
            break;
        }
      } catch (error) {
        console.error(`Error procesando mensaje de ${topic}:`, error);
      }
    });

    mqttClient.on('error', (err) => {
      setSystemState(prev => ({
        ...prev,
        connectionStatus: 'Error de conexión',
        error: err.message
      }));
      showNotification(`Error de conexión: ${err.message}`, 'error');
    });

    setClient(mqttClient);

    // Cargar registros iniciales y configurar intervalo
    fetchRegistros();
    const interval = setInterval(fetchRegistros, 15000);

    return () => {
      if (mqttClient.connected) mqttClient.end();
      clearInterval(interval);
    };
  }, []);

  // Estilos
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
      width: '800px',
      maxWidth: '95%',
      textAlign: 'center' as const,
      position: 'relative' as const,
      border: systemState.alarmTriggered ? '3px solid red' : 'none',
      transition: 'border 0.3s ease'
    },
    statusSection: {
      margin: '15px 0',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #eee'
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: '10px',
      paddingBottom: '5px',
      borderBottom: '1px solid #ddd',
      color: '#333'
    },
    statusItem: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '10px 0',
      alignItems: 'center'
    },
    statusLabel: {
      fontWeight: 'bold',
      color: '#555'
    },
    statusValue: {
      textAlign: 'right' as const,
      maxWidth: '60%',
      wordBreak: 'break-word' as const
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      margin: '25px 0'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s',
      ':hover': {
        backgroundColor: '#45a049'
      }
    },
    closeButton: {
      padding: '12px 24px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s',
      ':hover': {
        backgroundColor: '#d32f2f'
      }
    },
    disabledButton: {
      padding: '12px 24px',
      backgroundColor: '#cccccc',
      color: '#666666',
      border: 'none',
      borderRadius: '5px',
      cursor: 'not-allowed',
      fontSize: '16px'
    },
    notification: (type: 'info' | 'warning' | 'error') => ({
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      backgroundColor: type === 'error' ? '#ff4444' : type === 'warning' ? '#ffbb33' : '#4CAF50',
      color: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      animation: 'fadeIn 0.3s'
    }),
    alarmStatus: {
      active: {
        color: 'red',
        fontWeight: 'bold',
        animation: 'blink 1s infinite'
      },
      normal: {
        color: 'green'
      }
    },
    history: {
      fontSize: '12px',
      textAlign: 'left' as const,
      marginTop: '10px',
      color: '#666',
      maxHeight: '100px',
      overflowY: 'auto' as const,
      padding: '5px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px'
    },
    timeLeft: {
      color: '#E91E63',
      fontWeight: 'bold'
    },
    lastUpdate: {
      fontSize: '10px',
      color: '#999',
      textAlign: 'right' as const,
      marginTop: '10px'
    },
    registrosContainer: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
      marginTop: '20px',
      borderTop: '1px solid #eee',
      paddingTop: '20px'
    },
    registrosTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center' as const
    },
    registroItem: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      textAlign: 'left' as const,
      borderLeft: '4px solid #4CAF50'
    },
    registroMensaje: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
    },
    registroDescripcion: {
      fontSize: '12px',
      color: '#6c757d',
      marginBottom: '8px',
    },
    registroFecha: {
      fontSize: '11px',
      color: '#495057',
      textAlign: 'right' as const,
    },
    errorText: {
      color: '#dc3545',
      textAlign: 'center' as const,
      padding: '10px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Notificación flotante */}
      {notification && (
        <div style={styles.notification(notification.type)}>
          {notification.message}
          {notification.type === 'error' && (
            <span style={{ marginLeft: '10px', fontSize: '20px' }}>⚠️</span>
          )}
        </div>
      )}
      
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Control de Puerta IoT</h2>

        {/* Botón de Abrir Puerta */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleDoorAction('abrir')}
            disabled={systemState.doorStatus === 'Abierta' || systemState.loading}
            style={systemState.doorStatus === 'Abierta' ? styles.disabledButton : styles.button}
          >
            {systemState.loading ? 'Enviando...' : 'Abrir Puerta'}
          </button>
        </div>

        {/* Sección de Estado General */}
        <div style={styles.statusSection}>
          <h3 style={styles.sectionTitle}>Estado del Sistema</h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Conexión:</span>
            <span style={styles.statusValue}>{systemState.connectionStatus}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Estado Puerta:</span>
            <span style={styles.statusValue}>{systemState.doorStatus}</span>
          </div>
          {timeLeft !== null && systemState.doorStatus === 'Abierta' && (
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Cierre automático en:</span>
              <span style={{ ...styles.statusValue, ...styles.timeLeft }}>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Sección de Seguridad */}
        <div style={styles.statusSection}>
          <h3 style={styles.sectionTitle}>Seguridad</h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Sensor Magnético:</span>
            <span style={styles.statusValue}>{systemState.magneticSensor}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Estado Alarma:</span>
            <span style={{
              ...styles.statusValue,
              ...(systemState.alarmStatus === 'ALARMA ACTIVADA!' 
                ? styles.alarmStatus.active 
                : styles.alarmStatus.normal)
            }}>
              {systemState.alarmStatus}
              {systemState.alarmStatus === 'ALARMA ACTIVADA!' && ' 🔔'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>PIN:</span>
            <span style={styles.statusValue}>
              {systemState.pinStatus.includes('ingresado') 
                ? 'PIN ingresado: ****' 
                : systemState.pinStatus}
            </span>
          </div>
          {systemState.alarmHistory.length > 0 && (
            <div style={styles.history}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Últimas alarmas:</div>
              {systemState.alarmHistory.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Sensores */}
        <div style={styles.statusSection}>
          <h3 style={styles.sectionTitle}>Sensores</h3>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Presencia:</span>
            <span style={styles.statusValue}>
              {systemState.presenceStatus} 
              {systemState.pirCount > 0 && ` (${systemState.pirCount})`}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>RFID:</span>
            <span style={styles.statusValue}>
              {systemState.rfidStatus.replace('Tarjeta detectada: ', '')}
            </span>
          </div>
          {systemState.lastRFID && (
            <div style={{ ...styles.history, marginTop: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Último RFID:</div>
              <div>{systemState.lastRFID}</div>
            </div>
          )}
        </div>

        {/* Sección de Registros */}
        <div style={styles.registrosContainer}>
          <h3 style={styles.registrosTitle}>Últimos Eventos</h3>
          
          {loadingRegistros ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Cargando registros...
            </div>
          ) : errorRegistros ? (
            <div style={styles.errorText}>
              {errorRegistros}
            </div>
          ) : registros.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '10px', color: '#6c757d' }}>
              No hay registros disponibles
            </div>
          ) : (
            registros.slice(0, 5).map((registro) => (
              <div key={registro._id} style={styles.registroItem}>
                <div style={styles.registroMensaje}>{registro.mensaje}</div>
                <div style={styles.registroDescripcion}>{registro.descripcion}</div>
                <div style={styles.registroFecha}>
                  {new Date(registro.fecha).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Última actualización */}
        <div style={styles.lastUpdate}>
          Última actualización: {new Date(systemState.lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Estilos globales */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default PantallaPuerta;