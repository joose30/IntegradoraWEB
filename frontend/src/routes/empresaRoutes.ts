import express from 'express';
import Mision from '../models/Mision';
import Vision from '../models/Vision';
import Valor from '../models/Valor';
import Politica from '../models/Politica';
import {
  updateEmpresaData,
  addPregunta,
  addMision,
  addVision,
  addValor,
  addPolitica,
  getEmpresa,
  getPreguntas,
  getMisions,
  getVisions,
  getValors,
  getPoliticas,
} from '../controllers/empresaController';
import { Pregunta } from '../models/empresaModel';

const router = express.Router();

// Ruta para obtener todas las misiones
router.get('/misions', async (req, res) => {
  try {
    const misions = await Mision.find().lean(); // Obtiene todas las misiones
    res.json(misions); // Devuelve un array con todas las misiones
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las misiones' });
  }
});

// Ruta para obtener todas las visiones
router.get('/visions', async (req, res) => {
  try {
    const visions = await Vision.find().lean(); // Obtiene todas las visiones
    res.json(visions); // Devuelve un array con todas las visiones
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las visiones' });
  }
});

// Ruta para obtener todos los valores
router.get('/valors', async (req, res) => {
  try {
    const valors = await Valor.find().lean(); // Obtiene todos los valores
    res.json(valors); // Devuelve un array con todos los valores
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los valores' });
  }
});

// Ruta para obtener todas las políticas (ya está correcta)
router.get('/politicas', async (req, res) => {
  try {
    const politicas = await Politica.find().lean(); // Obtiene todas las políticas
    const formattedPoliticas = politicas.map(politica => ({
      id: politica._id,
      descripcion: politica.descripcion
    }));
    res.json(formattedPoliticas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las políticas' });
  }
});

// Ruta para obtener todas las preguntas
router.get('/preguntas', async (req, res) => {
  try {
    const preguntas = await Pregunta.find().lean();
    res.json(preguntas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las preguntas' });
  }
});

// Ruta para insertar una nueva misión
router.post('/misions', async (req, res) => {
  try {
    const { contenido } = req.body; // Asegúrate de que el frontend envíe este campo
    const nuevaMision = new Mision({ contenido });
    await nuevaMision.save();
    res.status(201).json(nuevaMision); // Devuelve la misión recién creada
  } catch (err) {
    console.error('Error al insertar misión:', err);
    res.status(500).json({ message: 'Error al insertar misión' });
  }
});

// Ruta para insertar una nueva visión
router.post('/visions', async (req, res) => {
  try {
    const { contenido } = req.body;
    const nuevaVision = new Vision({ contenido });
    await nuevaVision.save();
    res.status(201).json(nuevaVision);
  } catch (err) {
    console.error('Error al insertar visión:', err);
    res.status(500).json({ message: 'Error al insertar visión' });
  }
});

// Ruta para insertar un nuevo valor
router.post('/valors', async (req, res) => {
  try {
    const { contenido } = req.body;
    const nuevoValor = new Valor({ contenido });
    await nuevoValor.save();
    res.status(201).json(nuevoValor);
  } catch (err) {
    console.error('Error al insertar valor:', err);
    res.status(500).json({ message: 'Error al insertar valor' });
  }
});

// Ruta para insertar una nueva política
router.post('/politicas', async (req, res) => {
  try {
    const { descripcion } = req.body;
    const nuevaPolitica = new Politica({ descripcion });
    await nuevaPolitica.save();
    res.status(201).json(nuevaPolitica);
  } catch (err) {
    console.error('Error al insertar política:', err);
    res.status(500).json({ message: 'Error al insertar política' });
  }
});

// Rutas PUT y POST para crear y actualizar datos
router.put('/empresa/actualizar-todos', updateEmpresaData);
router.post('/empresa/preguntas', addPregunta);
router.post('/empresa/misiones', addMision);
router.post('/empresa/visiones', addVision);
router.post('/empresa/valores', addValor);
router.post('/empresa/politicas', addPolitica);

// Rutas GET para obtener datos
router.get('/empresa', getEmpresa);
router.get('/empresa/preguntas', getPreguntas);
router.get('/empresa/misiones', getMisions);
router.get('/empresa/visiones', getVisions);
router.get('/empresa/valores', getValors);
router.get('/empresa/politicas', getPoliticas);

console.log('Rutas de empresa cargadas');

export default router;