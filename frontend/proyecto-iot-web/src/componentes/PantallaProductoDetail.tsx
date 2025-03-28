import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Modal from 'react-modal';
import mqtt from 'mqtt';

// Configurar Modal para accesibilidad
Modal.setAppElement('#root'); 

// Definir los tipos necesarios
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
};

type DeviceFormData = {
    macAddress: string;
    name: string;
    devicePin: string;
};

export default function ProductoDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const product: Product = location.state?.product;
    
    // Estados para el modal y formulario
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceData, setDeviceData] = useState<DeviceFormData>({
        macAddress: '',
        name: `Segurix ${product?.name || 'Device'}`,
        devicePin: ''
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [macAddressReceived, setMacAddressReceived] = useState(false);
    const [mqttStatus, setMqttStatus] = useState('');
    const [allowMacUpdates, setAllowMacUpdates] = useState(true);
    const [isManuallyEdited, setIsManuallyEdited] = useState(false);
    
    // Referencia al cliente MQTT
    const mqttClientRef = useRef<mqtt.MqttClient | null>(null);

    // URL base para la API
    const API_BASE = 'http://192.168.0.69:8082/api';

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
            mac: 'valoresPuerta/direccionMAC'
        }
    };

    // Efecto para conectarse a MQTT cuando se abre el modal
    useEffect(() => {
        if (isModalOpen) {
            setMqttStatus('Conectando a MQTT...');
            
            const mqttClient = mqtt.connect(MQTT_CONFIG.broker, MQTT_CONFIG.options);
            mqttClientRef.current = mqttClient;
            
            mqttClient.on('connect', () => {
                setMqttStatus('Buscando dispositivo...');
                mqttClient.subscribe(MQTT_CONFIG.topics.mac, { qos: 1 });
            });
            
            mqttClient.on('message', (topic, message) => {
                // Solo actualizar si se permite y no ha sido editado manualmente
                if (topic === MQTT_CONFIG.topics.mac && allowMacUpdates && !isManuallyEdited) {
                    const macAddress = message.toString();
                    if (macAddress && macAddress.trim() !== '') {
                        setDeviceData(prev => ({
                            ...prev,
                            macAddress: macAddress
                        }));
                        setMacAddressReceived(true);
                        setMqttStatus('MAC detectada automáticamente');
                        
                        // Detener actualizaciones automáticas después de recibir la primera
                        setAllowMacUpdates(false);
                    }
                }
            });
            
            mqttClient.on('error', (err) => {
                console.error('Error MQTT:', err);
                setMqttStatus('Error de conexión MQTT');
            });
            
            // Limpiar la conexión al cerrar el modal
            return () => {
                if (mqttClient) {
                    mqttClient.end();
                    mqttClientRef.current = null;
                }
            };
        }
    }, [isModalOpen, allowMacUpdates, isManuallyEdited]);

    if (!product) {
        return <div style={styles.errorContainer}>Producto no encontrado</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        alert('Producto agregado al carrito');
    };

    // Función para manejar compra inmediata
    const handleBuyNow = () => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para realizar una compra');
            navigate('/login', { state: { returnTo: location.pathname, product } });
            return;
        }
        
        // Abrir el modal para configurar el dispositivo
        setIsModalOpen(true);
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Si es el campo MAC, marcar como editado manualmente
        if (name === 'macAddress') {
            setIsManuallyEdited(true);
        }
        
        setDeviceData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar errores mientras el usuario escribe
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Función para refrescar la dirección MAC
    const handleRefreshMac = () => {
        setAllowMacUpdates(true);
        setIsManuallyEdited(false); // Resetear el estado de edición manual
        setMqttStatus('Buscando dispositivo nuevamente...');
        
        // Pequeño retraso para asegurar que el estado se actualice antes de volver a suscribirse
        setTimeout(() => {
            if (mqttClientRef.current) {
                mqttClientRef.current.unsubscribe(MQTT_CONFIG.topics.mac);
                mqttClientRef.current.subscribe(MQTT_CONFIG.topics.mac, { qos: 1 });
            }
        }, 100);
    };

    // Validar el formulario
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        
        if (!deviceData.macAddress) {
            newErrors.macAddress = 'La dirección MAC es requerida';
        }
        
        if (!deviceData.name) {
            newErrors.name = 'El nombre del dispositivo es requerido';
        }
        
        if (!deviceData.devicePin) {
            newErrors.devicePin = 'El PIN es requerido';
        } else if (deviceData.devicePin.length !== 4 || !/^\d+$/.test(deviceData.devicePin)) {
            newErrors.devicePin = 'El PIN debe ser de exactamente 4 dígitos';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar datos del dispositivo al servidor
    const handleSubmitDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setSuccessMessage('');
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                setIsModalOpen(false);
                navigate('/login', { state: { returnTo: location.pathname, product } });
                return;
            }
            
            console.log('Intentando registrar dispositivo con token:', token.substring(0, 15) + '...');
            
            // Registrar el dispositivo usando la API
            const response = await axios.post(
                `${API_BASE}/devices/register`,
                deviceData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 201) {
                console.log('Dispositivo registrado:', response.data);
                setSuccessMessage('¡Dispositivo registrado exitosamente!');
                
                // Guardar localmente que el usuario tiene un dispositivo
                localStorage.setItem('userHasDevice', 'true');
                
                try {
                    // Registrar la compra del producto
                    console.log('Intentando registrar compra para el producto:', product._id);
                    const purchaseResponse = await registerPurchase(token, product._id);
                    console.log('Respuesta de registro de compra:', purchaseResponse);
                } catch (purchaseError) {
                    console.error('Error específico al registrar la compra:', purchaseError);
                    // No mostramos error al usuario para no interrumpir el flujo principal
                }
                
                // Resetear formulario después del éxito
                setDeviceData({
                    macAddress: '',
                    name: `Segurix ${product.name}`,
                    devicePin: ''
                });
                
                // Cerrar el modal después de 2 segundos
                setTimeout(() => {
                    setIsModalOpen(false);
                    navigate('/perfil-usuario'); // Redirigir al perfil o donde corresponda
                }, 2000);
            }
        } catch (error: any) {
            console.error('Error al registrar dispositivo:', error);
            
            let errorMessage = 'Error al registrar dispositivo. Inténtalo de nuevo más tarde.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                setTimeout(() => {
                    setIsModalOpen(false);
                    navigate('/login', { state: { returnTo: location.pathname, product } });
                }, 1500);
            } else if (error.response?.data?.message) {
                errorMessage = `Error: ${error.response.data.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para registrar la compra de un producto
    const registerPurchase = async (token: string, productId: string) => {
        try {
            console.log('Enviando solicitud de compra con token:', token.substring(0, 15) + '...');
            console.log('Producto ID para la compra:', productId);
            
            const response = await axios.post(
                `${API_BASE}/purchases/register`,
                { productId: productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Compra registrada exitosamente:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error completo al registrar la compra:', error);
            
            if (error.response) {
                console.error('Respuesta de error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            
            // Solo mostrar una alerta si el error es crítico
            if (error.response?.status >= 500) {
                alert('Hubo un problema al registrar la compra, pero tu dispositivo fue configurado correctamente.');
            } else if (error.response?.status === 401) {
                console.error('Error de autenticación al registrar la compra.');
                // No alertamos al usuario aquí, ya se manejará en handleSubmitDevice
            }
            
            // Retornar un objeto con información del error para poder manejarlo
            return {
                error: true,
                message: error.response?.data?.message || 'Error desconocido',
                status: error.response?.status
            };
        }
    };

    return (
        <div style={styles.screen}>
            <div style={styles.cardContainer}>
                <h1 style={styles.title}>Detalle de {product.name}</h1>
                <img src={product.image} alt={product.name} style={styles.productImage} />
                
                <div style={styles.details}>
                    <div style={styles.detailItem}>
                        <strong style={styles.detailLabel}>Precio:</strong> <span style={styles.detailValue}>${product.price}</span>
                    </div>
                    <div style={styles.detailItem}>
                        <strong style={styles.detailLabel}>Categoría:</strong> <span style={styles.detailValue}>{product.category}</span>
                    </div>
                    <div style={styles.detailItem}>
                        <strong style={styles.detailLabel}>Descripción:</strong> <span style={styles.detailValue}>{product.description || 'Sin descripción disponible.'}</span>
                    </div>
                </div>

                <div style={styles.buttonContainer}>
                    <button style={styles.addToCartButton} onClick={handleAddToCart}>
                        Agregar al carrito
                    </button>
                    <button style={styles.buyNowButton} onClick={handleBuyNow}>
                        Comprar ahora
                    </button>
                </div>
            </div>

            {/* Modal para registrar dispositivo */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Registrar Dispositivo"
                ariaHideApp={true}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '10px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%'
                    }
                }}
            >
                <h2 style={styles.modalTitle}>Configurar tu dispositivo Segurix</h2>
                <p style={styles.modalSubtitle}>
                    Completa la siguiente información para configurar tu nuevo dispositivo de seguridad.
                </p>

                {successMessage && (
                    <div style={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                {/* Mostrar estado de la conexión MQTT */}
                {mqttStatus && !macAddressReceived && allowMacUpdates && (
                    <div style={styles.mqttStatus}>
                        {mqttStatus}
                    </div>
                )}
                
                {macAddressReceived && !isManuallyEdited && (
                    <div style={styles.macDetectedMessage}>
                        ¡Dispositivo detectado automáticamente!
                    </div>
                )}

                <form onSubmit={handleSubmitDevice} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Nombre del dispositivo:
                            <input
                                type="text"
                                name="name"
                                value={deviceData.name}
                                onChange={handleInputChange}
                                style={errors.name ? {...styles.input, ...styles.inputError} : styles.input}
                            />
                        </label>
                        {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Dirección MAC:
                            <div style={styles.macInputContainer}>
                                <input
                                    type="text"
                                    name="macAddress"
                                    value={deviceData.macAddress}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 00:1A:2B:3C:4D:5E"
                                    style={errors.macAddress ? 
                                        {...styles.input, ...styles.inputError, ...styles.macInput} : 
                                        {...styles.input, ...styles.macInput}
                                    }
                                />
                                <button 
                                    type="button" 
                                    onClick={handleRefreshMac} 
                                    style={styles.refreshButton}
                                    title="Detectar MAC automáticamente"
                                >
                                    ↻
                                </button>
                            </div>
                        </label>
                        {errors.macAddress && <p style={styles.errorText}>{errors.macAddress}</p>}
                        {macAddressReceived && (
                            <p style={styles.autoDetectedText}>
                                {isManuallyEdited 
                                    ? "Has modificado la MAC manualmente." 
                                    : "MAC detectada automáticamente. Puedes editarla si es necesario."}
                            </p>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            PIN de 4 dígitos:
                            <input
                                type="password"
                                name="devicePin"
                                value={deviceData.devicePin}
                                onChange={handleInputChange}
                                maxLength={4}
                                placeholder="Ej: 1234"
                                style={errors.devicePin ? {...styles.input, ...styles.inputError} : styles.input}
                            />
                        </label>
                        {errors.devicePin && <p style={styles.errorText}>{errors.devicePin}</p>}
                        <p style={styles.helpText}>Este PIN será utilizado para acceder a tu dispositivo.</p>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            style={styles.cancelButton}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registrando...' : 'Registrar Dispositivo'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    screen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F4F7FC',
        padding: '20px',
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '20px',
    },
    productImage: {
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    details: {
        textAlign: 'left',
        fontSize: '16px',
        color: '#7F8C8D',
    },
    detailItem: {
        marginBottom: '15px',
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#34495E',
    },
    detailValue: {
        color: '#2C3E50',
        marginLeft: '10px',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#E74C3C',
        fontSize: '18px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '25px',
    },
    addToCartButton: {
        padding: '10px 20px',
        backgroundColor: '#27AE60',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buyNowButton: {
        padding: '10px 20px',
        backgroundColor: '#3498DB',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '10px',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: '14px',
        color: '#7F8C8D',
        marginBottom: '20px',
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#34495E',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        marginTop: '5px',
    },
    macInputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px',
    },
    macInput: {
        flex: 1,
        marginRight: '10px',
    },
    refreshButton: {
        padding: '8px 12px',
        backgroundColor: '#3498DB',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: '#E74C3C',
    },
    errorText: {
        color: '#E74C3C',
        fontSize: '12px',
        marginTop: '5px',
    },
    helpText: {
        fontSize: '12px',
        color: '#7F8C8D',
        marginTop: '5px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '25px',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#95A5A6',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#3498DB',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    successMessage: {
        backgroundColor: '#D5F5E3',
        color: '#27AE60',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    mqttStatus: {
        backgroundColor: '#F8F9FA',
        color: '#007BFF',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
    },
    macDetectedMessage: {
        backgroundColor: '#D1ECFF',
        color: '#0056B3',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    autoDetectedText: {
        color: '#27AE60',
        fontSize: '12px',
        marginTop: '5px',
        fontStyle: 'italic',
    }
};
