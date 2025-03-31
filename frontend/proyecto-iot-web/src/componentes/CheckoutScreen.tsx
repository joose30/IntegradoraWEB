import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutScreen() {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const [paymentInfo, setPaymentInfo] = useState({
        name: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentInfo({ ...paymentInfo, [name]: value });
    };

    const handlePayment = async () => {
        if (Object.values(paymentInfo).some((field) => field === '')) {
            alert('Por favor, completa todos los campos de pago.');
            return;
        }

        if (!userEmail) {
            alert('No se encontró un correo electrónico. Por favor, inicia sesión.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('http://localhost:8082/api/purchase/send-purchase-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    cart,
                }),
            });

            if (response.ok) {
                setPaymentSuccess(true);
                setTimeout(() => {
                    clearCart();
                    navigate('/home'); // Cambia la ruta aquí
                }, 3000);
            } else {
                alert('Hubo un problema al procesar el pago.');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <div style={styles.successContainer}>
                <div className="animate-fade-in" style={styles.successContent}>
                    <svg style={styles.successIcon} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h2 style={styles.successTitle}>¡Pago Exitoso!</h2>
                    <p style={styles.successMessage}>Tu compra ha sido procesada correctamente. Recibirás un correo de confirmación.</p>
                    <p style={styles.successRedirect}>Redirigiendo a la página principal...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Fondo premium */}
            <div className="particle-background"></div>
            
            {/* Tarjeta principal */}
            <div className="premium-card animate-fade-in">
                <h1 style={styles.title}>Finalizar Compra</h1>
                
                {/* Resumen del pedido */}
                <div className="animate-slide-up" style={styles.summary}>
                    <h2 style={styles.sectionTitle}>Resumen del Pedido</h2>
                    <div style={styles.summaryItem}>
                        <span>Productos:</span>
                        <span>{totalItems}</span>
                    </div>
                    <div style={styles.summaryItem}>
                        <span>Total:</span>
                        <span style={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Formulario de pago */}
                <div className="animate-slide-up" style={{...styles.paymentForm, animationDelay: '0.1s'}}>
                    <h2 style={styles.sectionTitle}>Información de Pago</h2>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nombre en la tarjeta</label>
                        <input
                            type="text"
                            name="name"
                            value={paymentInfo.name}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Número de tarjeta</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    
                    <div style={styles.formRow}>
    <div style={{ ...styles.formGroup, flex: 2, marginRight: '1rem' }}>
        <label style={styles.label}>Fecha de expiración</label>
        <input
            type="text"
            name="expirationDate"
            placeholder="MM/AA"
            value={paymentInfo.expirationDate}
            onChange={handleInputChange}
            style={styles.input}
            maxLength={5}
        />
    </div>
    
    <div style={{ ...styles.formGroup, flex: 1 }}>
        <label style={styles.label}>CVV</label>
        <input
            type="text"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="123"
            maxLength={3}
        />
    </div>
</div>
                    
                    <button 
                        style={styles.button} 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="hover-effect"
                    >
                        {isProcessing ? (
                            <span style={styles.buttonContent}>
                                <svg style={styles.spinner} viewBox="0 0 50 50">
                                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5"></circle>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            'Confirmar Pago'
                        )}
                    </button>
                </div>
            </div>

            {/* Estilos CSS con animaciones */}
            <style>{`
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
                    max-width: 800px;
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

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    opacity: 0;
                }

                .hover-effect:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative',
        fontFamily: "'Montserrat', sans-serif",
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: 800,
        marginBottom: '2rem',
        background: 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 15px rgba(165, 180, 252, 0.3)',
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: '#fff',
        fontWeight: 600,
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        paddingBottom: '0.5rem'
    },
    summary: {
        background: 'rgba(30, 30, 60, 0.6)',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        fontSize: '1.1rem'
    },
    totalPrice: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#a5b4fc'
    },
    paymentForm: {
        background: 'rgba(30, 30, 60, 0.6)',
        borderRadius: '15px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    formGroup: {
        marginBottom: '1.5rem'
    },
    formRow: {
        display: 'flex',
        gap: '1rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1rem',
        transition: 'all 0.3s ease'
    },
    button: {
        width: '100%',
        padding: '1rem',
        background: 'linear-gradient(90deg, #5c6bc0 0%, #3949ab 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem'
    },
    buttonContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    spinner: {
        width: '20px',
        height: '20px',
        animation: 'spin 1s linear infinite'
    },
    successContainer: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative',
        fontFamily: "'Montserrat', sans-serif",
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
    },
    successContent: {
        textAlign: 'center',
        maxWidth: '500px',
        padding: '2rem',
        background: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    successIcon: {
        width: '80px',
        height: '80px',
        color: '#10b981',
        marginBottom: '1.5rem'
    },
    successTitle: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#10b981'
    },
    successMessage: {
        fontSize: '1.1rem',
        marginBottom: '0.5rem',
        color: 'rgba(255,255,255,0.8)'
    },
    successRedirect: {
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic'
    }
};