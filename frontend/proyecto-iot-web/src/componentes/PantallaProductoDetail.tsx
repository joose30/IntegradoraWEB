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
    const API_BASE = 'http://localhost:8082/api';

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
                if (topic === MQTT_CONFIG.topics.mac && allowMacUpdates && !isManuallyEdited) {
                    const macAddress = message.toString();
                    if (macAddress && macAddress.trim() !== '') {
                        setDeviceData(prev => ({
                            ...prev,
                            macAddress: macAddress
                        }));
                        setMacAddressReceived(true);
                        setMqttStatus('MAC detectada automáticamente');
                        setAllowMacUpdates(false);
                    }
                }
            });
            
            mqttClient.on('error', (err) => {
                console.error('Error MQTT:', err);
                setMqttStatus('Error de conexión MQTT');
            });
            
            return () => {
                if (mqttClient) {
                    mqttClient.end();
                    mqttClientRef.current = null;
                }
            };
        }
    }, [isModalOpen, allowMacUpdates, isManuallyEdited]);

    if (!product) {
        return (
            <div className="premium-error-screen">
                <div className="error-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h3 className="error-title">¡Error!</h3>
                <p className="error-message">Producto no encontrado</p>
                <button className="retry-button" onClick={() => navigate('/')}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        alert('Producto agregado al carrito');
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para realizar una compra');
            navigate('/login', { state: { returnTo: location.pathname, product } });
            return;
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'macAddress') {
            setIsManuallyEdited(true);
        }
        setDeviceData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleRefreshMac = () => {
        setAllowMacUpdates(true);
        setIsManuallyEdited(false);
        setMqttStatus('Buscando dispositivo nuevamente...');
        setTimeout(() => {
            if (mqttClientRef.current) {
                mqttClientRef.current.unsubscribe(MQTT_CONFIG.topics.mac);
                mqttClientRef.current.subscribe(MQTT_CONFIG.topics.mac, { qos: 1 });
            }
        }, 100);
    };

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

    const handleSubmitDevice = async (e: React.FormEvent) => {
        e.preventDefault();
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

            const targetUserId = "67e8f3d75bee2811f9c13ee8"; // ID del usuario objetivo

            const updateResponse = await axios.put(
                `${API_BASE}/users/${targetUserId}/update-pin`,
                { devicePin: deviceData.devicePin },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (updateResponse.status === 200) {
                setSuccessMessage('¡Dispositivo registrado exitosamente!');
            }
        } catch (error: any) {
            console.error('Error al registrar dispositivo:', error);
            alert('Error al registrar dispositivo. Inténtalo de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const registerPurchase = async (token: string, productId: string) => {
        try {
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
            return response.data;
        } catch (error: any) {
            console.error('Error al registrar la compra:', error);
            return {
                error: true,
                message: error.response?.data?.message || 'Error desconocido',
                status: error.response?.status
            };
        }
    };

    return (
        <div className="premium-container">
            <div className="particle-background"></div>
            
            <div className="premium-card">
                <div className="header-container">
                    <h1 className="premium-title">
                        <span className="title-highlight">{product.name}</span>
                    </h1>
                    <div className="title-decoration"></div>
                </div>

                <div className="product-detail-grid">
                    <div className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                    
                    <div className="product-info-container">
                        <div className="product-info-section">
                            <h2 className="section-title">Descripción</h2>
                            <p className="product-description">{product.description || 'Sin descripción disponible.'}</p>
                        </div>
                        
                        <div className="product-meta-section">
                            <div className="meta-item">
                                <span className="meta-label">Categoría:</span>
                                <span className="meta-value">{product.category}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Precio:</span>
                                <span className="meta-value price">${product.price}</span>
                            </div>
                        </div>
                        
                        <div className="product-actions">
                            <button 
                                className="action-button add-to-cart"
                                onClick={handleAddToCart}
                            >
                                <svg viewBox="0 0 24 24" className="button-icon">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                                Agregar al carrito
                            </button>
                            <button 
                                className="action-button buy-now"
                                onClick={handleBuyNow}
                            >
                                <svg viewBox="0 0 24 24" className="button-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                Comprar ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para registrar dispositivo */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Registrar Dispositivo"
                ariaHideApp={true}
                className="premium-modal"
                overlayClassName="premium-modal-overlay"
            >
                <div className="modal-content">
                    <h2 className="modal-title">Configurar tu dispositivo Segurix</h2>
                    <p className="modal-subtitle">
                        Completa la siguiente información para configurar tu nuevo dispositivo de seguridad.
                    </p>

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    {mqttStatus && !macAddressReceived && allowMacUpdates && (
                        <div className="mqtt-status">
                            {mqttStatus}
                        </div>
                    )}
                    
                    {macAddressReceived && !isManuallyEdited && (
                        <div className="mac-detected-message">
                            ¡Dispositivo detectado automáticamente!
                        </div>
                    )}

                    <form onSubmit={handleSubmitDevice} className="modal-form">
                        <div className="form-group">
                            <label className="form-label">
                                Nombre del dispositivo:
                                <input
                                    type="text"
                                    name="name"
                                    value={deviceData.name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                                />
                            </label>
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Dirección MAC:
                                <div className="mac-input-container">
                                    <input
                                        type="text"
                                        name="macAddress"
                                        value={deviceData.macAddress}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 00:1A:2B:3C:4D:5E"
                                        className={`form-input mac-input ${errors.macAddress ? 'input-error' : ''}`}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleRefreshMac} 
                                        className="refresh-button"
                                        title="Detectar MAC automáticamente"
                                    >
                                        <svg viewBox="0 0 24 24">
                                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                        </svg>
                                    </button>
                                </div>
                            </label>
                            {errors.macAddress && <p className="error-text">{errors.macAddress}</p>}
                            {macAddressReceived && (
                                <p className="auto-detected-text">
                                    {isManuallyEdited 
                                        ? "Has modificado la MAC manualmente." 
                                        : "MAC detectada automáticamente. Puedes editarla si es necesario."}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                PIN de 4 dígitos:
                                <input
                                    type="password"
                                    name="devicePin"
                                    value={deviceData.devicePin}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    placeholder="Ej: 1234"
                                    className={`form-input ${errors.devicePin ? 'input-error' : ''}`}
                                />
                            </label>
                            {errors.devicePin && <p className="error-text">{errors.devicePin}</p>}
                            <p className="help-text">Este PIN será utilizado para acceder a tu dispositivo.</p>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="action-button cancel-button"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="action-button submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="spinner" viewBox="0 0 50 50">
                                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                        </svg>
                                        Registrando...
                                    </>
                                ) : 'Registrar Dispositivo'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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

                .product-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                }

                .product-image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .product-image {
                    max-width: 100%;
                    max-height: 400px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease;
                }

                .product-image:hover {
                    transform: scale(1.02);
                }

                .product-info-container {
                    display: flex;
                    flex-direction: column;
                }

                .product-info-section {
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #a5b4fc;
                    margin-bottom: 1rem;
                    position: relative;
                    padding-bottom: 0.5rem;
                }

                .section-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50px;
                    height: 3px;
                    background: linear-gradient(90deg, #5c6bc0, #3949ab);
                    border-radius: 3px;
                }

                .product-description {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                    font-size: 1.1rem;
                }

                .product-meta-section {
                    margin-bottom: 2rem;
                }

                .meta-item {
                    display: flex;
                    margin-bottom: 1rem;
                }

                .meta-label {
                    font-weight: 600;
                    color: #a5b4fc;
                    min-width: 120px;
                }

                .meta-value {
                    color: rgba(255, 255, 255, 0.9);
                }

                .meta-value.price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #5eead4;
                }

                .product-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: auto;
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    font-size: 1rem;
                    gap: 0.5rem;
                }

                .button-icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }

                .add-to-cart {
                    background: rgba(92, 107, 192, 0.2);
                    color: #a5b4fc;
                    border: 1px solid rgba(92, 107, 192, 0.3);
                }

                .add-to-cart:hover {
                    background: rgba(92, 107, 192, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(92, 107, 192, 0.2);
                }

                .buy-now {
                    background: linear-gradient(135deg, #5c6bc0, #3949ab);
                    color: white;
                }

                .buy-now:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(92, 107, 192, 0.4);
                    background: linear-gradient(135deg, #6d7bd1, #4a5ac1);
                }

                /* Modal Styles */
                .premium-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.75);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .premium-modal {
                    position: relative;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 15px;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    outline: none;
                }

                .modal-content {
                    position: relative;
                    z-index: 1;
                }

                .modal-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: #fff;
                    text-align: center;
                    background: linear-gradient(90deg, #fff 0%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .modal-subtitle {
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 0.9rem;
                }

                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #a5b4fc;
                    margin-bottom: 0.5rem;
                }

                .form-input {
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #5c6bc0;
                    box-shadow: 0 0 0 2px rgba(92, 107, 192, 0.3);
                }

                .form-input.input-error {
                    border-color: #ef4444;
                }

                .mac-input-container {
                    display: flex;
                    gap: 0.5rem;
                }

                .mac-input {
                    flex: 1;
                }

                .refresh-button {
                    background: rgba(92, 107, 192, 0.2);
                    border: none;
                    border-radius: 8px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .refresh-button:hover {
                    background: rgba(92, 107, 192, 0.3);
                    transform: rotate(90deg);
                }

                .refresh-button svg {
                    width: 20px;
                    height: 20px;
                    fill: #a5b4fc;
                }

                .error-text {
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                }

                .help-text {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                }

                .auto-detected-text {
                    color: #5eead4;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                    font-style: italic;
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .cancel-button {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .cancel-button:hover {
                    background: rgba(239, 68, 68, 0.2);
                    transform: translateY(-2px);
                }

                .submit-button {
                    background: linear-gradient(135deg, #5c6bc0, #3949ab);
                    color: white;
                    position: relative;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(92, 107, 192, 0.4);
                    background: linear-gradient(135deg, #6d7bd1, #4a5ac1);
                }

                .submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: rotate 1s linear infinite;
                    width: 20px;
                    height: 20px;
                    margin-right: 0.5rem;
                }

                .spinner circle {
                    stroke: white;
                    stroke-linecap: round;
                    animation: dash 1.5s ease-in-out infinite;
                }

                /* Messages */
                .success-message {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 600;
                }

                .mqtt-status {
                    background: rgba(59, 130, 246, 0.2);
                    color: #3b82f6;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-size: 0.9rem;
                }

                .mac-detected-message {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    text-align: center;
                    font-weight: 600;
                }

                /* Error Screen */
                .premium-error-screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    padding: 2rem;
                    text-align: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                }

                .error-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }

                .error-icon svg {
                    width: 40px;
                    height: 40px;
                    fill: #ef4444;
                }

                .error-title {
                    font-size: 1.75rem;
                    color: #fff;
                    margin-bottom: 1rem;
                }

                .error-message {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 2rem;
                    max-width: 500px;
                }

                .retry-button {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fff;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 30px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                }

                .retry-button:hover {
                    background: rgba(239, 68, 68, 0.3);
                    transform: translateY(-2px);
                }

                /* Animations */
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes dash {
                    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
                    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
                    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
                }

                @media (max-width: 768px) {
                    .product-detail-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .product-actions {
                        flex-direction: column;
                    }
                    
                    .premium-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}