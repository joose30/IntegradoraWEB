import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PantallaRecuperarConPregunta: React.FC = () => {
  const [email, setEmail] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState<{ id: string; pregunta: string }[]>([]);
  const [isEmailValidated, setIsEmailValidated] = useState(false); // Nuevo estado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<{ id: string; pregunta: string }[]>(
          "http://localhost:8082/api/users/questions"
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas secretas:", error);
        setMessage("Error al cargar las preguntas secretas");
      }
    };

    fetchQuestions();
  }, []);

  const handleValidateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "http://localhost:8082/api/users/validate-email",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setIsEmailValidated(true); // Cambiar el estado para mostrar el resto del formulario
      }
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error al conectar con el servidor");
      }
    }
  };

  const handleValidateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ message: string; success: boolean }>(
        "http://localhost:8082/api/users/validate-question",
        {
          email,
          secretQuestion,
          secretAnswer,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recuperar con Pregunta Secreta</h2>
      {!isEmailValidated ? (
        <form onSubmit={handleValidateEmail} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="Ingresa tu correo electrónico"
          />
          <button type="submit" style={styles.button}>
            Validar correo
          </button>
        </form>
      ) : (
        <form onSubmit={handleValidateQuestion} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            disabled // Deshabilitar el campo de correo
            style={styles.input}
          />

          <label style={styles.label}>Pregunta secreta:</label>
          <select
            value={secretQuestion}
            onChange={(e) => setSecretQuestion(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Selecciona una pregunta</option>
            {questions.map((q) => (
              <option key={q.id} value={q.pregunta}>
                {q.pregunta}
              </option>
            ))}
          </select>

          <label style={styles.label}>Respuesta:</label>
          <input
            type="text"
            value={secretAnswer}
            onChange={(e) => setSecretAnswer(e.target.value)}
            required
            style={styles.input}
            placeholder="Ingresa tu respuesta"
          />

          <button type="submit" style={styles.button}>
            Validar respuesta
          </button>
        </form>
      )}
      {message && (
        <p
          style={{
            ...styles.message,
            color: message.includes("Error") ? "#dc3545" : "#28a745",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default PantallaRecuperarConPregunta;