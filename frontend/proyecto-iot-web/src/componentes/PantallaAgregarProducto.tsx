import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PantallaAgregarProducto: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validar el tipo de archivo
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        alert("Por favor selecciona un archivo de imagen válido (jpg, jpeg, png, gif).");
        e.target.value = ""; // Limpiar el input de archivo
        return;
      }

      setImage(file); // Si es válido, guardar el archivo
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const preset_name = "ml_default";
    const cloud_name = "dnwpy45qa";

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", preset_name);

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setLoading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!name || !description || !price || !category || !image) {
      alert("Por favor completa todos los campos");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) {
      alert("Error al subir la imagen");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8082/api/products/add",
        {
          name,
          description,
          price,
          category,
          image: imageUrl,
        }
      );
      if (response.status === 201) {
        console.log("Producto agregado:", response.data);
        alert("Producto agregado exitosamente");
        // Resetear formulario
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Error al agregar el producto");
    }
  };

  return (
    <div className="premium-container">
      <div className="particle-background"></div>

      <div className="premium-card">
        <div className="header-container">
          <h1 className="premium-title">
            <span className="title-highlight">Agregar</span> Producto
          </h1>
          <div className="title-decoration"></div>
        </div>

        <div className="premium-form-container">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ingresa el nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ingresa la descripción del producto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Precio</label>
            <input
              type="number"
              className="form-input"
              placeholder="Ingresa el precio del producto"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Puerta Inteligente">Puerta Inteligente</option>
              <option value="Cerradura Inteligente">Cerradura Inteligente</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Imagen</label>
            <div className="file-input-container">
              <label className="file-input-label">
                {image ? image.name : "Seleccionar imagen"}
                <input
                  type="file"
                  className="file-input"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <button
            className={`form-button ${hoveredButton ? "hover" : ""}`}
            onClick={handleAddProduct}
            disabled={loading}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            {loading ? (
              <div className="button-spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
              </div>
            ) : (
              "Agregar Producto"
            )}
          </button>
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

        .premium-form-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .form-input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 30, 60, 0.8);
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.3);
        }

        .file-input-container {
          position: relative;
        }

        .file-input-label {
          display: block;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px dashed rgba(255, 255, 255, 0.3);
          background: rgba(30, 30, 60, 0.5);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .file-input-label:hover {
          background: rgba(30, 30, 60, 0.7);
          border-color: #5c6bc0;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          overflow: hidden;
          z-index: -1;
        }

        .form-button {
          padding: 1rem;
          border-radius: 8px;
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .form-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .form-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-spinner {
          display: flex;
          gap: 0.5rem;
        }

        .spinner-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .spinner-circle:nth-child(1) {
          animation-delay: 0s;
        }

        .spinner-circle:nth-child(2) {
          animation-delay: 0.2s;
        }

        .spinner-circle:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default PantallaAgregarProducto;