import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const GestionarUsuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<User[]>("http://localhost:8082/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar los usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8082/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
      alert("Usuario eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar el usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8082/api/users/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(users.map((user) => (user._id === editingUser._id ? (response.data as User) : user)));
      setEditingUser(null);
      alert("Usuario actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      alert("No se pudo actualizar el usuario.");
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
        <p className="premium-loading-text">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-icon-container">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
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
            <span className="title-highlight">Gestión</span> de Usuarios
          </h1>
          <div className="title-decoration"></div>
        </div>

        {editingUser && (
          <div className="premium-edit-form animate-fade-in">
            <h2 className="edit-form-title">Editar Usuario</h2>
            <div className="form-group">
              <label className="form-label">Nombre:</label>
              <input
                type="text"
                className="form-input"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Correo:</label>
              <input
                type="email"
                className="form-input"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rol:</label>
              <select
                className="form-select"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
              </select>
            </div>
            <div className="form-buttons">
              <button className="form-button save-button" onClick={handleSaveUser}>
                Guardar
              </button>
              <button className="form-button cancel-button" onClick={() => setEditingUser(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th className="table-header">Nombre</th>
                <th className="table-header">Correo</th>
                <th className="table-header">Rol</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={`table-row ${hoveredRow === user._id ? "hover" : ""}`}
                  onMouseEnter={() => setHoveredRow(user._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="table-cell">{user.name}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">{user.role}</td>
                  <td className="table-cell actions-cell">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        .premium-edit-form {
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(92, 107, 192, 0.3);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .edit-form-title {
          font-size: 1.5rem;
          color: #a5b4fc;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 30, 60, 0.8);
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.3);
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .form-button {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .save-button {
          background: linear-gradient(90deg, #5c6bc0, #3949ab);
          color: white;
        }

        .cancel-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .form-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .premium-table-container {
          overflow-x: auto;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(30, 30, 60, 0.6);
          border-radius: 15px;
          overflow: hidden;
        }

        .table-header {
          padding: 1.25rem 1.5rem;
          text-align: left;
          background: rgba(92, 107, 192, 0.5);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.5px;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }

        .table-row:hover {
          background: rgba(92, 107, 192, 0.2) !important;
        }

        .table-row:nth-child(even) {
          background: rgba(255, 255, 255, 0.03);
        }

        .table-cell {
          padding: 1.25rem 1.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .actions-cell {
          display: flex;
          gap: 0.75rem;
        }

        .action-button {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .edit-button {
          background: rgba(92, 107, 192, 0.2);
          color: #a5b4fc;
          border: 1px solid rgba(92, 107, 192, 0.3);
        }

        .delete-button {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default GestionarUsuarios;