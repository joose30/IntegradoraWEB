// frontend/src/routes/doorRoutes.ts
import express from 'express';
import {
  registerDoorStatus,
  getLastDoorStatus,
  handleStatusChange
} from '../controllers/doorController';

const router = express.Router();

// Registrar estado de la puerta
router.post('/status', registerDoorStatus);

// Obtener último estado de la puerta
router.get('/status/:deviceId', getLastDoorStatus);

// Endpoint para el Arduino
router.post('/status-change', handleStatusChange);

// Endpoint para verificar estado desde el Arduino
router.get('/arduino-status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Añade esta línea al final
export default router;