import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mqtt from 'mqtt';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface Registro {
  _id: string;
  mensaje: string;
  descripcion: string;
  fecha: string;
  tipo: string;
}

// Componentes Widget internos
const SystemStatusWidget: React.FC<{
  connectionStatus: string;
  doorStatus: string;
  styles: any;
}> = ({ connectionStatus, doorStatus, styles }) => (
  <div style={{ ...styles.widget, backgroundColor: '#e3f2fd' }}>
    <h3 style={{ ...styles.widgetTitle, color: '#1e88e5' }}>
      <FontAwesomeIcon icon={faEye} style={{ ...styles.icon, color: '#1e88e5' }} />
      Estado del Sistema
    </h3>
    <div style={styles.widgetContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Conexión:</span>
        <span>{connectionStatus}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>Estado Puerta:</span>
        <span>{doorStatus}</span>
      </div>
    </div>
  </div>
);

const SecurityWidget: React.FC<{
  magneticSensor: string;
  pinStatus: string;
  lastPinAttempt: string;
  showPin: boolean;
  setShowPin: React.Dispatch<React.SetStateAction<boolean>>;
  styles: any;
}> = ({ magneticSensor, pinStatus, lastPinAttempt, showPin, setShowPin, styles }) => (
  <div style={{ ...styles.widget, backgroundColor: '#fbe9e7' }}>
    <h3 style={{ ...styles.widgetTitle, color: '#d84315' }}>
      <FontAwesomeIcon icon={faEyeSlash} style={{ ...styles.icon, color: '#d84315' }} />
      Seguridad
    </h3>
    <div style={styles.widgetContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Sensor Magnético:</span>
        <span>{magneticSensor}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>PIN:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{showPin ? lastPinAttempt : '****'}</span>
          <button
            onClick={() => setShowPin(!showPin)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#d84315',
              fontSize: '16px'
            }}
            title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
          >
            <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SensorsWidget: React.FC<{
  presenceStatus: string;
  pirCount: number;
  rfidStatus: string;
  lastRFID: string;
  styles: any;
}> = ({ presenceStatus, pirCount, rfidStatus, lastRFID, styles }) => (
  <div style={{ ...styles.widget, backgroundColor: '#e8f5e9' }}>
    <h3 style={{ ...styles.widgetTitle, color: '#43a047' }}>
      <FontAwesomeIcon icon={faEye} style={{ ...styles.icon, color: '#43a047' }} />
      Sensores
    </h3>
    <div style={styles.widgetContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>Presencia:</span>
        <span>
          {presenceStatus} {pirCount > 0 && `(${pirCount})`}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>RFID:</span>
        <span>{rfidStatus}</span>
      </div>
    </div>
  </div>
);

const EventLogWidget: React.FC<{
  registros: Registro[];
  loading: boolean;
  error: string;
}> = ({ registros, loading, error }) => (
  <div style={{ 
    maxHeight: '300px', 
    overflowY: 'auto', 
    marginTop: '20px', 
    borderTop: '1px solid #eee', 
    paddingTop: '20px' 
  }}>
    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
      Últimos Eventos
    </h3>
    
    {loading ? (
      <div style={{ textAlign: 'center', padding: '20px' }}>Cargando registros...</div>
    ) : error ? (
      <div style={{ color: '#dc3545', textAlign: 'center', padding: '10px' }}>{error}</div>
    ) : registros.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '10px', color: '#6c757d' }}>No hay registros disponibles</div>
    ) : (
      registros.slice(0, 5).map((registro) => (
        <div key={registro._id} style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          textAlign: 'left',
          borderLeft: registro.tipo === 'alarma' ? '4px solid #dc3545' : '4px solid #4CAF50'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
            {registro.mensaje}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
            {registro.descripcion}
          </div>
          <div style={{ fontSize: '11px', color: '#495057', textAlign: 'right' }}>
            {new Date(registro.fecha).toLocaleString()}
          </div>
        </div>
      ))
    )}
  </div>
);

const NotificationWidget: React.FC<{ 
  message: string; 
  type: 'info' | 'warning' | 'error'; 
}> = ({ message, type }) => (
  <div style={{
    position: 'fixed',
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
  }}>
    {message}
    {type === 'error' && <span style={{ marginLeft: '10px', fontSize: '20px' }}>⚠️</span>}
  </div>
);

const AlarmAlertWidget: React.FC<{ 
  alarmEvent: Registro | null; 
}> = ({ alarmEvent }) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 2000,
    maxWidth: '80%',
    textAlign: 'center',
    animation: 'pulse 0.5s alternate infinite'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>¡ALARMA ACTIVADA!</div>
    <div style={{ fontSize: '18px', marginBottom: '15px' }}>{alarmEvent?.mensaje}</div>
    <div style={{ fontSize: '14px', opacity: 0.8 }}>
      {alarmEvent?.descripcion}<br />
      {alarmEvent?.fecha && new Date(alarmEvent.fecha).toLocaleString()}
    </div>
  </div>
);

const PantallaPuerta: React.FC = () => {
  // Estado del sistema
  const [systemState, setSystemState] = useState({
    doorStatus: 'Cerrada',
    connectionStatus: 'Conectando...',
    presenceStatus: 'No detectado',
    rfidStatus: 'Esperando tarjeta...',
    pirCount: 0,
    magneticSensor: 'Cerrado',
    pinStatus: 'No ingresado',
    loading: false,
    error: '',
    lastRFID: '',
    alarmHistory: [] as string[],
    lastPinAttempt: '',
    lastUpdate: new Date().toISOString(),
    lastAlarmState: 'Normal'
  });

  // Estado para mostrar/ocultar PIN
  const [showPin, setShowPin] = useState(false);

  // Estado para registros
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loadingRegistros, setLoadingRegistros] = useState(true);
  const [errorRegistros, setErrorRegistros] = useState('');
  const [showAlarmAlert, setShowAlarmAlert] = useState(false);
  const [alarmEvent, setAlarmEvent] = useState<Registro | null>(null);

  // Configuración MQTT
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'warning' | 'error'} | null>(null);
  
  // Refs
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousRegistrosRef = useRef<Registro[]>([]);

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

  // Función para obtener registros desde la API
  const fetchRegistros = async () => {
    try {
      setLoadingRegistros(true);
      setErrorRegistros('');
      
      // Intenta con ambas rutas posibles para mayor compatibilidad
      const endpoints = ['/api/registros/ultimos', '/api/registros/get'];
      let response;
      
      for (const endpoint of endpoints) {
        try {
          response = await axios.get<Registro[]>(`http://localhost:8082${endpoint}`);
          if (response.status === 200) break;
        } catch (err) {
          console.warn(`Error con ${endpoint}:`, err);
        }
      }

      if (!response) {
        throw new Error('No se pudo obtener registros de ningún endpoint');
      }

      // Verificar si hay nuevas alarmas
      const newAlarms = response.data.filter(
        reg => reg.tipo === 'alarma' && 
        !previousRegistrosRef.current.some(
          prevReg => prevReg._id === reg._id
        )
      );

      if (newAlarms.length > 0) {
        setAlarmEvent(newAlarms[0]);
        setShowAlarmAlert(true);
        setTimeout(() => setShowAlarmAlert(false), 5000);
      }

      setRegistros(response.data);
      previousRegistrosRef.current = response.data;

    } catch (err: any) {
      console.error("Error al cargar registros:", err);
      setErrorRegistros(err.message || 'Error al cargar registros');
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
            break;
            
          case MQTT_CONFIG.topics.alarm:
            const alarmState = msg === 'activada' ? 'ALARMA ACTIVADA!' : 'Normal';
            
            if (systemState.lastAlarmState !== alarmState) {
              updateState({
                lastAlarmState: alarmState
              });
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
      flexDirection: 'column' as const,
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    titleCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '800px',
      textAlign: 'center' as const,
      marginBottom: '20px'
    },
    widgetsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '1200px'
    },
    widget: {
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      transition: 'transform 0.3s, box-shadow 0.3s',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }
    },
    widgetTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    widgetContent: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6'
    },
    controlsContainer: {
      marginTop: '20px',
      textAlign: 'center' as const
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
    disabledButton: {
      padding: '12px 24px',
      backgroundColor: '#cccccc',
      color: '#666666',
      border: 'none',
      borderRadius: '5px',
      cursor: 'not-allowed',
      fontSize: '16px'
    },
    lastUpdateContainer: {
      marginTop: '20px',
      textAlign: 'center' as const
    },
    lastUpdate: {
      fontSize: '12px',
      color: '#999'
    },
    icon: {
      fontSize: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Notificación flotante */}
      {notification && (
        <NotificationWidget 
          message={notification.message} 
          type={notification.type} 
        />
      )}

      {/* Alerta de alarma */}
      {showAlarmAlert && alarmEvent && (
        <AlarmAlertWidget 
          alarmEvent={alarmEvent}
        />
      )}

      {/* Título principal */}
      <div style={styles.titleCard}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Control de Puerta IoT</h2>
      </div>

      {/* Contenedor de widgets */}
      <div style={styles.widgetsContainer}>
        {/* Widget de Estado del Sistema */}
        <div style={styles.widget}>
          <SystemStatusWidget 
            connectionStatus={systemState.connectionStatus}
            doorStatus={systemState.doorStatus}
            styles={styles}
          />
        </div>

        {/* Widget de Seguridad */}
        <div style={styles.widget}>
          <SecurityWidget 
            magneticSensor={systemState.magneticSensor}
            pinStatus={systemState.pinStatus}
            lastPinAttempt={systemState.lastPinAttempt}
            showPin={showPin}
            setShowPin={setShowPin}
            styles={styles}
          />
        </div>

        {/* Widget de Sensores */}
        <div style={styles.widget}>
          <SensorsWidget 
            presenceStatus={systemState.presenceStatus}
            pirCount={systemState.pirCount}
            rfidStatus={systemState.rfidStatus}
            lastRFID={systemState.lastRFID}
            styles={styles}
          />
        </div>

        {/* Widget de Registros */}
        <div style={styles.widget}>
          <EventLogWidget 
            registros={registros}
            loading={loadingRegistros}
            error={errorRegistros}
          />
        </div>
      </div>

      {/* Controles */}
      <div style={styles.controlsContainer}>
        <button
          onClick={() => handleDoorAction('abrir')}
          disabled={systemState.doorStatus === 'Abierta' || systemState.loading}
          style={systemState.doorStatus === 'Abierta' ? styles.disabledButton : styles.button}
        >
          {systemState.loading ? 'Enviando...' : 'Abrir Puerta'}
        </button>
      </div>

      {/* Última actualización */}
      <div style={styles.lastUpdateContainer}>
        <div style={styles.lastUpdate}>
          Última actualización: {new Date(systemState.lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Estilos globales */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            from { transform: translate(-50%, -50%) scale(1); }
            to { transform: translate(-50%, -50%) scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default PantallaPuerta;