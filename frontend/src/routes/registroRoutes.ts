import { Router } from 'express';
import { 
    getRegistros, 
    addRegistro,
    getUltimosRegistros 
} from '../controllers/registroController';

const router = Router();

// Obtener todos los registros (con límite opcional)
router.get('/', getRegistros);

// Obtener los últimos N registros (para dashboard)
router.get('/ultimos', getUltimosRegistros);

// Agregar nuevo registro
router.post('/', addRegistro);

// Mantener compatibilidad con la ruta anterior
router.get('/get', getRegistros);

export default router;