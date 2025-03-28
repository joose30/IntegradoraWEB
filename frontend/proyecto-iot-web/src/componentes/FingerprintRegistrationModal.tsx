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
    <div className="fingerprint-modal">
      <h2>Registro de Huella Digital</h2>

      <div className="content">
        <p>
          {isRegistering
            ? getStepInstruction(registrationStep)
            : 'Presione el botón para iniciar el registro de huella'}
        </p>

        {status === 'registering' && <div className="loader">Cargando...</div>}

        {message && (
          <div
            className={`message ${
              status === 'error' ? 'error' : status === 'success' ? 'success' : 'info'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="button-container">
        {!isRegistering ? (
          <>
            <button
              className={`button primary ${!isConnected ? 'disabled' : ''}`}
              onClick={startFingerprintRegistration}
              disabled={!isConnected}
            >
              Registrar Huella
            </button>
            <button className="button cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="button cancel" onClick={handleCancel}>
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