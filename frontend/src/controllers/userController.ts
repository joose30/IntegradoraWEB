import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

export const recoverPassword = async (req: Request, recoveryToken: string, res: Response) => {
  const { email } = req.body;

  try {
    // Buscar al usuario por su correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'El correo no está registrado' });
    }

    // Guardar el token en el usuario
    user.recoveryToken = recoveryToken;
    await user.save();

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>Hola ${user.name},</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo para continuar:</p>
        <a href="http://localhost:3000/reset-password/${recoveryToken}">Restablecer contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    throw new Error('Error al enviar el correo');
  }
};

export const registerFingerprint = async (req: Request, res: Response) => {
    const { fingerprint } = req.body; // La huella enviada desde el frontend
    const userId = req.user?.id; // ID del usuario autenticado (agregado por el middleware)

    try {
        // Busca al usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Actualiza la huella del usuario
        user.fingerprint = fingerprint;
        await user.save();

        res.status(200).json({ message: 'Huella registrada con éxito.' });
    } catch (error) {
        console.error('Error al registrar la huella:', error);
        res.status(500).json({ message: 'Error al registrar la huella.' });
    }
};