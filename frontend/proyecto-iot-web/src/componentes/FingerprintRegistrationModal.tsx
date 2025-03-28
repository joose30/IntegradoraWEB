import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const arduinoIP = '192.168.8.4'; // Cambia esto por la IP de tu Arduino ESP32

interface FingerprintRegisterResponse {
  success: boolean;
  fingerprintId: string;
  message?: string;
}

interface FingerprintStatusResponse {
  status: 'idle' | 'step1' | 'step2' | 'error' | 'completed';
  message?: string;
}

interface DeviceStatusResponse {
  connected: boolean;
  message?: string;
}

interface FingerprintRegistrationModalProps {
  onCaptureComplete: (accessId: string) => void;
  onCancel: () => void;
  userName: string;
}

const styles = {
  modal: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '25px',
    width: '450px',
    maxWidth: '90%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    margin: '20px auto',
    border: '1px solid #e0e0e0'
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center' as const,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600'
  },
  content: {
    margin: '20px 0',
    textAlign: 'center' as const,
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center'
  },
  instructionText: {
    fontSize: '16px',
    color: '#34495e',
    marginBottom: '20px'
  },
  loader: {
    margin: '15px auto',
    padding: '10px',
    color: '#3498db',
    fontSize: '14px'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    margin: '15px 0',
    fontSize: '14px',
    textAlign: 'center' as const
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#d32f2f',
    border: '1px solid #ef9a9a'
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    border: '1px solid #a5d6a7'
  },
  info: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    border: '1px solid #90caf9'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    minWidth: '120px'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2980b9'
    },
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed'
    }
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c0392b'
    }
  },
  progressIndicator: {
    display: 'flex',
    justifyContent: 'center',
    margin: '15px 0'
  },
  stepDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    margin: '0 5px',
    backgroundColor: '#bdc3c7'
  },
  activeStepDot: {
    backgroundColor: '#3498db'
  },
  completedStepDot: {
    backgroundColor: '#2ecc71'
  }
};

const FingerprintRegistrationModal: React.FC<FingerprintRegistrationModalProps> = ({
  onCaptureComplete,
  onCancel,
  userName,
}) => {
  const [status, setStatus] = useState('idle');
  const [fingerprintId, setFingerprintId] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRegisteringRef = useRef(false);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    isRegisteringRef.current = isRegistering;
  }, [isRegistering]);

  useEffect(() => {
    checkDeviceConnection();
  }, []);

  const checkDeviceConnection = async () => {
    try {
      const response = await axios.get<DeviceStatusResponse>(
        `http://${arduinoIP}/api/arduino/status`
      );
      setIsConnected(response.data.connected);
      if (!response.data.connected) {
        setMessage('Dispositivo IoT desconectado');
      }
    } catch (error) {
      console.error('Error verificando estado del dispositivo:', error);
      setIsConnected(false);
      setMessage('Error al verificar estado del dispositivo');
    }
  };

  const startFingerprintRegistration = async () => {
    if (!isConnected) {
      setMessage('Dispositivo IoT no conectado');
      return;
    }

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsRegistering(true);
    setStatus('registering');
    setMessage('Coloque su dedo en el sensor de huella...');
    setRegistrationStep(1);

    try {
      const response = await axios.post<FingerprintRegisterResponse>(
        `http://${arduinoIP}/api/arduino/fingerprint/register`,
        { userName }
      );

      const newFingerprintId = response.data.fingerprintId;

      pollIntervalRef.current = setInterval(async () => {
        if (!isRegisteringRef.current) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          return;
        }

        try {
          const pollResponse = await axios.get<FingerprintStatusResponse>(
            `http://${arduinoIP}/api/arduino/fingerprint/status`
          );

          const registrationStatus = pollResponse.data.status;

          if (registrationStatus === 'step1') {
            setMessage('Primera captura completada. Retire su dedo.');
            setRegistrationStep(2);
          } else if (registrationStatus === 'step2') {
            setMessage('Vuelva a colocar su dedo para confirmar...');
            setRegistrationStep(3);
          } else if (registrationStatus === 'completed') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }

            setFingerprintId(newFingerprintId);
            setStatus('success');
            setMessage(`Huella registrada correctamente con ID: ${newFingerprintId}`);
            setIsRegistering(false);

            setTimeout(() => {
              onCaptureComplete(newFingerprintId);
            }, 2000);
          } else if (registrationStatus === 'error') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }

            setStatus('error');
            setMessage(`Error en el registro de huella: ${pollResponse.data.message || 'Error desconocido'}`);
            setIsRegistering(false);
          }
        } catch (pollError) {
          console.error('Error al verificar estado del registro:', pollError);
          setMessage('Error al verificar estado. Reintentando...');
        }
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        if (isRegisteringRef.current) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }

          setStatus('timeout');
          setMessage('Tiempo de espera agotado. Intente nuevamente.');
          setIsRegistering(false);
        }
      }, 60000);
    } catch (error: any) {
      console.error('Error al iniciar registro de huella:', error);
      setStatus('error');
      setMessage('Error al comunicarse con el dispositivo');
      setIsRegistering(false);
    }
  };

  const handleCancel = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsRegistering(false);
    setStatus('idle');
    setMessage('');
    onCancel();
  };

  return (
    <div style={styles.modal}>
      <h2 style={styles.title}>Registro de Huella Digital</h2>

      <div style={styles.content}>
        <p style={styles.instructionText}>
          {isRegistering
            ? getStepInstruction(registrationStep)
            : 'Presione el botón para iniciar el registro de huella'}
        </p>

        {isRegistering && (
          <div style={styles.progressIndicator}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  ...styles.stepDot,
                  ...(registrationStep > step ? styles.completedStepDot : {}),
                  ...(registrationStep === step ? styles.activeStepDot : {})
                }}
              />
            ))}
          </div>
        )}

        {status === 'registering' && <div style={styles.loader}>Cargando...</div>}

        {message && (
          <div
            style={{
              ...styles.message,
              ...(status === 'error' ? styles.error : 
                  status === 'success' ? styles.success : styles.info)
            }}
          >
            {message}
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        {!isRegistering ? (
          <>
            <button
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(!isConnected ? { opacity: 0.6, cursor: 'not-allowed' } : {})
              }}
              onClick={startFingerprintRegistration}
              disabled={!isConnected}
            >
              Registrar Huella
            </button>
            <button 
              style={{ ...styles.button, ...styles.cancelButton }} 
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button 
            style={{ ...styles.button, ...styles.cancelButton }} 
            onClick={handleCancel}
          >
            Cancelar Registro
          </button>
        )}
      </div>
    </div>
  );
};

const getStepInstruction = (step: number) => {
  switch (step) {
    case 1:
      return 'Coloque su dedo en el sensor de huella...';
    case 2:
      return 'Primera captura completada. Retire su dedo.';
    case 3:
      return 'Vuelva a colocar su dedo para confirmar...';
    default:
      return 'Siga las instrucciones del dispositivo...';
  }
};

export default FingerprintRegistrationModal;