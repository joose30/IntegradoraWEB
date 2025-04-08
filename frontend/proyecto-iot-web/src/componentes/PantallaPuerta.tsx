"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import mqtt from "mqtt"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faDoorOpen, faDoorClosed, faLock, faUnlock, faUser, faIdCard, faBell } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

interface Registro {
  _id: string
  mensaje: string
  descripcion: string
  fecha: string
  tipo: string
}

const DoorStatusIcon: React.FC<{
  doorStatus: string
}> = ({ doorStatus }) => (
  <div className="door-status-container">
    <div className="door-icon-wrapper">
      <FontAwesomeIcon
        icon={doorStatus === "Abierta" ? faDoorOpen : faDoorClosed}
        className={`door-status-icon ${doorStatus === "Abierta" ? "open" : "closed"}`}
      />
    </div>
    <div className="door-status-text">
      {doorStatus === "Abierta" ? "Puerta Abierta" : "Puerta Cerrada"}
    </div>
  </div>
)

const SystemStatusWidget: React.FC<{
  connectionStatus: string
  doorStatus: string
}> = ({ connectionStatus, doorStatus }) => (
  <div className="premium-section system-section">
    <div className="section-header">
      <div className="icon-container">
        <FontAwesomeIcon icon={doorStatus === "Abierta" ? faDoorOpen : faDoorClosed} className="icon" />
      </div>
      <h3 className="section-title">Estado del Sistema</h3>
    </div>
    <div className="section-content">
      <div className="status-item">
        <span className="status-label">Conexión:</span>
        <span className={`status-value ${connectionStatus === "Conectado" ? "connected" : "disconnected"}`}>
          {connectionStatus}
        </span>
      </div>
      <div className="status-item">
        <span className="status-label">Estado Puerta:</span>
        <span className={`status-value ${doorStatus === "Abierta" ? "open" : "closed"}`}>
          {doorStatus}
        </span>
      </div>
    </div>
  </div>
)

const SecurityWidget: React.FC<{
  magneticSensor: string
  pinStatus: string
  lastPinAttempt: string
  showPin: boolean
  setShowPin: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ magneticSensor, pinStatus, lastPinAttempt, showPin, setShowPin }) => (
  <div className="premium-section security-section">
    <div className="section-header">
      <div className="icon-container">
        <FontAwesomeIcon icon={magneticSensor === "Abierto" ? faUnlock : faLock} className="icon" />
      </div>
      <h3 className="section-title">Seguridad</h3>
    </div>
    <div className="section-content">
      <div className="status-item">
        <span className="status-label">Sensor Magnético:</span>
        <span className={`status-value ${magneticSensor === "Abierto" ? "warning" : "safe"}`}>
          {magneticSensor}
        </span>
      </div>
      <div className="status-item">
        <span className="status-label">PIN:</span>
        <div className="pin-container">
          <span>{showPin ? lastPinAttempt : ""}</span>
          <button
            onClick={() => setShowPin(!showPin)}
            className="toggle-pin-button"
            title={showPin ? "Ocultar PIN" : "Mostrar PIN"}
          >
            <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>
    </div>
  </div>
)

const SensorsWidget: React.FC<{
  presenceStatus: string
  pirCount: number
  rfidStatus: string
  lastRFID: string
}> = ({ presenceStatus, pirCount, rfidStatus, lastRFID }) => (
  <div className="premium-section sensors-section">
    <div className="section-header">
      <div className="icon-container">
        <FontAwesomeIcon icon={presenceStatus.includes("detectada") ? faUser : faIdCard} className="icon" />
      </div>
      <h3 className="section-title">Sensores</h3>
    </div>
    <div className="section-content">
      <div className="status-item">
        <span className="status-label">Presencia:</span>
        <span className={`status-value ${presenceStatus.includes("detectada") ? "active" : "inactive"}`}>
          {presenceStatus} {pirCount > 0 && `(${pirCount})`}
        </span>
      </div>
      <div className="status-item">
        <span className="status-label">RFID:</span>
        <span className={`status-value ${rfidStatus.includes("detectada") ? "active" : "inactive"}`}>
          {rfidStatus}
        </span>
      </div>
    </div>
  </div>
)

const EventLogWidget: React.FC<{
  registros: Registro[]
  loading: boolean
  error: string
}> = ({ registros, loading, error }) => (
  <div className="premium-section logs-section full-width">
    <div className="section-header">
      <div className="icon-container">
        <FontAwesomeIcon icon={faBell} className="icon" />
      </div>
      <h3 className="section-title">Registro de Eventos</h3>
    </div>
    <div className="section-content">
      {loading ? (
        <div className="loading-container">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Cargando registros...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : registros.length === 0 ? (
        <div className="no-records">No hay registros disponibles</div>
      ) : (
        <div className="logs-container">
          {registros.slice(0, 5).map((registro) => (
            <div key={registro._id} className={`log-item ${registro.tipo === "alarma" ? "alarm" : "info"}`}>
              <div className="log-message">{registro.mensaje}</div>
              <div className="log-description">{registro.descripcion}</div>
              <div className="log-date">{new Date(registro.fecha).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

const NotificationWidget: React.FC<{
  message: string
  type: "info" | "warning" | "error"
}> = ({ message, type }) => (
  <div className={`notification ${type}`}>
    {message}
    {type === "error" && <span className="notification-icon">⚠</span>}
  </div>
)

const AlarmAlertWidget: React.FC<{
  alarmEvent: Registro | null
}> = ({ alarmEvent }) => (
  <div className="alarm-alert">
    <div className="alarm-title">¡ALARMA ACTIVADA!</div>
    <div className="alarm-message">{alarmEvent?.mensaje}</div>
    <div className="alarm-description">
      {alarmEvent?.descripcion}
      <br />
      {alarmEvent?.fecha && new Date(alarmEvent.fecha).toLocaleString()}
    </div>
  </div>
)

const MQTT_CONFIG = {
  broker: "wss://cff146d73f214b82bb19d3ae4f6a3e7d.s1.eu.hivemq.cloud:8884/mqtt",
  options: {
    username: "PuertaIOT",
    password: "1234abcD",
    clientId: `web-client-${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
    reconnectPeriod: 3000,
  },
  topics: {
    command: "valoresPuerta/comandos",
    doorStatus: "valoresPuerta/estadoPuerta",
    rfid: "valoresPuerta/valorRFID",
    pir: "valoresPuerta/conteoPIR",
    alarm: "valoresPuerta/alarma",
    magnetic: "valoresPuerta/sensorMagnetico",
    pin: "valoresPuerta/PIN",
    system: "valoresPuerta/status",
  },
}

const PantallaPuerta: React.FC = () => {
  const [systemState, setSystemState] = useState({
    doorStatus: "Cerrada",
    connectionStatus: "Conectando...",
    presenceStatus: "No detectado",
    rfidStatus: "Esperando tarjeta...",
    pirCount: 0,
    magneticSensor: "Cerrado",
    pinStatus: "No ingresado",
    loading: false,
    error: "",
    lastRFID: "",
    alarmHistory: [] as string[],
    lastPinAttempt: "",
    lastUpdate: new Date().toISOString(),
    lastAlarmState: "Normal",
  })

  const [showPin, setShowPin] = useState(false)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [loadingRegistros, setLoadingRegistros] = useState(true)
  const [errorRegistros, setErrorRegistros] = useState("")
  const [showAlarmAlert, setShowAlarmAlert] = useState(false)
  const [alarmEvent, setAlarmEvent] = useState<Registro | null>(null)
  const [client, setClient] = useState<mqtt.MqttClient | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "info" | "warning" | "error" } | null>(null)
  const [devices, setDevices] = useState([])
  const [loadingDevices, setLoadingDevices] = useState(true)
  const [errorDevices, setErrorDevices] = useState("")
  const navigate = useNavigate()

  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousRegistrosRef = useRef<Registro[]>([])

  const fetchRegistros = async () => {
    try {
      setLoadingRegistros(true)
      setErrorRegistros("")

      const endpoints = ["/api/registros/ultimos", "/api/registros/get"]
      let response

      for (const endpoint of endpoints) {
        try {
          response = await axios.get<Registro[]>(`http://localhost:8082${endpoint}`)
          if (response.status === 200) break
        } catch (err) {
          console.warn(`Error con ${endpoint}:`, err)
        }
      }

      if (!response) {
        throw new Error("No se pudo obtener registros de ningún endpoint")
      }

      const newAlarms = response.data.filter(
        (reg) =>
          reg.tipo === "alarma" &&
          !previousRegistrosRef.current.some((prevReg) => prevReg._id === reg._id),
      )

      if (newAlarms.length > 0) {
        setAlarmEvent(newAlarms[0])
        setShowAlarmAlert(true)
        setTimeout(() => setShowAlarmAlert(false), 5000)
      }

      setRegistros(response.data)
      previousRegistrosRef.current = response.data
    } catch (err: any) {
      console.error("Error al cargar registros:", err)
      setErrorRegistros(err.message || "Error al cargar registros")
    } finally {
      setLoadingRegistros(false)
    }
  }

  const showNotification = (message: string, type: "info" | "warning" | "error", duration = 3000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    setNotification({ message, type })
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleDoorAction = async (action: "abrir" | "cerrar") => {
    if (!client || systemState.loading) return

    setSystemState((prev) => ({ ...prev, loading: true, error: "" }))

    try {
      await new Promise<void>((resolve, reject) => {
        client.publish(MQTT_CONFIG.topics.command, action, { qos: 1 }, (err) => (err ? reject(err) : resolve()))
      })

      setSystemState((prev) => ({
        ...prev,
        loading: false,
      }))
    } catch (err: any) {
      setSystemState((prev) => ({
        ...prev,
        loading: false,
        error: "Error al enviar comando",
      }))
      showNotification("Error al enviar comando", "error")
    }
  }

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options)

    mqttClient.on("connect", () => {
      setSystemState((prev) => ({ ...prev, connectionStatus: "Conectado", error: "" }))

      Object.values(MQTT_CONFIG.topics).forEach((topic) => {
        mqttClient.subscribe(topic, { qos: 1 })
      })
    })

    mqttClient.on("message", (topic, message) => {
      const msg = message.toString().trim()
      if (!msg) return

      const now = new Date()
      const updateState = (updates: Partial<typeof systemState>) => {
        setSystemState((prev) => ({
          ...prev,
          ...updates,
          lastUpdate: now.toISOString(),
        }))
      }

      try {
        switch (topic) {
          case MQTT_CONFIG.topics.doorStatus:
            const newStatus = msg === "open" ? "Abierta" : "Cerrada"
            updateState({ doorStatus: newStatus })
            break

          case MQTT_CONFIG.topics.rfid:
            const rfid = msg || "Desconocido"
            updateState({
              rfidStatus: `Tarjeta detectada: ${rfid}`,
              lastRFID: rfid,
            })
            break

          case MQTT_CONFIG.topics.pir:
            const count = Number.parseInt(msg) || 0
            const presence = count > 0 ? "Presencia detectada" : "No detectado"
            updateState({
              pirCount: count,
              presenceStatus: presence,
            })
            break

          case MQTT_CONFIG.topics.alarm:
            const alarmState = msg === "activada" ? "ALARMA ACTIVADA!" : "Normal"

            if (systemState.lastAlarmState !== alarmState) {
              updateState({
                lastAlarmState: alarmState,
              })
            }
            break

          case MQTT_CONFIG.topics.magnetic:
            const sensorState = msg === "1" ? "Abierto" : "Cerrado"
            updateState({ magneticSensor: sensorState })
            break

          case MQTT_CONFIG.topics.pin:
            updateState({
              pinStatus: msg ? "PIN ingresado: ****" : "No ingresado",
              lastPinAttempt: msg,
            })
            break

          case MQTT_CONFIG.topics.system:
            updateState({
              connectionStatus: msg === "online" ? "Conectado" : "Desconectado",
            })
            break
        }
      } catch (error) {
        console.error(`Error procesando mensaje de ${topic}:`, error)
      }
    })

    mqttClient.on("error", (err) => {
      setSystemState((prev) => ({
        ...prev,
        connectionStatus: "Error de conexión",
        error: err.message,
      }))
      showNotification(`Error de conexión: ${err.message}`, "error")
    })

    setClient(mqttClient)

    fetchRegistros()
    const interval = setInterval(fetchRegistros, 15000)

    return () => {
      if (mqttClient.connected) mqttClient.end()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoadingDevices(true);
        setErrorDevices("");

        const response = await axios.get("http://localhost:8082/api/devices/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token de autenticación
          },
        });

        setDevices(response.data);
      } catch (error: any) {
        console.error("Error al cargar dispositivos:", error);
        setErrorDevices(error.message || "Error al cargar dispositivos");
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchDevices();
  }, []);

  return (
    <div className="premium-container">
      <div className="particle-background"></div>

      {notification && <NotificationWidget message={notification.message} type={notification.type} />}
      {showAlarmAlert && alarmEvent && <AlarmAlertWidget alarmEvent={alarmEvent} />}

      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Control de Puerta IoT</span>
          </h1>
          <div className="title-decoration"></div>
        </div>

        {loadingDevices ? (
          <p className="loading-message">Cargando dispositivos...</p>
        ) : errorDevices ? (
          <p className="error-message">{errorDevices}</p>
        ) : devices.length === 0 ? (
          <div className="no-devices-container">
            <p className="no-devices-message">No tienes dispositivos registrados.</p>
            <button
              className="catalog-button styled-button"
              onClick={() => navigate("/productos")}
            >
              Ir al Catálogo de Productos
            </button>
          </div>
        ) : (
          <>
            <div className="devices-container">
              <h2>Dispositivos Registrados</h2>
              <ul>
                {devices.map((device: any) => (
                  <li key={device._id}>
                    <strong>Nombre:</strong> {device.name} <br />
                    <strong>MAC Address:</strong> {device.macAddress}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nuevo layout de widgets */}
            <div className="main-content-row">
              {/* Icono grande de la puerta */}
              <div className="door-status-column">
                <DoorStatusIcon doorStatus={systemState.doorStatus} />
              </div>

              {/* Widgets de información */}
              <div className="status-widgets-column">
                <div className="widgets-grid">
                  <SystemStatusWidget
                    connectionStatus={systemState.connectionStatus}
                    doorStatus={systemState.doorStatus}
                  />

                  <SecurityWidget
                    magneticSensor={systemState.magneticSensor}
                    pinStatus={systemState.pinStatus}
                    lastPinAttempt={systemState.lastPinAttempt}
                    showPin={showPin}
                    setShowPin={setShowPin}
                  />

                  <SensorsWidget
                    presenceStatus={systemState.presenceStatus}
                    pirCount={systemState.pirCount}
                    rfidStatus={systemState.rfidStatus}
                    lastRFID={systemState.lastRFID}
                  />
                </div>
              </div>
            </div>

            {/* Widget de eventos en una fila separada */}
            <div className="event-log-row">
              <EventLogWidget registros={registros} loading={loadingRegistros} error={errorRegistros} />
            </div>

            <div className="controls-container">
              <button
                onClick={() => handleDoorAction("abrir")}
                disabled={systemState.doorStatus === "Abierta" || systemState.loading}
                className={`premium-button ${systemState.doorStatus === "Abierta" || systemState.loading ? "disabled" : ""}`}
              >
                {systemState.loading ? (
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faDoorOpen} className="button-icon" />
                    Abrir Puerta
                  </>
                )}
              </button>
            </div>
          </>
        )}

        <div className="last-update">
          Última actualización: {new Date(systemState.lastUpdate).toLocaleTimeString()}
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
          max-width: 1200px;
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
          margin-bottom: 3rem;
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

        /* Nuevo layout */
        .main-content-row {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .door-status-column {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .door-status-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          height: 100%;
          width: 100%;
          transition: all 0.3s ease;
        }

        .door-icon-wrapper {
          background: rgba(92, 107, 192, 0.2);
          border-radius: 50%;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .door-status-icon {
          font-size: 120px;
          transition: all 0.3s ease;
        }

        .door-status-icon.open {
          color: #f59e0b;
        }

        .door-status-icon.closed {
          color: #10b981;
        }

        .door-status-text {
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          margin-top: 1rem;
        }

        .status-widgets-column {
          flex: 2;
        }

        .widgets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          height: 100%;
        }

        .event-log-row {
          margin-top: 2rem;
        }

        .premium-section.full-width {
          grid-column: 1 / -1;
        }

        .premium-section {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .premium-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .system-section {
          border-top: 3px solid #5c6bc0;
        }

        .security-section {
          border-top: 3px solid #3949ab;
        }

        .sensors-section {
          border-top: 3px solid #8e24aa;
        }

        .logs-section {
          border-top: 3px solid #26a69a;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .icon-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .system-section .icon-container {
          background: rgba(92, 107, 192, 0.2);
        }

        .security-section .icon-container {
          background: rgba(57, 73, 171, 0.2);
        }

        .sensors-section .icon-container {
          background: rgba(142, 36, 170, 0.2);
        }

        .logs-section .icon-container {
          background: rgba(38, 166, 154, 0.2);
        }

        .icon {
          font-size: 1.25rem;
        }

        .system-section .icon {
          color: #5c6bc0;
        }

        .security-section .icon {
          color: #3949ab;
        }

        .sensors-section .icon {
          color: #8e24aa;
        }

        .logs-section .icon {
          color: #26a69a;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          flex-grow: 1;
          text-align: left;
        }

        .section-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .status-label {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .status-value {
          color: rgba(255, 255, 255, 0.7);
        }

        .status-value.connected {
          color: #10b981;
        }

        .status-value.disconnected {
          color: #ef4444;
        }

        .status-value.open {
          color: #f59e0b;
        }

        .status-value.closed {
          color: #10b981;
        }

        .status-value.warning {
          color: #f59e0b;
        }

        .status-value.safe {
          color: #10b981;
        }

        .status-value.active {
          color: #3b82f6;
        }

        .status-value.inactive {
          color: rgba(255, 255, 255, 0.5);
        }

        .pin-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-pin-button {
          background: none;
          border: none;
          color: #a5b4fc;
          cursor: pointer;
          transition: all 0.3s;
        }

        .toggle-pin-button:hover {
          color: #818cf8;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .loading-dots {
          display: flex;
          margin-bottom: 1rem;
        }

        .loading-dots .dot {
          width: 10px;
          height: 10px;
          margin: 0 5px;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .loading-dots .dot:nth-child(1) {
          background: #5c6bc0;
          animation-delay: 0s;
        }

        .loading-dots .dot:nth-child(2) {
          background: #3949ab;
          animation-delay: 0.2s;
        }

        .loading-dots .dot:nth-child(3) {
          background: #8e24aa;
          animation-delay: 0.4s;
        }

        .error-message {
          color: #ef4444;
          text-align: center;
          padding: 1rem;
        }

        .no-records {
          text-align: center;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .logs-container {
          max-height: 300px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .log-item {
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-radius: 8px;
          border-left: 4px solid;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease-out;
        }

        .log-item.alarm {
          border-left-color: #ef4444;
        }

        .log-item.info {
          border-left-color: #10b981;
        }

        .log-message {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .log-description {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .log-date {
          font-size: 0.75rem;
          text-align: right;
          color: rgba(255, 255, 255, 0.5);
        }

        .controls-container {
          margin-top: 2rem;
          text-align: center;
        }

        .premium-button {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #5c6bc0, #3949ab);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(92, 107, 192, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .premium-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(92, 107, 192, 0.4);
        }

        .premium-button.disabled {
          background: rgba(204, 204, 204, 0.2);
          color: rgba(255, 255, 255, 0.4);
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 1rem;
        }

        .last-update {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          animation: fadeIn 0.3s;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .notification.error {
          background: rgba(239, 68, 68, 0.9);
        }

        .notification.warning {
          background: rgba(245, 158, 11, 0.9);
        }

        .notification.info {
          background: rgba(16, 185, 129, 0.9);
        }

        .notification-icon {
          margin-left: 10px;
          font-size: 20px;
        }

        .alarm-alert {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.5);
          z-index: 2000;
          max-width: 80%;
          text-align: center;
          animation: pulse 0.5s alternate infinite;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(239, 68, 68, 0.95);
        }

        .alarm-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .alarm-message {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .alarm-description {
          font-size: 16px;
          opacity: 0.9;
        }

        .no-devices-container {
          text-align: center;
          padding: 2rem;
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          margin: 2rem 0;
        }

        .no-devices-message {
          font-size: 1.25rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
        }

        .catalog-button.styled-button {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #5c6bc0, #3949ab);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(92, 107, 192, 0.3);
        }

        .catalog-button.styled-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(92, 107, 192, 0.4);
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          from { transform: translate(-50%, -50%) scale(1); }
          to { transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 1000px) {
          .main-content-row {
            flex-direction: column;
          }
          
          .door-status-column, .status-widgets-column {
            width: 100%;
          }
          
          .door-icon-wrapper {
            width: 150px;
            height: 150px;
          }
          
          .door-status-icon {
            font-size: 80px;
          }
        }

        @media (max-width: 768px) {
          .premium-card {
            padding: 2rem;
          }
          
          .premium-title {
            font-size: 2rem;
          }
          
          .widgets-grid {
            grid-template-columns: 1fr;
          }
          
          .door-status-icon {
            font-size: 60px;
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
          
          .door-icon-wrapper {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </div>
  )
}

export default PantallaPuerta