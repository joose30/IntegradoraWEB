import express from 'express';
import { registerDevice, getDevices, getUserDevices, getDeviceInfo } from '../controllers/deviceController';
import { authMiddleware } from './userRoutes'; // Importar el middleware de autenticación

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.post('/register', authMiddleware, registerDevice);
router.get('/', authMiddleware, getDevices);
router.get('/user', authMiddleware, getUserDevices);
router.get('/:deviceId', authMiddleware, getDeviceInfo);

export default router;