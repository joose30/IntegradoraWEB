import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export default function PantallaCatalogoProductos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/products/get");
        if (response.status === 200) {
          setProducts(response.data as Product[]);
        }
      } catch (err) {
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/products/categories");
        if (response.status === 200) {
          setCategories(response.data as string[]);
        }
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleProductClick = (product: Product) => {
    navigate('/productoDetail', { state: { product } });
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="premium-loading-container">
        <div className="premium-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="premium-loading-text">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-icon-container">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h3 className="error-title">¡Error!</h3>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="particle-background"></div>
      
      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Catálogo</span> de Productos
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="filter-container">
          <label className="filter-label">Filtrar por categoría:</label>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className={`product-card ${hoveredProduct === product._id ? 'hover' : ''}`}
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-overlay"></div>
              </div>
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className="product-category">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-container">
          <button
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <svg viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {Math.ceil(filteredProducts.length / productsPerPage)}
          </span>
          <button
            className={`pagination-button ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
          >
            Siguiente
            <svg viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>

        <Link to="/carrito" className="cart-link">
          <svg viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          Ver Carrito
        </Link>
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

        .filter-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .filter-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 30, 60, 0.8);
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          min-width: 200px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.3);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .product-card {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: rgba(92, 107, 192, 0.3);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(26, 26, 46, 0.8), transparent);
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 0.5;
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }

        .product-description {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2ecc71;
        }

        .product-category {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: rgba(92, 107, 192, 0.2);
          color: #a5b4fc;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 3rem;
          gap: 1.5rem;
        }

        .pagination-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          background: rgba(92, 107, 192, 0.2);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .pagination-button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .pagination-button:hover:not(.disabled) {
          background: rgba(92, 107, 192, 0.4);
          transform: translateY(-2px);
        }

        .pagination-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .cart-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          color: #2ecc71;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s;
        }

        .cart-link svg {
          width: 20px;
          height: 20px;
          fill: #2ecc71;
        }

        .cart-link:hover {
          color: #27ae60;
          transform: translateY(-2px);
        }

        .cart-link:hover svg {
          fill: #27ae60;
        }

        /* Loading styles */
        .premium-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .premium-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }

        .spinner-circle {
          width: 15px;
          height: 15px;
          margin: 0 5px;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .spinner-circle:nth-child(1) {
          background: #5c6bc0;
          animation-delay: 0s;
        }

        .spinner-circle:nth-child(2) {
          background: #3949ab;
          animation-delay: 0.2s;
        }

        .spinner-circle:nth-child(3) {
          background: #8e24aa;
          animation-delay: 0.4s;
        }

        .premium-loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.25rem;
          letter-spacing: 1px;
        }

        /* Error styles */
        .premium-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .error-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          width: 40px;
          height: 40px;
          fill: #ef4444;
        }

        .error-title {
          font-size: 1.5rem;
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

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}