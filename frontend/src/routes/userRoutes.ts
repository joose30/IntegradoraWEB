import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { recoverPassword, registerFingerprint } from '../controllers/userController';
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import crypto from 'crypto';

// Extender la interfaz Request para incluir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

interface JwtPayload {
  id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado Authorization

  if (!token) {
    console.log("No se proporcionó un token");
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
    console.log("Token decodificado:", decoded);
    req.user = { id: decoded.id }; // Agregar el ID del usuario al objeto req
    next();
  } catch (error) {
    console.log("Token inválido:", error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

const router = express.Router();

// Ruta para manejar el inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña enviada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h", // El token expira en 1 hora
    });

    // Respuesta exitosa con el token
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // Devuelve el token al frontend
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, lastName, surname, phone, email, password, secretQuestion, secretAnswer } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      lastName,
      surname,
      phone,
      email,
      password: hashedPassword,
      secretQuestion,
      secretAnswer,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta para recuperación de contraseña
router.post('/recover-password', async (req, res) => {
  try {
    const { email } = req.body;
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    await recoverPassword(req, recoveryToken, res);
  } catch (error) {
    console.error('Error en la recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error en la recuperación de contraseña' });
  }
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Buscar al usuario por el token de recuperación
    const user = await User.findOne({ recoveryToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Verificar que el token no sea null (aunque ya lo validamos con la consulta)
    if (!user.recoveryToken) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña y limpiar el token de recuperación
    user.password = hashedPassword;
    user.recoveryToken = null; // Limpia el token de recuperación
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

router.post('/validate-question', async (req, res) => {
  const { email, secretQuestion, secretAnswer } = req.body;

  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar la pregunta secreta y la respuesta
    if (user.secretQuestion !== secretQuestion || user.secretAnswer !== secretAnswer) {
      return res.status(400).json({ message: 'Pregunta o respuesta incorrecta' });
    }

    // Generar un token único para la recuperación
    const recoveryToken = Math.random().toString(36).substr(2);
    user.recoveryToken = recoveryToken;
    await user.save();

    // Llamar a la función recoverPassword
    await recoverPassword(req, recoveryToken, res);

    res.status(200).json({ message: 'Validación exitosa. Correo de recuperación enviado.' });
  } catch (error) {
    console.error('Error al validar la pregunta secreta o enviar el correo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/validate-email', async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    res.status(200).json({ message: 'Correo válido', success: true });
  } catch (error) {
    console.error('Error al validar el correo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.get('/usuario', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id; // Verificar si req.user está definido antes de acceder a id
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.put('/usuario', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id; // Verificar si req.user está definido antes de acceder a id
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const { name, lastName, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, lastName, email, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Datos actualizados correctamente', user });
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true } // Devuelve el usuario actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

router.put('/:id/update-pin', async (req, res) => {
  const { id } = req.params;
  const { devicePin } = req.body;

  if (!devicePin || devicePin.length !== 4 || !/^\d+$/.test(devicePin)) {
    return res.status(400).json({ message: 'El PIN debe ser de exactamente 4 dígitos.' });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { devicePin }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ message: 'PIN actualizado correctamente.', user });
  } catch (error) {
    console.error('Error al actualizar el PIN:', error);
    res.status(500).json({ message: 'Error al actualizar el PIN.' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find(); // Obtén todos los usuarios
    res.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log("ID recibido para eliminar:", req.params.id); // Log para depurar
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

router.get('/secret-questions', async (req, res) => {
  try {
    const questions = await mongoose.connection.collection('preguntassecretas').find().toArray();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error al obtener las preguntas secretas:', error);
    res.status(500).json({ message: 'Error al obtener las preguntas secretas' });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const questions = await mongoose.connection
      .collection("preguntassecretas") // Nombre de la colección
      .find()
      .toArray();

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error al obtener las preguntas secretas:", error);
    res.status(500).json({ message: "Error al obtener las preguntas secretas" });
  }
});

// Ruta para registrar la huella del usuario
router.post('/registrar-huella', authMiddleware, registerFingerprint);

// Ruta para actualizar el PIN de un usuario específico
router.put('/api/users/:id/update-pin', async (req, res) => {
  const { id } = req.params; // ID del usuario objetivo
  const { devicePin } = req.body;

  if (!devicePin || devicePin.length !== 4 || !/^\d+$/.test(devicePin)) {
    return res.status(400).json({ message: 'El PIN debe ser de exactamente 4 dígitos.' });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { devicePin }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ message: 'PIN actualizado correctamente.', user });
  } catch (error) {
    console.error('Error al actualizar el PIN:', error);
    res.status(500).json({ message: 'Error al actualizar el PIN.' });
  }
});

export default router;