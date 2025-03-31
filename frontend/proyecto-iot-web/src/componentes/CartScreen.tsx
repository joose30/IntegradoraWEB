import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartScreen() {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div style={styles.emptyCartContainer}>
                <div className="animate-fade-in" style={styles.emptyCartContent}>
                    <div style={styles.emptyCartIcon}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    <h2 style={styles.emptyCartTitle}>El carrito está vacío</h2>
                    <button 
                        style={styles.exploreButton}
                        onClick={() => navigate('/Productos')}
                        className="animate-pulse"
                    >
                        Explorar productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.cartContainer}>
            <div style={styles.cartContent}>
                <h1 className="animate-fade-in" style={styles.title}>Carrito de Compras</h1>
                
                <ul style={styles.cartList}>
                    {cart.map((item, index) => (
                        <li 
                            key={item.product._id} 
                            className="animate-slide-up"
                            style={{ 
                                ...styles.cartItem,
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <div style={styles.imageContainer}>
                                <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    style={styles.productImage} 
                                />
                            </div>
                            <div style={styles.itemDetails}>
                                <h2 style={styles.productName}>{item.product.name}</h2>
                                <p style={styles.productPrice}>Precio: ${item.product.price}</p>
                                <p style={styles.productQuantity}>Cantidad: {item.quantity}</p>
                                <button 
                                    style={styles.removeButton}
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="hover-effect"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="animate-fade-in" style={styles.actionsContainer}>
                    <button 
                        style={styles.clearCartButton}
                        onClick={clearCart}
                        className="hover-effect"
                    >
                        Vaciar carrito
                    </button>
                    <button 
                        style={styles.checkoutButton}
                        onClick={handleCheckout}
                        className="hover-effect"
                    >
                        Realizar compra
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Estilos CSS con animaciones */}
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    opacity: 0;
                }

                .animate-pulse {
                    animation: pulse 2s infinite;
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

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    cartContainer: {
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    
    cartContent: {
        width: '100%',
        maxWidth: '1200px',
        background: 'rgba(26, 26, 46, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    
    title: {
        fontSize: '2.2rem',
        fontWeight: 800,
        marginBottom: '2rem',
        background: 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 15px rgba(165, 180, 252, 0.3)'
    },
    
    cartList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 2rem 0'
    },
    
    cartItem: {
        display: 'flex',
        marginBottom: '1.5rem',
        background: 'rgba(30, 30, 60, 0.6)',
        borderRadius: '15px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
    },
    
    imageContainer: {
        width: '120px',
        height: '120px',
        marginRight: '1.5rem',
        flexShrink: 0,
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)'
    },
    
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    
    itemDetails: {
        flexGrow: 1
    },
    
    productName: {
        marginTop: 0,
        marginBottom: '0.5rem',
        color: '#fff'
    },
    
    productPrice: {
        margin: '0.5rem 0',
        color: 'rgba(255, 255, 255, 0.8)'
    },
    
    productQuantity: {
        margin: '0.5rem 0',
        color: 'rgba(255, 255, 255, 0.8)'
    },
    
    removeButton: {
        padding: '0.5rem 1rem',
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: '0.5rem'
    },
    
    actionsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem'
    },
    
    clearCartButton: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(92, 107, 192, 0.2)',
        color: '#a5b4fc',
        border: '1px solid rgba(92, 107, 192, 0.3)',
        borderRadius: '30px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    
    checkoutButton: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        border: 'none',
        borderRadius: '30px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center'
    },
    
    emptyCartContainer: {
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    emptyCartContent: {
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
    },
    
    emptyCartIcon: {
        marginBottom: '1.5rem',
        color: '#6c757d'
    },
    
    emptyCartTitle: {
        fontSize: '1.75rem',
        marginBottom: '1rem',
        color: '#fff',
        background: 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    
    exploreButton: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(92, 107, 192, 0.2)',
        color: '#a5b4fc',
        border: '1px solid rgba(92, 107, 192, 0.3)',
        borderRadius: '30px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        textDecoration: 'none'
    }
};