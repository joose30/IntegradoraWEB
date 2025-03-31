import { useLocation } from "react-router-dom"

type Product = {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export default function ProductoDetail() {
  const location = useLocation()
  const product: Product = location.state?.product

  if (!product) {
    return (
      <div className="premium-error-screen">
        <div className="error-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h3 className="error-title">¡Error!</h3>
        <p className="error-message">Producto no encontrado</p>
      </div>
    )
  }

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
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
          </div>

          <div className="product-info-container">
            <div className="product-info-section">
              <h2 className="section-title">Descripción</h2>
              <p className="product-description">{product.description || "Sin descripción disponible."}</p>
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
          </div>
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

                /* Animations */
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .product-detail-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .premium-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
    </div>
  )
}